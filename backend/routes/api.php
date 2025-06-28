<?php

use App\Http\Controllers\Frontend\AccountController;
use App\Http\Controllers\Frontend\ChapterController;
use App\Http\Controllers\Frontend\CourseController;
use App\Http\Controllers\Frontend\OutcomeController;
use App\Http\Controllers\Frontend\RequirementController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AccountController::class, 'register']);
Route::post('/login', [AccountController::class, 'authenticate']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::group(['middleware' => ['auth:sanctum']], function () {
    // Course All Route
    Route::post('/save-courses-image/{id}', [CourseController::class, 'saveCourseImage']);
    Route::get('/courses/meta-data', [CourseController::class, 'metaData']);
    Route::resource('/courses', CourseController::class);
    // Outcome All Route
    Route::post('/sort-outcomes', [OutcomeController::class, 'sortOutcomes']);
    Route::resource('/outcomes', OutcomeController::class);
    // Requirement All Route
    Route::post('/sort-requirements', [RequirementController::class, 'sortRequirements']);
    Route::resource('/requirements', RequirementController::class);

    // Chapter All Route
    Route::post('/sort-chapters', [ChapterController::class, 'sortChapters']);
    Route::resource('/chapters', ChapterController::class);
});
