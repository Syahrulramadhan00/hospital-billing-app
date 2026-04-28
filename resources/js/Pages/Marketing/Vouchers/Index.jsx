import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Plus, Trash2, TicketPercent, CheckCircle2, Calendar } from 'lucide-react';
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { useRef } from 'react';

export default function VoucherIndex({ vouchers, insurances }) {
    const { flash } = usePage().props;

    // Safely extract the insurance array from the API response
    const insuranceList = Array.isArray(insurances) ? insurances : (insurances?.data || []);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        insurance_id: '',
        name: '',
        discount_type: 'percentage',
        discount_value: '',
        max_discount_amount: '',
        valid_from: '',
        valid_until: ''
    });

    const validFromRef = useRef(null);
    const validUntilRef = useRef(null);

    const openModal = () => {
        clearErrors();
        reset();
        document.getElementById('add_voucher_modal').showModal();
    };

    const closeModal = () => {
        document.getElementById('add_voucher_modal').close();
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('vouchers.store'), {
            onSuccess: () => closeModal(),
        });
    };

    // Find Insurance Name from the API data array (Guideline #5 compliance)
    const getInsuranceName = (id) => {
        const insurance = insuranceList.find(i => i.insurance_id === id || i.id === id);
        return insurance ? insurance.name : 'Unknown Insurance';
    };

    // Adds dots for thousands (e.g., 6000000 -> 6.000.000)
    const formatDisplayRupiah = (value) => {
        if (!value) return '';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Handles the primary discount value (Rp or %)
    const handleDiscountChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, ''); 
        
        if (data.discount_type === 'percentage') {
            if (!rawValue) {
                setData('discount_value', '');
            } else {
                let num = parseInt(rawValue, 10);
                if (num > 100) num = 100; // Cap at 100%
                setData('discount_value', num.toString());
            }
        } else {
            setData('discount_value', rawValue);
        }
    };

    // Handles the Max Cap input
    const handleMaxCapChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        setData('max_discount_amount', rawValue);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Master Data Voucher" />

            <div className="max-w-7xl mx-auto p-4 sm:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <TicketPercent className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-base-content">Master Data Vouchers</h1>
                            <p className="text-sm text-base-content/60">Manage insurance discount rules for Marketing</p>
                        </div>
                    </div>
                    <button onClick={openModal} className="btn btn-primary rounded-full shadow-sm px-6">
                        <Plus className="w-5 h-5" /> Add New Voucher
                    </button>
                </div>

                {/* Success Alert */}
                {flash?.success && (
                    <div role="alert" className="alert alert-success alert-soft mb-6 shadow-sm">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Vouchers Table */}
                <div className="overflow-x-auto bg-base-100 rounded-box shadow-sm border border-base-200">
                    <table className="table table-zebra w-full">
                        <thead className="bg-base-200/50">
                            <tr>
                                <th>Voucher Name</th>
                                <th>Insurance (API Data)</th>
                                <th>Discount</th>
                                <th>Max Cap</th>
                                <th>Validity Period</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-base-content/50">
                                        No vouchers created yet.
                                    </td>
                                </tr>
                            ) : (
                                vouchers.map((voucher) => (
                                    <tr key={voucher.id}>
                                        <td className="font-semibold">{voucher.name}</td>
                                        <td>{getInsuranceName(voucher.insurance_id)}</td>
                                        <td>
                                            <span className={`badge ${voucher.discount_type === 'percentage' ? 'badge-info' : 'badge-success'} badge-soft`}>
                                                {voucher.discount_type === 'percentage' 
                                                    ? `${voucher.discount_value}%` 
                                                    : `Rp ${Number(voucher.discount_value).toLocaleString('id-ID')}`}
                                            </span>
                                        </td>
                                        <td>
                                            {voucher.max_discount_amount 
                                                ? `Rp ${Number(voucher.max_discount_amount).toLocaleString('id-ID')}` 
                                                : <span className="text-base-content/40 italic">No Limit</span>}
                                        </td>
                                        <td className="text-sm">
                                            {voucher.valid_from && voucher.valid_until 
                                                ? format(new Date(voucher.valid_from), 'MMM dd, yyyy') + ' to ' + format(new Date(voucher.valid_until), 'MMM dd, yyyy')
                                                : <span className="text-base-content/40 italic">Forever</span>}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Voucher Modal */}
            <dialog id="add_voucher_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box sm:max-w-2xl bg-base-100 overflow-y-visible">
                    <h3 className="font-bold text-xl mb-6">Configure Discount Voucher</h3>
                    
                    <form onSubmit={submit} className="flex flex-col gap-5">
                        
                        <div>
                            <label className="floating-label">
                                <span>Voucher Campaign Name</span>
                                <input
                                    type="text"
                                    value={data.name}
                                    placeholder="e.g., Promo Reliance Jan 2026"
                                    className={`input w-full bg-transparent ${errors.name ? 'input-error' : 'validator'}`}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                            </label>
                            {errors.name && <p className="text-xs text-error mt-1 ml-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="floating-label relative z-50">
                                <span>Target Insurance</span>
                                <select 
                                    className={`select w-full bg-transparent ${errors.insurance_id ? 'select-error' : 'validator'}`}
                                    value={data.insurance_id}
                                    onChange={(e) => setData('insurance_id', e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select an insurance...</option>
                                    {insuranceList.length === 0 ? (
                                        <option value="" disabled>⚠️ No insurances found from API</option>
                                    ) : (
                                        insuranceList.map((insurance) => (
                                            <option key={insurance.id || insurance.insurance_id} value={insurance.id || insurance.insurance_id}>
                                                {insurance.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </label>
                            {errors.insurance_id && <p className="text-xs text-error mt-1 ml-1">{errors.insurance_id}</p>}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <div className="w-full sm:w-1/3">
                                <label className="floating-label relative z-40">
                                    <span>Discount Type</span>
                                    <select 
                                        className="select w-full bg-transparent"
                                        value={data.discount_type}
                                        onChange={(e) => {
                                            setData('discount_type', e.target.value);
                                            setData('discount_value', '');
                                            setData('max_discount_amount', ''); 
                                        }}
                                        required
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="nominal">Flat Nominal (Rp)</option>
                                    </select>
                                </label>
                            </div>

                            <div className="w-full sm:w-2/3">
                                <label className="floating-label">
                                    <span>Value ({data.discount_type === 'percentage' ? '%' : 'Rp'})</span>
                                    <input
                                        type="tel"
                                        value={data.discount_type === 'nominal' ? formatDisplayRupiah(data.discount_value) : data.discount_value}
                                        className={`input w-full bg-transparent ${errors.discount_value ? 'input-error' : 'validator'}`}
                                        onChange={handleDiscountChange}
                                        required
                                    />
                                </label>
                                {errors.discount_value && <p className="text-xs text-error mt-1 ml-1">{errors.discount_value}</p>}
                            </div>
                        </div>

                        {data.discount_type === 'percentage' && (
                            <div>
                                <label className="floating-label">
                                    <span>Maximum Limit (Rp) - Leave blank for No Limit</span>
                                    <input
                                        type="tel"
                                        value={formatDisplayRupiah(data.max_discount_amount)}
                                        className={`input w-full bg-transparent ${errors.max_discount_amount ? 'input-error' : ''}`}
                                        onChange={handleMaxCapChange}
                                    />
                                </label>
                                <p className="text-xs text-base-content/40 mt-1 ml-1">E.g., Max Rp 35.000 limit</p>
                                {errors.max_discount_amount && <p className="text-xs text-error mt-1 ml-1">{errors.max_discount_amount}</p>}
                            </div>
                        )}

                        <div className="divider text-xs text-base-content/30 uppercase my-0">Validity Period (Optional)</div>

                        <div className="flex flex-col sm:flex-row gap-5">
                            <div className="w-full sm:w-1/2">
                                <label className="floating-label mb-1 block">
                                    <span>Valid From</span>
                                </label>
                                <details ref={validFromRef} className="dropdown dropdown-top w-full">
                                    <summary className={`input w-full bg-transparent flex items-center justify-between cursor-pointer ${errors.valid_from ? 'input-error' : ''}`}>
                                        <span className={data.valid_from ? "text-base-content" : "text-base-content/50"}>
                                            {data.valid_from ? format(new Date(data.valid_from), 'MMM dd, yyyy') : 'Select Valid From'}
                                        </span>
                                        <Calendar className="w-4 h-4 opacity-50" />
                                    </summary>
                                    <div className="dropdown-content z-[50] p-3 shadow-xl bg-base-200 border border-base-300 rounded-box mb-2 w-fit">
                                        <DayPicker 
                                            className="react-day-picker" 
                                            mode="single" 
                                            selected={data.valid_from ? new Date(data.valid_from) : undefined} 
                                            onSelect={(date) => {
                                                if (date) {
                                                    setData('valid_from', format(date, 'yyyy-MM-dd'));
                                                } else {
                                                    setData('valid_from', '');
                                                }
                                                // Close the dropdown
                                                if (validFromRef.current) {
                                                    validFromRef.current.open = false;
                                                }
                                            }} 
                                        />
                                    </div>
                                </details>
                                {errors.valid_from && <p className="text-xs text-error mt-1 ml-1">{errors.valid_from}</p>}
                            </div>

                            <div className="w-full sm:w-1/2">
                                <label className="floating-label mb-1 block">
                                    <span>Valid Until</span>
                                </label>
                                <details ref={validUntilRef} className="dropdown dropdown-top w-full">
                                    <summary className={`input w-full bg-transparent flex items-center justify-between cursor-pointer ${errors.valid_until ? 'input-error' : ''}`}>
                                        <span className={data.valid_until ? "text-base-content" : "text-base-content/50"}>
                                            {data.valid_until ? format(new Date(data.valid_until), 'MMM dd, yyyy') : 'Select Valid Until'}
                                        </span>
                                        <Calendar className="w-4 h-4 opacity-50" />
                                    </summary>
                                    <div className="dropdown-content z-[50] p-3 shadow-xl bg-base-200 border border-base-300 rounded-box mb-2 w-fit">
                                        <DayPicker 
                                            className="react-day-picker" 
                                            mode="single" 
                                            selected={data.valid_until ? new Date(data.valid_until) : undefined} 
                                            onSelect={(date) => {
                                                if (date) {
                                                    setData('valid_until', format(date, 'yyyy-MM-dd'));
                                                } else {
                                                    setData('valid_until', '');
                                                }
                                                // Close the dropdown
                                                if (validUntilRef.current) {
                                                    validUntilRef.current.open = false;
                                                }
                                            }} 
                                        />
                                    </div>
                                </details>
                                {errors.valid_until && <p className="text-xs text-error mt-1 ml-1">{errors.valid_until}</p>}
                            </div>
                        </div>

                        <div className="modal-action mt-6 gap-3">
                            <button type="button" className="btn btn-ghost rounded-full" onClick={closeModal}>
                                Cancel
                            </button>
                            <button type="submit" disabled={processing} className="btn btn-primary px-8 rounded-full">
                                {processing ? <span className="loading loading-spinner"></span> : 'Save Voucher'}
                            </button>
                        </div>
                    </form>
                </div>
                
                <form method="dialog" className="modal-backdrop">
                    <button onClick={closeModal}>close</button>
                </form>
            </dialog>
        </AuthenticatedLayout>
    );
}