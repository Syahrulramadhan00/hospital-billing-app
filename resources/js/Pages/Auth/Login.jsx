import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogIn, MessageCircleWarning, ShieldCheck, TriangleAlert } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '', // Payload require phone number format 08xxxxx 
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* Header Section */}
            <div className="flex flex-col items-center mb-8">
                <div className="p-4 bg-primary/10 rounded-full mb-4">
                    <ShieldCheck className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-base-content">Delta Surya Hospital</h1>
                <p className="text-sm text-base-content/60 mt-1 text-center">
                    Web-Based Billing & Cashier System
                </p>
            </div>

            {/* Alert Status */}
            {status && (
                <div role="alert" className="alert alert-info mb-6 shadow-sm">
                    <span className="text-sm">{status}</span>
                </div>
            )}

            {/* Login Error Alert */}
            {errors.login && (
                <div role="alert" className="alert alert-warning mb-6 shadow-sm">
                        <TriangleAlert className="w-6 h-6 text-light" />
                    <span className="text-sm">{errors.login}</span>
                </div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-5">
                
                {/* Email Field with Floating Label & Validator */}
                <div>
                    <label className="floating-label">
                        <span>Email Address</span>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            value={data.email}
                            className={`input bg-transparent w-full ${errors.email ? 'input-error' : 'validator'}`}
                            onChange={(e) => setData('email', e.target.value)}
                            autoComplete="username"
                            required
                        />
                    </label>
                    {errors.email && (
                        <p className="text-xs text-error mt-1 ml-1">{errors.email}</p>
                    )}
                </div>

                {/* Phone Number Field with Floating Label & Validator */}
                <div>
                    <label className="floating-label">
                        <span>Phone Number (08xxxx)</span>
                        <input
                            type="password"
                            placeholder="081234567890"
                            value={data.password}
                            className={`input bg-transparent w-full ${errors.password ? 'input-error' : 'validator'}`}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </label>
                    <p className="text-xs text-base-content/40 mt-1 ml-1">
                        Use your registered phone number as password 
                    </p>
                    {errors.password && (
                        <p className="text-xs text-error mt-1 ml-1">{errors.password}</p>
                    )}
                </div>

                {/* Login Action - daisyUI Button */}
                <button 
                    type="submit" 
                    disabled={processing}
                    className="btn btn-primary w-full bg-primary shadow-md"
                >
                    {processing ? (
                        <span className="loading loading-spinner loading-md"></span>
                    ) : (
                        <>
                            <LogIn className="w-4 h-4" />
                            Login to Dashboard
                        </>
                    )}
                </button>

                

            </form>
        </GuestLayout>
    );
}   