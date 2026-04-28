import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

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
                        autoComplete="username"
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

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block label-text font-semibold">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        autoFocus
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                            errors.password ? 'input-error' : ''
                        }`}
                    />
                    {errors.password && (
                        <p className="text-error text-sm mt-2">{errors.password}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <label htmlFor="password_confirmation" className="block label-text font-semibold">
                        Confirm Password
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                        className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                            errors.password_confirmation ? 'input-error' : ''
                        }`}
                    />
                    {errors.password_confirmation && (
                        <p className="text-error text-sm mt-2">{errors.password_confirmation}</p>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn btn-primary text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Resetting...' : 'Reset Password'}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
