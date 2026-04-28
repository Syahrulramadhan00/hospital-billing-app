import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { Smile, Plus, Clock, FileText } from 'lucide-react';

export default function Dashboard() {
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-3xl font-bold leading-tight text-base-content mb-2">
                        Dashboard
                    </h2>
                    <p className="text-base-content/80 font-light">Welcome back, {user.name}! Here's what's happening with your billing operations.</p>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Transactions */}
                    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="card-body p-6">
                            <h3 className="card-title text-sm text-base-content/80 font-light normal-case">Total Transactions</h3>
                            <div className="text-3xl font-bold text-primary mt-2">0</div>
                            <p className="text-xs text-base-content/60 font-light mt-2">This month</p>
                        </div>
                    </div>

                    {/* Pending Vouchers */}
                    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="card-body p-6">
                            <h3 className="card-title text-sm text-base-content/80 font-light normal-case">Pending Vouchers</h3>
                            <div className="text-3xl font-bold text-warning mt-2">0</div>
                            <p className="text-xs text-base-content/60 font-light mt-2">Awaiting approval</p>
                        </div>
                    </div>

                    {/* Total Amount */}
                    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="card-body p-6">
                            <h3 className="card-title text-sm text-base-content/80 font-light normal-case">Total Amount</h3>
                            <div className="text-3xl font-bold text-success mt-2">$0.00</div>
                            <p className="text-xs text-base-content/60 font-light mt-2">Revenue generated</p>
                        </div>
                    </div>

                    {/* Audit Logs */}
                    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                        <div className="card-body p-6">
                            <h3 className="card-title text-sm text-base-content/80 font-light normal-case">Audit Logs</h3>
                            <div className="text-3xl font-bold text-info mt-2">0</div>
                            <p className="text-xs text-base-content/60 font-light mt-2">System activities</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Welcome Card */}
                    <div className="lg:col-span-2">
                        <div className="card bg-gradient-to-br from-primary/10 to-blue-600/10 shadow-lg">
                            <div className="card-body">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                                            <Smile className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-base-content mb-2">
                                            Welcome to Hospital Billing System
                                        </h3>
                                        <p className="text-base-content/80 font-light mb-4">
                                            You're logged in as <span className="font-semibold text-primary">{user.name}</span> ({user.email}).
                                            You can now manage billing transactions, vouchers, and more from your dashboard.
                                        </p>
                                        <div className="flex gap-2 flex-wrap">
                                            <button className="btn btn-sm btn-primary gap-2">
                                                <Plus className="w-4 h-4" />
                                                New Transaction
                                            </button>
                                            <button className="btn btn-sm btn-outline gap-2">
                                                <Clock className="w-4 h-4" />
                                                View Reports
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                            <h3 className="card-title text-lg font-semibold mb-4 text-base-content">Quick Stats</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-base-content/80 font-light">User Role</span>
                                    <span className="badge badge-primary">{user.role || 'User'}</span>
                                </div>
                                <div className="divider my-2"></div>
                                <div className="flex items-center justify-between">
                                    <span className="text-base-content/80 font-light">Last Login</span>
                                    <span className="text-sm text-base-content/60 font-light">Today</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-base-content/80 font-light">Status</span>
                                    <span className="badge badge-success">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Section */}
                <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                        <h3 className="card-title text-lg font-semibold mb-4 text-base-content">Recent Activity</h3>
                        <div className="text-center py-8">
                            <FileText className="w-16 h-16 mx-auto text-base-content/40 mb-4" />
                            <p className="text-base-content/80  font-light">No recent activity</p>
                            <p className="text-base-content/60 font-light text-sm mt-1">Your activities will appear here</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
