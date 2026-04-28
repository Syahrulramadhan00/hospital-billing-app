import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="mb-4 text-sm text-base-content/80">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that will
                allow you to choose a new one.
            </div>

            {status && (
                <div className="alert alert-success mb-4">
                    <CheckCircle className="w-6 h-6" />
                    <span>{status}</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block label-text font-semibold">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="user@hospital.com"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                            errors.email ? 'input-error' : ''
                        }`}
                    />
                    {errors.email && (
                        <p className="text-error text-sm mt-2">{errors.email}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn btn-primary text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Sending...' : 'Email Password Reset Link'}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
