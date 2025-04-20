<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class InsiController extends Controller
{
    function index(Request $request, $slug){
        return inertia("Insi/Index", [
            "slug"=> $slug,
        ]);
    }
}
