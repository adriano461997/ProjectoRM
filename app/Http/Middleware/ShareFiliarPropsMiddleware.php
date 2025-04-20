<?php

namespace App\Http\Middleware;

use App\Models\Categorias;
use Illuminate\Http\Request;
use Inertia\Middleware;

class ShareFiliarPropsMiddleware extends Middleware
{
    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            "f"=> $request->filiar,
        ];
    }
}
