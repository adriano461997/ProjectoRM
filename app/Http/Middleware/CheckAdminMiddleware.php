<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;

class CheckAdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if(auth()->user()->admin == 0){
            return redirect()->route("escolher");
        }
        return $next($request);
    }
}
