<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        Log::info('RoleMiddleware triggered');

        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user = Auth::user();
        Log::info('Authenticated User:', $user ? $user->toArray() : 'No user found');
        Log::info('Expected Role: ' . $role);

        if (!$user->hasRole($role)) {
            Log::info('User does not have the required role');
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $next($request);
    }
}