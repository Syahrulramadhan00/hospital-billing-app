<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DailyTransactionReportMail extends Mailable
{
    use Queueable, SerializesModels;

    public $filePath;
    public $date;

    public function __construct($filePath, $date)
    {
        $this->filePath = $filePath;
        $this->date = $date;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Laporan Transaksi Harian RS Delta Surya - ' . $this->date,
        );
    }

    public function content(): Content
    {
        // We will just use a simple raw text email instead of a complex blade view
        return new Content(
            htmlString: '<p>Selamat Pagi,</p><p>Terlampir adalah laporan transaksi pembayaran (Kasir) untuk tanggal <strong>' . $this->date . '</strong>.</p><p>Sistem RS Delta Surya</p>'
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromPath($this->filePath)
                ->as('Laporan_Transaksi_' . $this->date . '.csv')
                ->withMime('text/csv'),
        ];
    }
}