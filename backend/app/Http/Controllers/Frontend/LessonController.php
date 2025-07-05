<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class LessonController extends Controller
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
            'chapter' => 'required',
            'lesson' => 'required|unique:lessons,title',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $lesson = new Lesson();
        $lesson->chapter_id     = $request->chapter;
        $lesson->title          = $request->lesson;
        $lesson->sort_order    = 1000;
        $lesson->status = $request->status;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'data' => $lesson,
            'message' => 'Lesson Added Successfully!'
        ], 200);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $lesson = Lesson::find($id);

        if ($lesson == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not Found!'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data'=> $lesson,
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
        $lesson = Lesson::findOrFail($id);

        if ($lesson == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson Not Found!'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'chapter_id' => 'required',
            'lesson' => 'required|unique:lessons,title,'.$id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }


        $lesson->chapter_id = $request->chapter_id;
        $lesson->title = $request->lesson;
        $lesson->is_free_preview  = ($request->free_preview == false) ? 'no' : 'yes';
        $lesson->duration = $request->duration;
        $lesson->description = $request->description;
        $lesson->status = $request->status;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'data' => $lesson,
            'message' => 'Lesson Updated Successfully!'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $lesson = Lesson::findOrFail($id);

        if ($lesson === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson Not Found!'
            ], 404);
        }

        $lesson->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Lesson Deleted Successfully!'
        ], 200);
    }

    public function saveVideo(string $id, Request $request)
    {
        $lesson = Lesson::find($id);

        if ($lesson === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Lesson not found!'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'video' => 'required|mimes:mp4'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        if ($lesson->video != "") {
            if (File::exists(public_path('uploads/course/videos/' . $lesson->video))) {
                File::delete(public_path('uploads/course/videos/' . $lesson->video));
            }
        }

        $video = $request->video;
        $ext = $video->getClientOriginalExtension();
        $videoName = strtotime('now') . '-' . $id . '.' . $ext;
        $video->move(public_path('uploads/course/videos'), $videoName);

        $lesson->video = $videoName;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'data' => $lesson,
            'message' => 'Video Uploaded Successfully!'
        ], 200);
    }
}
