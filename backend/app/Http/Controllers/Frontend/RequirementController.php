<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Requirement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RequirementController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $requirements = Requirement::where('course_id', $request->course_id)->orderBy('sort_order')->get();
        return response()->json([
            'status' => 200,
            'data' => $requirements
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'requirement' => 'required',
            'course_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $requirement = new Requirement();
        $requirement->course_id     = $request->course_id;
        $requirement->text          = $request->requirement;
        $requirement->sort_order    = 1000;
        $requirement->save();

        return response()->json([
            'status' => 200,
            'data' => $requirement,
            'message' => 'Requirement Added Successfully!'
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $requirement = Requirement::find($id);

        if ($requirement === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Requirement Not Found!'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'requirement' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }


        $requirement->text = $request->requirement;
        $requirement->save();

        return response()->json([
            'status' => 200,
            'data' => $requirement,
            'message' => 'Requirement Updated Successfully!'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $requirement = Requirement::find($id);

        if ($requirement === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Requirement Not Found!'
            ], 404);
        }

        $requirement->delete();

        return response()->json([
                'status' => 200,
                'message' => 'Requirement Deleted Successfully!'
            ], 200);
    }

    public function sortRequirements(Request $request)
    {
        if (!empty($request->requirements)) {
            foreach ($request->requirements as $key => $requirement) {
                Requirement::where('id', $requirement['id'])->update(['sort_order' => $key]);
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Order Updated Successfully!'
        ], 200);
    }
}
