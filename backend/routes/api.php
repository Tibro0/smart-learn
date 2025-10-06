<?php

use App\Http\Controllers\Frontend\AccountController;
use App\Http\Controllers\Frontend\CourseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::controller(AccountController::class)->group(function () {
    Route::post('register', 'register');
    Route::post('login', 'authenticate');
});

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::controller(CourseController::class)->group(function () {
        Route::post('courses', 'store');
        Route::get('courses/{id}', 'show');
        Route::post('courses/meta-data', 'metaData');
        Route::put('courses/{id}', 'update');
    });
});
