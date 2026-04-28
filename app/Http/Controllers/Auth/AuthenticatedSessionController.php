<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
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
        // 1. FIRST: Authenticate with the RS Delta Surya API to get the Bearer Token
        // (API is the source of truth for credentials)
        $apiResponse = Http::post('https://recruitment.rsdeltasurya.com/api/v1/auth', [
            'email' => $request->email,
            'password' => $request->password,
        ]);

        if (! $apiResponse->successful()) {
            // API rejected credentials
            return back()->withErrors([
                'email' => 'These credentials do not match our records.',
            ])->onlyInput('email');
        }

        // 2. API authentication successful! Save the token
        $data = $apiResponse->json();
        session(['api_token' => $data['access_token']]);

        // 3. Create OR Find the user locally
        $user = User::firstOrCreate(
            ['email' => $request->email],
            [
                'name' => 'Syahrul Ramadhan',
                'password' => bcrypt(Str::random(16)),
                'role' => 'kasir', // Default role when you first log in
            ]
        );

        // 4. Authenticate locally and regenerate session
        Auth::login($user, $request->boolean('remember'));
        $request->session()->regenerate();

        // 5. Redirect based on local role
        if ($user->role === 'marketing') {
            return redirect()->route('vouchers.index');
        } else {
            return redirect()->route('transactions.index');
        }
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
