<?php

namespace App\Http\Middleware;

use App\Models\Filiar;
use Closure;
use Illuminate\Http\Request;

class CheckFiliarMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $filiar = Filiar::where("slug", $request->route()->parameter("slug"))->first();

        if(!$filiar){
            abort(404, "Empresa não encontrada");
        }

        $request->filiar = $filiar;

        $user_filiar = $request->user()->users_filiar()->where("filiar_id", $filiar->id)->first();

        if(!$user_filiar){
            abort(403, "Não tens permissão para aceder a esta empresa");
        }

        return $next($request);
    }
}
