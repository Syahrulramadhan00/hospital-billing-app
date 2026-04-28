<?php

namespace App\Http\Controllers;

use App\Models\Insurance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InsuranceController extends Controller
{
    /**
     * Display a listing of insurances
     */
    public function index()
    {
        $insurances = Insurance::paginate(10);

        return Inertia::render('Insurance/Index', [
            'insurances' => $insurances,
        ]);
    }

    /**
     * Show the form for creating a new insurance
     */
    public function create()
    {
        return Inertia::render('Insurance/Create');
    }

    /**
     * Store a newly created insurance in storage
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'insurance_id' => 'required|string|unique:insurances',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $insurance = Insurance::create($validated);

        return redirect()->route('insurance.show', $insurance)->with('success', 'Insurance created successfully.');
    }

    /**
     * Display the specified insurance
     */
    public function show(Insurance $insurance)
    {
        return Inertia::render('Insurance/Show', [
            'insurance' => $insurance->load('vouchers'),
        ]);
    }

    /**
     * Show the form for editing the specified insurance
     */
    public function edit(Insurance $insurance)
    {
        return Inertia::render('Insurance/Edit', [
            'insurance' => $insurance,
        ]);
    }

    /**
     * Update the specified insurance in storage
     */
    public function update(Request $request, Insurance $insurance)
    {
        $validated = $request->validate([
            'insurance_id' => 'required|string|unique:insurances,insurance_id,' . $insurance->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $insurance->update($validated);

        return redirect()->route('insurance.show', $insurance)->with('success', 'Insurance updated successfully.');
    }

    /**
     * Remove the specified insurance from storage
     */
    public function destroy(Insurance $insurance)
    {
        $insurance->delete();

        return redirect()->route('insurance.index')->with('success', 'Insurance deleted successfully.');
    }
}
