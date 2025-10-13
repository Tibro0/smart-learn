<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LessonController extends Controller
{
    // This method will store Lesson
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'chapter_id' => 'required',
            'lesson' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $lesson = new Lesson();
        $lesson->chapter_id = $request->chapter_id ;
        $lesson->title = $request->lesson;
        $lesson->sort_order = 1000;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'data' => $lesson,
            'message' => 'Lesson Added Successfully!'
        ], 200);
    }
}
