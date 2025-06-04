<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Outcome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OutcomeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $outcomes = Outcome::where('course_id', $request->course_id)->orderBy('sort_order')->get();
        return response()->json([
            'status' => 200,
            'data' => $outcomes
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'outcome' => 'required',
            'course_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $outcome = new Outcome();
        $outcome->course_id     = $request->course_id;
        $outcome->text          = $request->outcome;
        $outcome->sort_order    = 1000;
        $outcome->save();

        return response()->json([
            'status' => 200,
            'data' => $outcome,
            'message' => 'Outcomes Added Successfully!'
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $outcome = Outcome::findOrFail($id);

        if ($outcome === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Outcome Not Found!'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'outcome' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }


        $outcome->text = $request->outcome;
        $outcome->save();

        return response()->json([
            'status' => 200,
            'data' => $outcome,
            'message' => 'Outcome Updated Successfully!'
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $outcome = Outcome::findOrFail($id);

        if ($outcome === null) {
            return response()->json([
                'status' => 404,
                'message' => 'Outcome Not Found!'
            ], 404);
        }

        $outcome->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Outcome Deleted Successfully!'
        ], 200);
    }

    public function sortOutcomes(Request $request)
    {
        if (!empty($request->outcomes)) {
            foreach ($request->outcomes as $key => $outcome) {
                Outcome::where('id', $outcome['id'])->update(['sort_order' => $key]);
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Order Saved Successfully!'
        ], 200);
    }
}
