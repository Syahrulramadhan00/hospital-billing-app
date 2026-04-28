import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                    Delete Account
                </h2>

                <p className="mt-2 text-sm text-gray-600">
                    Once your account is deleted, all of its resources and data
                    will be permanently deleted. Before deleting your account,
                    please download any data or information that you wish to
                    retain.
                </p>
            </header>

            <button
                onClick={confirmUserDeletion}
                className="btn btn-error text-white"
            >
                Delete Account
            </button>

            {/* Modal Dialog */}
            {confirmingUserDeletion && (
                <div className="modal modal-open">
                    <div className="modal-box w-11/12 max-w-md">
                        <form onSubmit={deleteUser} className="space-y-6">
                            <h3 className="font-bold text-lg text-error">
                                Are you sure you want to delete your account?
                            </h3>

                            <p className="text-sm text-gray-600">
                                Once your account is deleted, all of its resources and
                                data will be permanently deleted. Please enter your
                                password to confirm you would like to permanently delete
                                your account.
                            </p>

                            {/* Password Input */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    autoFocus
                                    className={`input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-error transition-all ${
                                        errors.password ? 'input-error' : ''
                                    }`}
                                />
                                {errors.password && (
                                    <p className="text-error text-sm mt-2">{errors.password}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="modal-action gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn btn-outline"
                                    disabled={processing}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn btn-error text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Deleting...' : 'Delete Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={closeModal}></div>
                </div>
            )}
        </section>
    );
}
