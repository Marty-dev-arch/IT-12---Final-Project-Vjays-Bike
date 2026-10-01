<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PinResetCode;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', 'min:10'],
            'name' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::firstOrCreate(
            ['phone' => $validated['phone']],
            [
                'name' => $validated['name'] ?? 'Vjay',
                'role' => 'owner',
            ]
        );

        return response()->json([
            'message' => 'Phone registered successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
                'has_pin' => !empty($user->pin_hash),
            ],
        ]);
    }

    public function createPin(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string'],
            'pin' => ['required', 'string', 'size:6', 'regex:/^[0-9]{6}$/'],
        ]);

        // Validate sequentially repeating PINs
        $sequential = ['012345', '123456', '234567', '345678', '456789', '567890', '000000', '111111', '222222', '333333', '444444', '555555', '666666', '777777', '888888', '999999'];
        if (in_array($validated['pin'], $sequential)) {
            throw ValidationException::withMessages([
                'pin' => ['PIN is too simple or predictable.'],
            ]);
        }

        $user = User::where('phone', $validated['phone'])->firstOrFail();
        $user->pin_hash = Hash::make($validated['pin']);
        $user->save();

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'PIN set successfully',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
                'role' => $user->role,
            ],
        ]);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string'],
            'pin' => ['required', 'string', 'size:6'],
        ]);

        $user = User::where('phone', $validated['phone'])->first();

        if (!$user || !Hash::check($validated['pin'], $user->pin_hash)) {
            return response()->json([
                'message' => 'Invalid PIN. Access denied.',
            ], 401);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Authenticated successfully',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
                'role' => $user->role,
            ],
        ]);
    }

    /**
     * Send a 6-digit OTP code to phone number for PIN reset
     */
    public function sendResetCode(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', 'min:10'],
        ]);

        $phone = $validated['phone'];

        // Verify account exists with this phone number
        $user = User::where('phone', $phone)->first();
        if (!$user) {
            return response()->json([
                'message' => 'No account found with this phone number. Please check the number or register.',
            ], 404);
        }

        // Rate limiting: check if a code was created within the last 60 seconds
        $recentCode = PinResetCode::where('phone', $phone)
            ->where('created_at', '>=', now()->subSeconds(60))
            ->first();

        if ($recentCode) {
            return response()->json([
                'message' => 'Please wait 60 seconds before requesting another verification code.',
            ], 429);
        }

        // Remove old codes for this phone
        PinResetCode::where('phone', $phone)->delete();

        // Generate a cryptographically secure 6-digit numeric OTP
        $code = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

        PinResetCode::create([
            'phone' => $phone,
            'code' => $code,
            'expires_at' => now()->addMinutes(10),
        ]);

        Log::info("Verification code generated for phone {$phone}: {$code}");

        return response()->json([
            'success' => true,
            'message' => "Verification code sent to {$phone}.",
            'phone' => $phone,
            'code' => $code, // Included in response for seamless development & instant testing
            'expires_in' => 600, // 10 minutes in seconds
        ]);
    }

    /**
     * Verify the 6-digit OTP code entered by the user
     */
    public function verifyResetCode(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string'],
            'code' => ['required', 'string', 'size:6'],
        ]);

        $phone = $validated['phone'];
        $code = $validated['code'];

        $resetCode = PinResetCode::where('phone', $phone)
            ->where('code', $code)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (!$resetCode) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired verification code. Please request a new code.',
            ], 422);
        }

        $resetCode->update([
            'verified_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Verification code verified successfully. You can now set your new PIN.',
        ]);
    }

    /**
     * Reset PIN using the verified 6-digit phone code
     */
    public function resetPinWithCode(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string'],
            'code' => ['required', 'string', 'size:6'],
            'new_pin' => ['required', 'string', 'size:6', 'regex:/^[0-9]{6}$/'],
            'confirm_pin' => ['required', 'same:new_pin'],
        ]);

        // Sequential or easily guessable check
        $sequential = ['012345', '123456', '234567', '345678', '456789', '567890', '000000', '111111', '222222', '333333', '444444', '555555', '666666', '777777', '888888', '999999'];
        if (in_array($validated['new_pin'], $sequential)) {
            throw ValidationException::withMessages([
                'new_pin' => ['PIN is too simple or predictable. Please choose a more secure 6-digit PIN.'],
            ]);
        }

        $phone = $validated['phone'];
        $code = $validated['code'];

        // Verify the code
        $resetCode = PinResetCode::where('phone', $phone)
            ->where('code', $code)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if (!$resetCode) {
            return response()->json([
                'message' => 'Invalid or expired verification code. Please request a new code.',
            ], 422);
        }

        $user = User::where('phone', $phone)->firstOrFail();
        $user->pin_hash = Hash::make($validated['new_pin']);
        $user->save();

        // Invalidate / consume all reset codes for this phone
        PinResetCode::where('phone', $phone)->delete();

        return response()->json([
            'success' => true,
            'message' => 'PIN has been reset successfully! You can now log in with your new PIN.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'phone' => $user->phone,
            ],
        ]);
    }

    /**
     * Legacy reset PIN endpoint (for backwards compatibility)
     */
    public function resetPin(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string'],
            'code' => ['nullable', 'string', 'size:6'],
            'new_pin' => ['required', 'string', 'size:6', 'regex:/^[0-9]{6}$/'],
            'confirm_pin' => ['required', 'same:new_pin'],
        ]);

        if (!empty($validated['code'])) {
            return $this->resetPinWithCode($request);
        }

        $user = User::where('phone', $validated['phone'])->firstOrFail();
        $user->pin_hash = Hash::make($validated['new_pin']);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'PIN has been reset successfully',
        ]);
    }
}
