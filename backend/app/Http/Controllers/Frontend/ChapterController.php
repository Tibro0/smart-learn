<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChapterController extends Controller
{
    // This method will return all Chapters of a course
    public function index(Request $request)
    {
        $chapters = Chapter::where('course_id', $request->course_id)->orderBy('sort_order', 'ASC')->get();

        return response()->json([
            'status' => 200,
            'data' => $chapters
        ], 200);
    }

    // This method will store chapter
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'chapter' => 'required',
            'course_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $chapter = new Chapter();
        $chapter->course_id = $request->course_id;
        $chapter->title = $request->chapter;
        $chapter->sort_order = 1000;
        $chapter->save();

        return response()->json([
            'status' => 200,
            'data' => $chapter,
            'message' => 'Chapter Added Successfully!'
        ], 200);
    }

    // This method will update chapter
    public function update(string $id, Request $request)
    {
        $chapter = Chapter::find($id);

        if ($chapter == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Chapter Not Found!'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'chapter' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $chapter->title = $request->chapter;
        $chapter->save();

        return response()->json([
            'status' => 200,
            'data' => $chapter,
            'message' => 'Chapter Updated Successfully!'
        ], 200);
    }

    // This method will delete a chapter
    public function destroy(string $id)
    {
        $chapter = Chapter::find($id);

        if ($chapter == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Chapter Not Found!'
            ], 404);
        }

        $chapter->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Chapter Deleted Successfully!'
        ], 200);
    }

    // This Method Will Sort Chapters
    public function sortChapters(Request $request)
    {
        if (!empty($request->chapters)) {
            foreach ($request->chapters as $key => $chapter) {
                Chapter::where('id', $chapter['id'])->update(['sort_order' => $key]);
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Order Updated Successfully!'
        ], 200);
    }
}
