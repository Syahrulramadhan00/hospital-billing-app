import { Link, usePage } from '@inertiajs/react';
import { Menu, ChevronDown, Home, Calendar, Ticket, BarChart3, Settings, User, Hospital, Shield, Handshake } from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const navigation = [
        {
            name: 'Dashboard',
            icon: Home,
            href: route('dashboard'),
            active: route().current('dashboard'),
        },
        {
            name: 'Transactions',
            icon: Handshake,
            href: route('transactions.index'),
            active: route().current('transactions.index'),
        },
        {
            name: 'Vouchers',
            icon: Ticket,
            href: route('vouchers.index'),
            active: route().current('vouchers.index'),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
            <div className="drawer lg:drawer-open">
                <input id="app-drawer" type="checkbox" className="drawer-toggle" />

                {/* Main Content Area */}
                <div className="drawer-content flex flex-col">
                    {/* Navbar */}
                    <nav className="navbar w-full bg-base-100 border-b border-secondary/20 sticky top-0 z-30 shadow-md">
                        <div className="flex-1">
                            <label htmlFor="app-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost lg:hidden">
                                <Menu className="w-6 h-6" />
                            </label>
                            <Link  className="justify-center text-lg gap-2 hidden md:flex">
                                 <Hospital className="w-6 h-6 text-primary" />
                                <span className="font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Hospital Billing</span>
                            </Link>
                        </div>

                        {/* Profile Menu */}
                        <div className="flex-none gap-2 pr-4">
                            <div className="dropdown dropdown-end">
                                <button tabIndex={0} role="button" className="btn btn-ghost gap-2">
                                    <div className="avatar placeholder">
                                        <div className="bg-primary text-white rounded-full w-8">
                                            <span className="text-sm">{user.name.charAt(0).toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium hidden md:inline">{user.name}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li><Link href={route('profile.edit')}>Profile Settings</Link></li>
                                    <li><hr className="my-1" /></li>
                                    <li><Link href={route('logout')} method="post" as="button">Log Out</Link></li>
                                </ul>
                            </div>
                        </div>
                    </nav>

                    {/* Header (if provided) */}
                    {header && (
                        <header className="bg-gradient-to-r from-primary/5 to-blue-600/5 shadow-sm border-b border-secondary/20">
                            <div className="px-4 py-6 sm:px-6 lg:px-8">
                                {header}
                            </div>
                        </header>
                    )}

                    {/* Main Content */}
                    <main className="flex-1 overflow-y-auto">
                        <div className="px-4 py-8 sm:px-6 lg:px-8">
                            {children}
                        </div>
                    </main>
                </div>

                {/* Sidebar */}
                <div className="drawer-side z-40">
                    <label htmlFor="app-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                    <div className="flex flex-col h-full w-64 bg-base-200">
                        {/* Sidebar Header */}
                        <div className="px-6 py-5 border-b border-secondary/30">
                            <Link href={route('dashboard')} className="flex items-center gap-3">
                                    <Hospital className="w-6 h-6 text-primary" />
                                <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Billing</span>
                            </Link>
                        </div>
                        {/* Navigation Items */}
                        <ul className="menu w-full flex-1 px-4 py-4 gap-1 text-base">
                            {navigation.map((item, index) => {
                                const Icon = item.icon;
                                
                                return item.children ? (
                                    <li key={index}>
                                        <details>
                                            {/* Enforce flex-row and center alignment */}
                                            <summary className="flex items-center gap-3">
                                                <Icon className="w-5 h-5 shrink-0" />
                                                <span className="flex-1">{item.name}</span>
                                            </summary>
                                            <ul>
                                                {item.children.map((child, childIndex) => (
                                                    <li key={childIndex} className='pl-8'>
                                                        <Link 
                                                            href={child.href} 
                                                            className={child.active ? 'active' : ''}
                                                        >
                                                            {child.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </details>
                                    </li>
                                ) : (
                                    <li key={index}>
                                        {/* Enforce flex-row and center alignment */}
                                        <Link 
                                            href={item.href} 
                                            className={`flex items-center gap-3  ${item.active ? 'active' : ''}`}
                                        >
                                            <Icon className="w-5 h-5 shrink-0" />
                                            <span className="flex-1">{item.name}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                    </div>
                </div>
            </div>
        </div>
    );
}
