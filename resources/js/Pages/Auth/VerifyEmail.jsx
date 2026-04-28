import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="mb-6 text-sm text-base-content/80">
                Thanks for signing up! Before getting started, could you verify
                your email address by clicking on the link we just emailed to
                you? If you didn't receive the email, we will gladly send you
                another.
            </div>

            {status === 'verification-link-sent' && (
                <div className="alert alert-success mb-6">
                    <CheckCircle className="w-6 h-6" />
                    <span>A new verification link has been sent to the email address you provided during registration.</span>
                </div>
            )}

            <form onSubmit={submit}>
                <div className="flex items-center justify-between gap-4 pt-4">
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-sm text-primary hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1 transition-all"
                    >
                        Log Out
                    </Link>

                    <button
                        type="submit"
                        disabled={processing}
                        className="btn btn-primary text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Sending...' : 'Resend Verification Email'}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
