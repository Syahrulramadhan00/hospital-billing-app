<?php

namespace App\Http\Controllers;

use App\Models\Voucher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class VoucherController extends Controller
{
    public function index(Request $request)
    {
        // 1. Get vouchers from your local database
        $vouchers = Voucher::with('creator')->latest()->get();

        // 2. Fetch Master Data Asuransi from the API [cite: 41, 42]
        // Note: You must retrieve the token you saved during the Login process
        $token = session('api_token');

        $insurances = [];

        // Make the API call with the Bearer token [cite: 43, 44]
        $response = Http::withToken($token)
            ->get('https://recruitment.rsdeltasurya.com/api/v1/insurances');

        if ($response->successful()) {
            // Extract the insurances array from the response
            $insurances = $response->json('insurances', []);
        }

        // 3. Send both data sources to your React Frontend via Inertia
        return Inertia::render('Marketing/Vouchers/Index', [
            'vouchers' => $vouchers,
            'insurances' => $insurances,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'insurance_id' => 'required|string',
            'name' => 'required|string|max:255',
            'discount_type' => 'required|in:percentage,nominal',
            'discount_value' => 'required|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
        ]);

        $validated['created_by'] = auth()->id();

        Voucher::create($validated);

        return redirect()->back()->with('success', 'Voucher created successfully.');
    }

    // Add update() and destroy() methods here later
}
