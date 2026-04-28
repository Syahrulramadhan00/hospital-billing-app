<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Receipt - {{ $transaction->invoice_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            font-size: 11px;
            line-height: 1.4;
            color: #333;
            background: #fff;
        }
        
        .receipt-container {
            width: 100%;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
            margin-bottom: 15px;
        }
        
        .hospital-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .hospital-info {
            font-size: 9px;
            color: #666;
        }
        
        .receipt-title {
            font-size: 14px;
            font-weight: bold;
            margin: 10px 0;
        }
        
        .invoice-number {
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            margin: 10px 0;
            padding: 5px;
            background: #f0f0f0;
            border-radius: 3px;
        }
        
        .section {
            margin-bottom: 15px;
        }
        
        .section-title {
            font-weight: bold;
            font-size: 10px;
            text-transform: uppercase;
            border-bottom: 1px solid #ddd;
            padding-bottom: 3px;
            margin-bottom: 5px;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            margin-bottom: 3px;
        }
        
        .info-label {
            font-weight: bold;
            flex: 0 0 40%;
        }
        
        .info-value {
            flex: 1;
            text-align: right;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
            font-size: 10px;
        }
        
        th {
            background-color: #f0f0f0;
            border-bottom: 2px solid #333;
            padding: 5px;
            text-align: left;
            font-weight: bold;
        }
        
        td {
            padding: 5px;
            border-bottom: 1px solid #ddd;
        }
        
        .qty {
            text-align: center;
        }
        
        .price {
            text-align: right;
        }
        
        .subtotal {
            text-align: right;
        }
        
        .totals-section {
            border-top: 2px solid #333;
            border-bottom: 2px solid #333;
            padding: 8px 0;
            margin: 10px 0;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 11px;
        }
        
        .total-label {
            font-weight: bold;
        }
        
        .total-value {
            text-align: right;
        }
        
        .final-total {
            font-size: 13px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            margin-top: 8px;
        }
        
        .footer {
            text-align: center;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            font-size: 9px;
            color: #666;
        }
        
        .thank-you {
            text-align: center;
            font-weight: bold;
            margin-top: 10px;
        }
        
        .separator {
            border-bottom: 1px dashed #999;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <!-- Header -->
        <div class="header">
            <div class="hospital-name">RS DELTA SURYA</div>
            <div class="hospital-info">
                Payment Receipt<br>
                Jln. Merdeka No. 123, Jakarta
            </div>
        </div>
        
        <div class="receipt-title">BILLING RECEIPT</div>
        <div class="invoice-number">{{ $transaction->invoice_number }}</div>
        
        <!-- Patient Information -->
        <div class="section">
            <div class="section-title">Patient Information</div>
            <div class="info-row">
                <span class="info-label">Patient Name:</span>
                <span class="info-value">{{ $transaction->patient_name }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Insurance:</span>
                <span class="info-value">{{ $transaction->insurance_id }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Date:</span>
                <span class="info-value">{{ $transaction->created_at->format('d/m/Y H:i') }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Cashier:</span>
                <span class="info-value">{{ $transaction->cashier->name ?? 'N/A' }}</span>
            </div>
        </div>
        
        <div class="separator"></div>
        
        <!-- Transaction Details -->
        <div class="section">
            <div class="section-title">Service Details</div>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th class="qty">Qty</th>
                        <th class="price">Price</th>
                        <th class="subtotal">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse ($transaction->details as $detail)
                        <tr>
                            <td>{{ $detail->procedure_name_snapshot }}</td>
                            <td class="qty">{{ $detail->quantity }}</td>
                            <td class="price">Rp {{ number_format($detail->price, 0, ',', '.') }}</td>
                            <td class="subtotal">Rp {{ number_format($detail->subtotal, 0, ',', '.') }}</td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="4" style="text-align: center; color: #999;">No items</td>
                        </tr>
                    @endforelse
                </tbody>
            </table>
        </div>
        
        <!-- Payment Summary -->
        <div class="totals-section">
            <div class="total-row">
                <span class="total-label">Subtotal:</span>
                <span class="total-value">Rp {{ number_format($transaction->total_amount, 0, ',', '.') }}</span>
            </div>
            
            @if ($transaction->discount_amount > 0)
                <div class="total-row">
                    <span class="total-label">Discount:</span>
                    <span class="total-value">- Rp {{ number_format($transaction->discount_amount, 0, ',', '.') }}</span>
                </div>
            @endif
            
            <div class="final-total">
                <span>TOTAL AMOUNT:</span>
                <span>Rp {{ number_format($transaction->final_amount, 0, ',', '.') }}</span>
            </div>
        </div>
        
        <!-- Status -->
        <div class="section">
            <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value" style="text-transform: uppercase; font-weight: bold; color: #28a745;">{{ $transaction->status }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Paid Date:</span>
                <span class="info-value">{{ $transaction->paid_at?->format('d/m/Y H:i') ?? 'N/A' }}</span>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="thank-you">Thank You for Your Visit!</div>
            <div style="margin-top: 5px;">
                Printed: {{ now()->format('d/m/Y H:i:s') }}
            </div>
            <div style="margin-top: 8px; font-size: 8px; color: #999;">
                This is a computer-generated receipt. No signature required.
            </div>
        </div>
    </div>
</body>
</html>
