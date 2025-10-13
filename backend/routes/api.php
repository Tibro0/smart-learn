<?php

use App\Http\Controllers\Frontend\AccountController;
use App\Http\Controllers\Frontend\ChapterController;
use App\Http\Controllers\Frontend\CourseController;
use App\Http\Controllers\Frontend\LessonController;
use App\Http\Controllers\Frontend\OutcomeController;
use App\Http\Controllers\Frontend\RequirementController;
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
        Route::post('save-course-image/{id}', 'saveCourseImage');
    });

    Route::controller(OutcomeController::class)->group(function(){
        Route::get('outcomes', 'index');
        Route::post('outcomes', 'store');
        Route::put('outcomes/{id}', 'update');
        Route::delete('outcomes/{id}', 'destroy');
        Route::post('sort-outcomes', 'sortOutcomes');
    });

    Route::controller(RequirementController::class)->group(function(){
        Route::get('requirements', 'index');
        Route::post('requirements', 'store');
        Route::put('requirements/{id}', 'update');
        Route::delete('requirements/{id}', 'destroy');
        Route::post('sort-requirements', 'sortRequirements');
    });

    Route::controller(ChapterController::class)->group(function(){
        Route::get('chapters', 'index');
        Route::post('chapters', 'store');
        Route::put('chapters/{id}', 'update');
        Route::delete('chapters/{id}', 'destroy');
        Route::post('sort-chapters', 'sortChapters');
    });

    Route::controller(LessonController::class)->group(function(){
        Route::post('lessons', 'store');
        Route::put('lessons/{id}', 'update');
        Route::delete('lessons/{id}', 'destroy');
    });
});
