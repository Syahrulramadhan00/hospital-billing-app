<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

public function store(LoginRequest $request): RedirectResponse
    {
        // 1. Authenticate locally first (so Laravel knows who is logged in)
        $request->authenticate();
        $request->session()->regenerate();

        // 2. NOW, authenticate with the RS Delta Surya API to get the Bearer Token 
        // Note: The payload requires the phone number formatted as 08xxxxx as the password 
        $apiResponse = Http::post('https://recruitment.rsdeltasurya.com/api/v1/auth', [
            'email' => $request->email,
            'password' => $request->password, 
        ]);

        if ($apiResponse->successful()) {
            // 3. Save the token to the session so other controllers can use it!
            $data = $apiResponse->json();
            session(['api_token' => $data['access_token']]);
        } else {
            // If the API rejects them, log them out locally and throw an error
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            
            return back()->withErrors([
                'email' => 'Failed to authenticate with RS Delta Surya API.',
            ]);
        }

        // 4. Redirect to dashboard
        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
