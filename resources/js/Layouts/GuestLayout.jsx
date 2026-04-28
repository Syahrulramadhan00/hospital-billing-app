import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 py-6 px-4">
            <div className="w-full max-w-md">

                {/* Card Container */}
                <div className=" rounded-2xl shadow-2xl p-8 border border-secondary/10">
                    <div className="space-y-4">
                        {children}
                    </div>
                </div>

                {/* Footer Links */}
                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>Hospital Billing System</p>
                </div>
            </div>
        </div>
    );
}
