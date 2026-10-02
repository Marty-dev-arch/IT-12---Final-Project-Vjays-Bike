<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\PinResetCode;
use App\Models\User;
use App\Services\SmsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new phone number
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', 'min:10'],
            'name' => ['nullable', 'string', 'max:255'],
        ]);

        $normalizedPhone = SmsService::normalizePhone($validated['phone']);
        $localPhone = SmsService::normalizeLocalPhone($validated['phone']);

        $user = User::where('phone', $validated['phone'])
            ->orWhere('phone', $normalizedPhone)
            ->orWhere('phone', $localPhone)
            ->first();

        if (!$user) {
            $user = User::create([
                'phone' => $normalizedPhone,
                'name' => $validated['name'] ?? 'Vjay',
                'role' => 'owner',
            ]);
        }

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

    /**
     * Set or update security PIN for a user
     */
    public function createPin(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string'],
            'pin' => ['required', 'string', 'size:6', 'regex:/^[0-9]{6}$/'],
            'code' => ['nullable', 'string', 'size:6'], // Optional verification code
        ]);

        // Validate sequentially repeating PINs
        $sequential = ['012345', '123456', '234567', '345678', '456789', '567890', '000000', '111111', '222222', '333333', '444444', '555555', '666666', '777777', '888888', '999999'];
        if (in_array($validated['pin'], $sequential)) {
            throw ValidationException::withMessages([
                'pin' => ['PIN is too simple or predictable.'],
            ]);
        }

        $phone = $validated['phone'];
        $normalizedPhone = SmsService::normalizePhone($phone);
        $localPhone = SmsService::normalizeLocalPhone($phone);

        // If a verification code was provided, verify it first
        if (!empty($validated['code'])) {
            $validCode = PinResetCode::where(function ($q) use ($phone, $normalizedPhone, $localPhone) {
                $q->where('phone', $phone)
                  ->orWhere('phone', $normalizedPhone)
                  ->orWhere('phone', $localPhone);
            })
            ->where('code', $validated['code'])
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

            if (!$validCode) {
                return response()->json([
                    'message' => 'Invalid or expired phone verification code.',
                ], 422);
            }

            PinResetCode::where(function ($q) use ($phone, $normalizedPhone, $localPhone) {
                $q->where('phone', $phone)
                  ->orWhere('phone', $normalizedPhone)
                  ->orWhere('phone', $localPhone);
            })->delete();
        }

        $user = User::where('phone', $phone)
            ->orWhere('phone', $normalizedPhone)
            ->orWhere('phone', $localPhone)
            ->first();

        if (!$user) {
            $user = User::create([
                'phone' => $normalizedPhone,
                'name' => 'Vjay',
                'role' => 'owner',
            ]);
        }

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

    /**
     * Standard Login with PIN (or Phone + PIN)
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['nullable', 'string'],
            'pin' => ['required', 'string', 'size:6'],
        ]);

        $query = User::query();
        if (!empty($validated['phone'])) {
            $phone = $validated['phone'];
            $normalizedPhone = SmsService::normalizePhone($phone);
            $localPhone = SmsService::normalizeLocalPhone($phone);
            $query->where(function ($q) use ($phone, $normalizedPhone, $localPhone) {
                $q->where('phone', $phone)
                  ->orWhere('phone', $normalizedPhone)
                  ->orWhere('phone', $localPhone);
            });
        }

        $user = $query->first();

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
     * Send a 6-digit OTP code to phone number for PIN reset via SMS
     * (Secure: Does NOT leak OTP code in response; persists in DB & dispatches via SMS API)
     */
    public function sendResetCode(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', 'min:10'],
        ]);

        $phone = $validated['phone'];
        $normalizedPhone = SmsService::normalizePhone($phone);
        $localPhone = SmsService::normalizeLocalPhone($phone);

        // Verify account exists with this phone number
        $user = User::where('phone', $phone)
            ->orWhere('phone', $normalizedPhone)
            ->orWhere('phone', $localPhone)
            ->first();

        if (!$user) {
            return response()->json([
                'message' => 'No account found with this phone number. Please check the number or register.',
            ], 404);
        }

        // Rate limiting: check if a code was created within the last 60 seconds
        $recentCode = PinResetCode::where(function ($q) use ($phone, $normalizedPhone, $localPhone) {
            $q->where('phone', $phone)
              ->orWhere('phone', $normalizedPhone)
              ->orWhere('phone', $localPhone);
        })
        ->where('created_at', '>=', now()->subSeconds(60))
        ->first();

        if ($recentCode) {
            return response()->json([
                'message' => 'Please wait 60 seconds before requesting another verification code.',
            ], 429);
        }

        // Remove old codes for this phone
        PinResetCode::where('phone', $phone)
            ->orWhere('phone', $normalizedPhone)
            ->orWhere('phone', $localPhone)
            ->delete();

        // Generate a cryptographically secure 6-digit numeric OTP
        $code = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

        // Dispatch via SMS Service with auto-fallback & save to database
        $dispatchResult = SmsService::sendVerificationPin($phone, $code, 'reset');

        return response()->json([
            'success' => true,
            'message' => $dispatchResult['message'],
            'phone' => $dispatchResult['phone'],
            'channel' => $dispatchResult['channel'],
            'expires_in' => $dispatchResult['expires_in'],
            // Code is safely excluded from response for production security
        ]);
    }

    /**
     * Request a verification code for creating PIN or logging in with phone
     */
    public function requestPinCode(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string', 'min:10'],
            'purpose' => ['nullable', 'string', 'in:create_pin,login,reset'],
        ]);

        $phone = $validated['phone'];
        $purpose = $validated['purpose'] ?? 'create_pin';
        $normalizedPhone = SmsService::normalizePhone($phone);
        $localPhone = SmsService::normalizeLocalPhone($phone);

        // Rate limiting: 60 seconds
        $recentCode = PinResetCode::where(function ($q) use ($phone, $normalizedPhone, $localPhone) {
            $q->where('phone', $phone)
              ->orWhere('phone', $normalizedPhone)
              ->orWhere('phone', $localPhone);
        })
        ->where('created_at', '>=', now()->subSeconds(60))
        ->first();

        if ($recentCode) {
            return response()->json([
                'message' => 'Please wait 60 seconds before requesting another verification code.',
            ], 429);
        }

        // Clean old codes
        PinResetCode::where('phone', $phone)
            ->orWhere('phone', $normalizedPhone)
            ->orWhere('phone', $localPhone)
            ->delete();

        // Generate 6-digit code
        $code = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

        // Dispatch via SMS API with auto-fallback & database logging
        $dispatchResult = SmsService::sendVerificationPin($phone, $code, $purpose);

        return response()->json([
            'success' => true,
            'message' => $dispatchResult['message'],
            'phone' => $dispatchResult['phone'],
            'channel' => $dispatchResult['channel'],
            'expires_in' => $dispatchResult['expires_in'],
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
        $normalizedPhone = SmsService::normalizePhone($phone);
        $localPhone = SmsService::normalizeLocalPhone($phone);

        $resetCode = PinResetCode::where(function ($q) use ($phone, $normalizedPhone, $localPhone) {
            $q->where('phone', $phone)
              ->orWhere('phone', $normalizedPhone)
              ->orWhere('phone', $localPhone);
        })
        ->where('code', $code)
        ->where('expires_at', '>', now())
        ->latest()
        ->first();

        if (!$resetCode) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired verification code. Please check your SMS or request a new code.',
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
     * Alias for general code verification (create PIN / phone login)
     */
    public function verifyPinCode(Request $request)
    {
        return $this->verifyResetCode($request);
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
        $normalizedPhone = SmsService::normalizePhone($phone);
        $localPhone = SmsService::normalizeLocalPhone($phone);

        // Verify the code exists and is not expired
        $resetCode = PinResetCode::where(function ($q) use ($phone, $normalizedPhone, $localPhone) {
            $q->where('phone', $phone)
              ->orWhere('phone', $normalizedPhone)
              ->orWhere('phone', $localPhone);
        })
        ->where('code', $code)
        ->where('expires_at', '>', now())
        ->latest()
        ->first();

        if (!$resetCode) {
            return response()->json([
                'message' => 'Invalid or expired verification code. Please request a new code.',
            ], 422);
        }

        $user = User::where('phone', $phone)
            ->orWhere('phone', $normalizedPhone)
            ->orWhere('phone', $localPhone)
            ->firstOrFail();

        $user->pin_hash = Hash::make($validated['new_pin']);
        $user->save();

        // Invalidate / consume all reset codes for this phone
        PinResetCode::where(function ($q) use ($phone, $normalizedPhone, $localPhone) {
            $q->where('phone', $phone)
              ->orWhere('phone', $normalizedPhone)
              ->orWhere('phone', $localPhone);
        })->delete();

        try {
            AuditLog::create([
                'action' => 'PIN Reset Successful',
                'type' => 'verification',
                'details' => "Security PIN successfully updated for user {$user->name} ({$user->phone})",
                'user_id' => $user->id,
            ]);
        } catch (\Throwable $e) {}

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
     * Login directly using a one-time SMS verification code
     */
    public function loginWithCode(Request $request)
    {
        $validated = $request->validate([
            'phone' => ['required', 'string'],
            'code' => ['required', 'string', 'size:6'],
        ]);

        $phone = $validated['phone'];
        $code = $validated['code'];
        $normalizedPhone = SmsService::normalizePhone($phone);
        $localPhone = SmsService::normalizeLocalPhone($phone);

        $resetCode = PinResetCode::where(function ($q) use ($phone, $normalizedPhone, $localPhone) {
            $q->where('phone', $phone)
              ->orWhere('phone', $normalizedPhone)
              ->orWhere('phone', $localPhone);
        })
        ->where('code', $code)
        ->where('expires_at', '>', now())
        ->latest()
        ->first();

        if (!$resetCode) {
            return response()->json([
                'message' => 'Invalid or expired SMS login code. Please request a new one.',
            ], 422);
        }

        $user = User::where('phone', $phone)
            ->orWhere('phone', $normalizedPhone)
            ->orWhere('phone', $localPhone)
            ->first();

        if (!$user) {
            $user = User::create([
                'phone' => $normalizedPhone,
                'name' => 'Vjay',
                'role' => 'owner',
            ]);
        }

        // Delete used code
        PinResetCode::where(function ($q) use ($phone, $normalizedPhone, $localPhone) {
            $q->where('phone', $phone)
              ->orWhere('phone', $normalizedPhone)
              ->orWhere('phone', $localPhone);
        })->delete();

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Authenticated successfully via SMS verification code',
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

        $phone = $validated['phone'];
        $normalizedPhone = SmsService::normalizePhone($phone);
        $localPhone = SmsService::normalizeLocalPhone($phone);

        $user = User::where('phone', $phone)
            ->orWhere('phone', $normalizedPhone)
            ->orWhere('phone', $localPhone)
            ->firstOrFail();

        $user->pin_hash = Hash::make($validated['new_pin']);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'PIN has been reset successfully',
        ]);
    }
}
