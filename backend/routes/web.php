<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => "Vjay's Bike Parts & Accessories API",
        'status' => 'online',
        'version' => '1.0.0',
    ]);
});
