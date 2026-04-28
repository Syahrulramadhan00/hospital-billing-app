<?php

namespace App\Console\Commands;

use App\Models\Transaction;
use App\Mail\DailyTransactionReportMail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class SendDailyTransactionReport extends Command
{
    // This is the command you type in the terminal to run it manually
    protected $signature = 'report:daily-transactions';

    protected $description = 'Generate and email the daily transaction report to RS Delta Surya';

    public function handle()
    {
        $this->info('Generating transaction report...');

        // 1. Get yesterday's date
        $yesterday = now()->subDay()->toDateString();

        // 2. Fetch all PAID transactions from yesterday
        $transactions = Transaction::with('cashier')
            ->whereDate('created_at', $yesterday)
            ->where('status', 'paid')
            ->get();

        if ($transactions->isEmpty()) {
            $this->info('No transactions found for yesterday. Skipping email.');
            return;
        }

        // 3. Create a Native CSV file
        $fileName = 'daily_report_' . $yesterday . '.csv';
        // We use the local storage disk
        $filePath = storage_path('app/private/' . $fileName); 
        
        // Ensure the directory exists
        if (!file_exists(storage_path('app/private'))) {
            mkdir(storage_path('app/private'), 0755, true);
        }

        $file = fopen($filePath, 'w');

        // Add Excel UTF-8 BOM so Microsoft Excel reads Rupiah/Characters correctly
        fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

        // Add CSV Headers
        fputcsv($file, ['Invoice Number', 'Patient Name', 'Insurance ID', 'Cashier', 'Total Amount', 'Discount', 'Final Amount', 'Time Paid']);

        // Add Data Rows
        foreach ($transactions as $trx) {
            fputcsv($file, [
                $trx->invoice_number,
                $trx->patient_name,
                $trx->insurance_id,
                $trx->cashier->name ?? 'System',
                $trx->total_amount,
                $trx->discount_amount,
                $trx->final_amount,
                $trx->paid_at->format('Y-m-d H:i:s'),
            ]);
        }

        fclose($file);

        // 4. Send the Email
        $this->info('Sending email to interview.deltasurya@yopmail.com...');
        
        Mail::to('interview.deltasurya@yopmail.com')->send(
            new DailyTransactionReportMail($filePath, $yesterday)
        );

        // Optional: Clean up the file after sending
        unlink($filePath);

        $this->info('Report sent successfully!');
    }
}