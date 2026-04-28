<?php

use App\Http\Controllers\InsuranceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\VoucherController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Insurance routes
    Route::resource('insurance', InsuranceController::class);
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Vouchers - Marketing Only
    Route::middleware('role:marketing')->group(function () {
        Route::resource('vouchers', VoucherController::class);
    });

    // Transactions - Cashier Only
    Route::middleware('role:kasir')->group(function () {
        Route::resource('transactions', TransactionController::class);
        Route::get('/transactions/{transaction}/print', [TransactionController::class, 'printReceipt'])->name('transactions.print');
    });

    // API Routes - Both roles
    Route::get('/api/procedures/{id}/price', [TransactionController::class, 'getPrice'])->name('api.procedures.price');
});

require __DIR__.'/auth.php';
