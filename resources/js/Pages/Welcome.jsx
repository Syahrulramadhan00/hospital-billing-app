import { Head, Link } from '@inertiajs/react';
import { Check, DollarSign, Lock, LogIn } from 'lucide-react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gradient-to-br from-primary/5 via-base-100 to-blue-600/5">
                {/* Navbar */}
                <nav className="navbar bg-base-100 shadow-lg sticky top-0 z-40">
                    <div className="flex-1">
                        <a className="btn btn-ghost normal-case text-xl font-bold">
                            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Hospital Billing</span>
                        </a>
                    </div>
                    <div className="flex-none gap-2">
                        {auth.user ? (
                            <>
                                <span className="text-sm font-medium text-gray-600">Welcome, {auth.user.name}</span>
                                <Link
                                    href={route('dashboard')}
                                    className="btn btn-primary"
                                >
                                    Dashboard
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="btn btn-ghost"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="btn btn-primary"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Heading */}
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-blue-600 to-primary bg-clip-text text-transparent mb-4 leading-tight">
                            Hospital Billing System
                        </h1>

                        {/* Description */}
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            A modern, efficient solution for managing hospital billing operations. Streamline your billing process with our intuitive and powerful platform.
                        </p>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-3 gap-6 my-12">
                            {/* Feature 1 */}
                            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                                <div className="card-body items-center text-center">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                        <Check className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="card-title text-lg">Easy to Use</h3>
                                    <p className="text-gray-600">Intuitive interface designed for healthcare professionals</p>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                                <div className="card-body items-center text-center">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                        <DollarSign className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="card-title text-lg">Cost Effective</h3>
                                    <p className="text-gray-600">Reduce operational costs with automated billing</p>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                                <div className="card-body items-center text-center">
                                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                        <Lock className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="card-title text-lg">Secure & Reliable</h3>
                                    <p className="text-gray-600">Enterprise-grade security for your data</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        {!auth.user && (
                            <div className="flex gap-4 justify-center flex-wrap">
                                <Link
                                    href={route('login')}
                                    className="btn btn-primary btn-lg gap-2"
                                >
                                    <LogIn className="w-5 h-5" />
                                    Get Started
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="btn btn-outline btn-lg"
                                >
                                    Create Account
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-base-200 text-base-content py-8 mt-12">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8 mb-8">
                            <div>
                                <h4 className="font-bold text-lg mb-4">Hospital Billing System</h4>
                                <p className="text-gray-600">Streamlining healthcare billing for modern hospitals</p>
                            </div>
                            <div>
                                <h4 className="font-bold mb-4">Support</h4>
                                <ul className="space-y-2 text-gray-600">
                                    <li><a href="#" className="link link-hover">Documentation</a></li>
                                    <li><a href="#" className="link link-hover">FAQ</a></li>
                                    <li><a href="mailto:interview.deltasurya@yopmail.com" className="link link-hover">Contact Us</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold mb-4">Company</h4>
                                <ul className="space-y-2 text-gray-600">
                                    <li><a href="#" className="link link-hover">About</a></li>
                                    <li><a href="#" className="link link-hover">Privacy Policy</a></li>
                                    <li><a href="#" className="link link-hover">Terms</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-base-300 pt-8">
                            <p className="text-center text-gray-600">
                                &copy; 2026 Hospital Billing System. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
