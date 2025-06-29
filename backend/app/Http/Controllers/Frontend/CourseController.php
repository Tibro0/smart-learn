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
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
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

        // This will store course in db
        $course = new Course();
        $course->title = $request->title;
        $course->status = 0;
        $course->user_id = $request->user()->id;
        $course->save();

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => 'Course Created Successfully!'
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $course = Course::with(['chapters', 'chapters.lessons'])->findOrFail($id);

        if ($course === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course Not Found!'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $course,
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $course = Course::findOrFail($id);

        if ($course === null) {
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

        // This will Update course in db
        $course->title          = $request->title;
        $course->category_id    = $request->category;
        $course->level_id       = $request->level;
        $course->language_id    = $request->language;
        $course->price          = $request->sell_price;
        $course->cross_price    = $request->cross_price;
        $course->description    = $request->description;
        $course->save();

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => 'Course Updated Successfully!'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    // this method well return categories/levels/language
    public function metaData()
    {
        $categories = Category::where('status', 1)->get();
        $levels = Level::where('status', 1)->get();
        $languages = Language::where('status', 1)->get();

        return response()->json([
            'status' => 200,
            'categories' => $categories,
            'levels' => $levels,
            'languages' => $languages,
        ], 200);
    }

    public function saveCourseImage(string $id, Request $request)
    {
        $course = Course::findOrFail($id);

        if ($course === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Course not found!'
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

        if ($course->image != "") {
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

        // create Small Thumbnail
        $manager = new ImageManager(Driver::class);
        $img = $manager->read(public_path('uploads/course/'. $imageName));
        $img->cover(750, 450);
        $img->save(public_path('uploads/course/small/'. $imageName));


        $course->image = $imageName;
        $course->save();

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => 'Image Uploaded Successfully!'
        ], 200);
    }
}
