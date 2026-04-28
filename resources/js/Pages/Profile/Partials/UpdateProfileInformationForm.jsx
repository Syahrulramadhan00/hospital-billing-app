import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                    Profile Information
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-6">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Full name"
                        required
                        autoFocus
                        autoComplete="name"
                        className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                            errors.name ? 'input-error' : ''
                        }`}
                    />
                    {errors.name && (
                        <p className="text-error text-sm mt-2">{errors.name}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="user@hospital.com"
                        required
                        autoComplete="username"
                        className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                            errors.email ? 'input-error' : ''
                        }`}
                    />
                    {errors.email && (
                        <p className="text-error text-sm mt-2">{errors.email}</p>
                    )}
                </div>

                {/* Email Verification Alert */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="alert alert-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4v2m0-6a4 4 0 11-8 0 4 4 0 018 0zM12 1a11 11 0 110 22 11 11 0 010-22z" />
                        </svg>
                        <div>
                            <h3 className="font-bold">Email Not Verified</h3>
                            <p className="text-sm">Your email address is unverified. <Link href={route('verification.send')} method="post" as="button" className="link link-primary">Click here to re-send the verification email.</Link></p>
                        </div>
                    </div>
                )}

                {/* Verification Success Alert */}
                {status === 'verification-link-sent' && (
                    <div className="alert alert-success">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>A new verification link has been sent to your email address.</span>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn btn-primary text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Saving...' : 'Save'}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-success font-semibold flex items-center gap-2">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
