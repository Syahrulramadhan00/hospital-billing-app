<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Voucher;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        $token = session('api_token');

        // 1. Fetch History from Database
        $transactions = Transaction::with('cashier')->latest()->get();

        // 2. Fetch Insurances from API
        $insResponse = Http::withToken($token)->get('https://recruitment.rsdeltasurya.com/api/v1/insurances');
        // Fallback to empty array if 'data' or 'insurances' wrapper is missing
        $insurances = $insResponse->successful() ? ($insResponse->json('data') ?? $insResponse->json('insurances') ?? $insResponse->json()) : [];

        // 3. Fetch Procedures from API
        $procResponse = Http::withToken($token)->get('https://recruitment.rsdeltasurya.com/api/v1/procedures');
        $procedures = $procResponse->successful() ? ($procResponse->json('data') ?? $procResponse->json('procedures') ?? $procResponse->json()) : [];

        // 4. Get Active Vouchers
        $today = now()->toDateString();
        $vouchers = Voucher::where(function ($query) use ($today) {
            $query->whereNull('valid_from')->orWhere('valid_from', '<=', $today);
        })
            ->where(function ($query) use ($today) {
                $query->whereNull('valid_until')->orWhere('valid_until', '>=', $today);
            })
            ->get();

        return Inertia::render('Cashier/Transactions/Index', [
            'transactions' => $transactions,
            'insurances' => $insurances,
            'procedures' => $procedures,
            'vouchers' => $vouchers,
        ]);
    }

/**
     * API PROXY: Fetch the exact price of a procedure securely via Backend
     */
    public function getPrice($id)
    {
        $token = session('api_token');

        $response = Http::withToken($token)
            ->get("https://recruitment.rsdeltasurya.com/api/v1/procedures/{$id}/prices");

        if ($response->successful()) {
            $data = $response->json();
            $price = 0;

            // Check if the "prices" array exists and has data
            if (isset($data['prices']) && is_array($data['prices']) && count($data['prices']) > 0) {
                
                // Grab the LAST item in the array (the most recent date, e.g., Feb 20-25)
                $latestPrice = end($data['prices']); 
                
                // Extract the magic word: unit_price
                $price = $latestPrice['unit_price'] ?? 0;
            }

            return response()->json([
                'price' => $price,
            ]);
        }

        return response()->json(['error' => 'Failed to fetch price'], 400);
    }

    /**
     * STORE: Save the finalized transaction
     */
    public function store(Request $request)
    {
        // 1. Validate the incoming React payload
        $validated = $request->validate([
            'patient_name' => 'required|string|max:255',
            'insurance_id' => 'required|string',
            'voucher_id' => 'nullable|exists:vouchers,id',
            'total_amount' => 'required|numeric|min:0',
            'discount_amount' => 'required|numeric|min:0',
            'final_amount' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.procedure_id' => 'required|string',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // 2. Use Database Transaction to ensure both Transaction and Details save safely
        DB::beginTransaction();

        try {
            // Create Parent Transaction
            $transaction = Transaction::create([
                'invoice_number' => 'INV-'.strtoupper(Str::random(8)),
                'cashier_id' => auth()->id(),
                'patient_name' => $validated['patient_name'],
                'insurance_id' => $validated['insurance_id'],
                'total_amount' => $validated['total_amount'],
                'discount_amount' => $validated['discount_amount'],
                'final_amount' => $validated['final_amount'],
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            // Create Details (Snapshots of Procedure Names and Prices)
            foreach ($validated['items'] as $item) {
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'procedure_id' => $item['procedure_id'],
                    'procedure_name_snapshot' => $item['name'], // Crucial: Guideline #5 compliant snapshot
                    'price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['price'] * $item['quantity'],
                ]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Transaction completed successfully!');

        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->withErrors(['error' => 'Failed to process transaction: '.$e->getMessage()]);
        }
    }

    /**
     * PRINT RECEIPT: Generate PDF receipt for a transaction
     */
    public function printReceipt(Transaction $transaction)
    {
        // Load the transaction details
        $transaction->load('details', 'cashier');

        // Generate PDF from blade view
        $pdf = Pdf::loadView('pdf.receipt', ['transaction' => $transaction]);

        // Set paper size to A5 (receipt size)
        $pdf->setPaper('A5', 'portrait');

        // Stream the PDF to browser
        return $pdf->stream('Receipt-' . $transaction->invoice_number . '.pdf');
    }
}
