<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Outcome;
use Illuminate\Http\Request;

class OutcomeController extends Controller
{
    // This method will return all outcomes of a course
    public function index(Request $request)
    {
        $outcomes = Outcome::where('course_id', $request->course_id)->get();

        return response()->json([
            'status' => 200,
            'data' => $outcomes
        ], 200);
    }

    // This method will store outcome
    public function store(Request $request)
    {
        
    }

    // This method will update outcome
    public function update()
    {

    }

    // This method will delete a outcome
    public function destroy()
    {

    }
}
