import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="mb-6 text-sm text-base-content/80">
                This is a secure area of the application. Please confirm your
                password before continuing.
            </div>

            <form onSubmit={submit} className="space-y-5">
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

                {/* Actions */}
                <div className="flex items-center justify-end pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn btn-primary text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Confirming...' : 'Confirm'}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
