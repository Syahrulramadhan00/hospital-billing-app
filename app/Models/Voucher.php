<?php

namespace App\Models;
use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Voucher extends Model
{
    use LogsActivity;
    use HasFactory;

    protected $fillable = [
        'insurance_id',
        'name',
        'discount_type',
        'discount_value',
        'max_discount_amount',
        'valid_from',
        'valid_until',
        'created_by',
    ];

    protected $casts = [
        'valid_from' => 'date',
        'valid_until' => 'date',
        'discount_value' => 'decimal:2',
        'max_discount_amount' => 'decimal:2',
    ];


    /**
     * Get the user who created this voucher
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
