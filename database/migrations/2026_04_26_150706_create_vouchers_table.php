<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('insurance_id')->index(); 
            $table->string('name'); 
            $table->enum('discount_type', ['percentage', 'fixed']); 
            $table->decimal('discount_value', 10, 2); 
            $table->decimal('max_discount_amount', 15, 2)->nullable(); 
            $table->date('valid_from')->nullable(); 
            $table->date('valid_until')->nullable(); 
            $table->foreignId('created_by')->constrained('users'); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};