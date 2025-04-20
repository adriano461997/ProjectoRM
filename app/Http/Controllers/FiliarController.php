<?php
namespace App\Http\Controllers;
use App\Models\Filiar;
use Illuminate\Http\Request;

class FiliarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $totalAfiliados = 10;
        $projectos = 10;
        $totalFactura = 100000000;
        $totalf30 = 200000000000;

        return inertia("filiar/Index", [
            "af"=> $totalAfiliados,
            "projectos"=> $projectos,
            "total_f"=> $totalFactura,
            "totalf30"=> $totalf30,
            "f"=> $request->filiar,
        ]);
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Filiar $filiar)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Filiar $filiar)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Filiar $filiar)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Filiar $filiar)
    {
        //
    }
}
