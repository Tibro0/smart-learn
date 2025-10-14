<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\Language;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

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
        $course = Course::with(['chapters', 'chapters.lessons'])->find($id);

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
    public function update(string $id, Request $request)
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
            'category' => 'required|integer',
            'level' => 'required|integer',
            'language' => 'required|integer',
            'sell_price' => 'required|numeric',
            'cross_price' => 'nullable|numeric',
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

    public function saveCourseImage(string $id, Request $request)
    {
        $course = Course::find($id);

        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course Not Found!'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|mimes:png,jpg,jpeg'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        if ($course->image != '') {
            if (File::exists(public_path('uploads/course/' . $course->image))) {
                File::delete(public_path('uploads/course/' . $course->image));
            }

            if (File::exists(public_path('uploads/course/small/' . $course->image))) {
                File::delete(public_path('uploads/course/small/' . $course->image));
            }
        }

        $image = $request->image;
        $ext = $image->getClientOriginalExtension();
        $imageName = strtotime('now') . '-' . $id . '.' . $ext;
        $image->move(public_path('uploads/course'), $imageName);

        // Create Small Thumbnail
        $manager = new ImageManager(Driver::class);
        $img = $manager->read(public_path('uploads/course/'.$imageName));

        // scale down to fixed width
        $img->cover(750, 450); // 200 x 150
        $img->save(public_path('uploads/course/small/'.$imageName));

        $course->image = $imageName;
        $course->save();

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => 'Image Uploaded Successfully!'
        ], 200);
    }
}
