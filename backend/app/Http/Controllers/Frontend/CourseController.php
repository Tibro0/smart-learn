<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Language;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CourseController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|min:5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        // this will store course in db
        $course = new Course();
        $course->title = $request->title;
        $course->status = 0;
        $course->user_id = $request->user()->id;
        $course->save();

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => 'Course Has Been Created Successfully!'
        ], 200);
    }

    public function show(string $id)
    {
        $course = Course::find($id);

        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course Not Found!',
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $course,
        ], 200);
    }

    // This method will return categories/levels/languages
    public function metaData()
    {
        $categories = Category::all();
        $levels = Level::all();
        $languages = Language::all();

        return response()->json([
            'status' => 200,
            'categories' => $categories,
            'levels' => $levels,
            'languages' => $languages,
        ], 200);
    }

    // this method will update course basic data
    public function update($id, Request $request)
    {
        $course = Course::find($id);

        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course Not Found!'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|min:5',
            'category' => 'required',
            'level' => 'required',
            'language' => 'required',
            'sell_price' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        // this will Update course in db
        $course->title = $request->title;
        $course->category_id = $request->category;
        $course->level_id = $request->level;
        $course->language_id = $request->language;
        $course->description = $request->description;
        $course->price = $request->sell_price;
        $course->cross_price = $request->cross_price;
        $course->save();

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => 'Course Updated Successfully!'
        ], 200);
    }
}
