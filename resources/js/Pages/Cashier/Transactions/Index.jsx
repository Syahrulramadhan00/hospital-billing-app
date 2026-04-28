import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Plus, Trash2, Receipt, Calculator, UserRound, Stethoscope, FileText, CheckCircle2 } from 'lucide-react';
import { useState, useMemo } from 'react';
import axios from 'axios';

export default function TransactionIndex({ transactions, insurances, procedures, vouchers }) {
    const { flash } = usePage().props;

    const insuranceList = Array.isArray(insurances) ? insurances : (insurances?.data || []);
    const procedureList = Array.isArray(procedures) ? procedures : (procedures?.data || []);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        patient_name: '',
        insurance_id: '',
        voucher_id: '',
        items: [], 
        total_amount: 0,
        discount_amount: 0,
        final_amount: 0,
    });

    const [selectedProcedureId, setSelectedProcedureId] = useState('');
    const [fetchingPrice, setFetchingPrice] = useState(false);

    const openModal = () => {
        clearErrors();
        reset();
        document.getElementById('pos_modal').showModal();
    };

    const closeModal = () => {
        document.getElementById('pos_modal').close();
        reset();
    };

    // Formatter
    const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

    // Add Procedure to Cart
    const addProcedure = async () => {
        if (!selectedProcedureId) return;
        setFetchingPrice(true);
        try {
            const response = await axios.get(route('api.procedures.price', selectedProcedureId));
            const price = parseFloat(response.data.price);
            const procInfo = procedureList.find(p => p.id === selectedProcedureId || p.procedure_id === selectedProcedureId);
            
            const newItem = {
                id: Date.now(),
                procedure_id: selectedProcedureId,
                name: procInfo?.name || 'Unknown Procedure',
                price: price,
                quantity: 1,
            };

            setData('items', [...data.items, newItem]);
            setSelectedProcedureId('');
        } catch (error) {
            alert("Failed to fetch price. Is your token expired?");
        } finally {
            setFetchingPrice(false);
        }
    };

    // Cart Controls
    const removeItem = (idToRemove) => setData('items', data.items.filter(i => i.id !== idToRemove));
    const updateQuantity = (id, newQty) => setData('items', data.items.map(i => i.id === id ? { ...i, quantity: newQty >= 1 ? newQty : 1 } : i));

    // Live Calculations (Subtotal & Discounts per Guideline [cite: 68])
    const calculations = useMemo(() => {
        let subtotal = 0;
        let totalDiscount = 0;
        const activeVoucher = vouchers.find(v => v.id == data.voucher_id);

        data.items.forEach(item => {
            subtotal += item.price * item.quantity;
            if (activeVoucher) {
                let itemDiscount = 0;
                if (activeVoucher.discount_type === 'percentage') {
                    itemDiscount = (item.price * (parseFloat(activeVoucher.discount_value) / 100)) * item.quantity;
                    if (activeVoucher.max_discount_amount) {
                        const max = parseFloat(activeVoucher.max_discount_amount) * item.quantity;
                        if (itemDiscount > max) itemDiscount = max;
                    }
                } else if (activeVoucher.discount_type === 'nominal') {
                    itemDiscount = parseFloat(activeVoucher.discount_value) * item.quantity;
                }
                totalDiscount += itemDiscount;
            }
        });

        if (totalDiscount > subtotal) totalDiscount = subtotal;
        return { subtotal, discount: totalDiscount, grandTotal: subtotal - totalDiscount };
    }, [data.items, data.voucher_id, vouchers]);

    // Sync calculations with Inertia Form Data
    useMemo(() => {
        setData(prev => ({
            ...prev,
            total_amount: calculations.subtotal,
            discount_amount: calculations.discount,
            final_amount: calculations.grandTotal
        }));
    }, [calculations]);

    const availableVouchers = vouchers.filter(v => v.insurance_id === data.insurance_id);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.items.length === 0) return alert("Add at least one procedure.");
        post(route('transactions.store'), {
            onSuccess: () => closeModal()
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Transactions" />

            <div className="max-w-7xl mx-auto p-4 sm:p-8">
                
                {/* PAGE HEADER */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-xl">
                            <Receipt className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-base-content">Payment Transactions</h1>
                            <p className="text-sm text-base-content/60">Manage hospital billing and print receipts</p>
                        </div>
                    </div>
                    <button onClick={openModal} className="btn btn-primary rounded-full shadow-sm px-6">
                        <Plus className="w-5 h-5" /> New Transaction
                    </button>
                </div>

                {flash?.success && (
                    <div role="alert" className="alert alert-success alert-soft mb-6 shadow-sm">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* TRANSACTION HISTORY TABLE */}
                <div className="bg-base-100 rounded-box shadow-sm border border-base-200 overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead className="bg-base-200/50">
                            <tr>
                                <th>Invoice #</th>
                                <th>Patient Name</th>
                                <th>Date</th>
                                <th>Cashier</th>
                                <th>Total Paid</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-base-content/50">No transactions recorded yet.</td></tr>
                            ) : (
                                transactions.map(trx => (
                                    <tr key={trx.id}>
                                        <td className="font-mono font-semibold">{trx.invoice_number}</td>
                                        <td>{trx.patient_name}</td>
                                        <td>{new Date(trx.created_at).toLocaleDateString()}</td>
                                        <td>{trx.cashier?.name}</td>
                                        <td className="font-bold text-primary">{formatRp(trx.final_amount)}</td>
                                        <td>
                                            <button className="btn btn-ghost btn-sm text-primary gap-2">
                                                <FileText className="w-4 h-4"/> PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FULL-WIDTH POS MODAL */}
            <dialog id="pos_modal" className="modal modal-bottom sm:modal-middle">
                {/* Note: w-11/12 max-w-7xl gives us the ultra-wide layout needed for POS */}
                <div className="modal-box w-11/12 max-w-7xl bg-base-200 p-6 flex flex-col gap-6 overflow-y-visible">
                    <div className="flex justify-between items-center pb-4 border-b border-base-300">
                        <h3 className="font-bold text-xl flex items-center gap-2"><Calculator className="w-6 h-6"/> Point of Sale</h3>
                        <form method="dialog"><button className="btn btn-sm btn-circle btn-ghost">✕</button></form>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
                        
                        {/* LEFT: Input Panels */}
                        <div className="flex-1 flex flex-col gap-6">
                            <div className="bg-base-100 p-5 rounded-box shadow-sm">
                                <h4 className="font-semibold mb-4 flex items-center gap-2"><UserRound className="w-5 h-5"/> Patient Details</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <label className="floating-label">
                                        <span>Patient Name</span>
                                        <input type="text" className="input w-full bg-transparent validator" value={data.patient_name} onChange={e => setData('patient_name', e.target.value)} required />
                                    </label>
                                    <label className="floating-label">
                                        <span>Insurance</span>
                                        <select className="select w-full bg-transparent validator" value={data.insurance_id} onChange={e => { setData('insurance_id', e.target.value); setData('voucher_id', ''); }} required>
                                            <option value="" disabled>Select...</option>
                                            {insuranceList.map(ins => <option key={ins.id || ins.insurance_id} value={ins.id || ins.insurance_id}>{ins.name}</option>)}
                                        </select>
                                    </label>
                                    <label className="floating-label">
                                        <span>Voucher</span>
                                        <select className="select w-full bg-transparent" value={data.voucher_id} onChange={e => setData('voucher_id', e.target.value)} disabled={!data.insurance_id || availableVouchers.length===0}>
                                            <option value="">No Voucher</option>
                                            {availableVouchers.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                        </select>
                                    </label>
                                </div>
                            </div>

                            <div className="bg-base-100 p-5 rounded-box shadow-sm flex-1">
                                <h4 className="font-semibold mb-4 flex items-center gap-2"><Stethoscope className="w-5 h-5"/> Medical Procedures</h4>
                                <div className="flex gap-2 mb-4">
                                    <label className="floating-label flex-1">
                                        <span>Add Procedure</span>
                                        <select className="select w-full bg-transparent" value={selectedProcedureId} onChange={e => setSelectedProcedureId(e.target.value)}>
                                            <option value="">Choose procedure...</option>
                                            {procedureList.map(proc => <option key={proc.id || proc.procedure_id} value={proc.id || proc.procedure_id}>{proc.name}</option>)}
                                        </select>
                                    </label>
                                    <button type="button" onClick={addProcedure} disabled={!selectedProcedureId || fetchingPrice} className="btn btn-primary h-12">
                                        {fetchingPrice ? <span className="loading loading-spinner"></span> : <Plus className="w-5 h-5"/>} Add
                                    </button>
                                </div>

                                <div className="overflow-x-auto border border-base-200 rounded-box max-h-64 overflow-y-auto">
                                    <table className="table table-xs table-pin-rows table-zebra w-full">
                                        <thead className="bg-base-200">
                                            <tr>
                                                <th>Procedure</th>
                                                <th>Price</th>
                                                <th className="w-20">Qty</th>
                                                <th>Subtotal</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.items.length === 0 ? (
                                                <tr><td colSpan="5" className="text-center py-4">No procedures added.</td></tr>
                                            ) : (
                                                data.items.map(item => (
                                                    <tr key={item.id}>
                                                        <td className="whitespace-normal">{item.name}</td>
                                                        <td>{formatRp(item.price)}</td>
                                                        <td><input type="number" min="1" className="input input-xs w-16 bg-transparent border-none shadow-none outline-none" value={item.quantity} onChange={e => updateQuantity(item.id, parseInt(e.target.value) || 1)} /></td>
                                                        <td className="font-semibold">{formatRp(item.price * item.quantity)}</td>
                                                        <td><button type="button" onClick={() => removeItem(item.id)} className="btn btn-ghost btn-xs text-error"><Trash2 className="w-4 h-4" /></button></td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Receipt Summary */}
                        <div className="w-full lg:w-[350px]">
                            <div className="bg-neutral text-neutral-content p-6 rounded-box shadow-md flex flex-col gap-4">
                                <h2 className="text-lg font-bold border-b border-neutral-content/20 pb-4">Receipt Summary</h2>
                                <div className="flex justify-between text-sm"><span className="opacity-70">Total Items:</span><span className="font-bold">{data.items.reduce((sum, i) => sum + i.quantity, 0)}</span></div>
                                <div className="flex justify-between text-sm"><span className="opacity-70">Subtotal:</span><span className="font-bold">{formatRp(calculations.subtotal)}</span></div>
                                
                                {calculations.discount > 0 && (
                                    <div className="flex justify-between text-success bg-success/10 p-2 rounded-lg">
                                        <span className="font-medium">Discount:</span><span className="font-bold">- {formatRp(calculations.discount)}</span>
                                    </div>
                                )}

                                <div className="divider my-0 border-neutral-content/20"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-lg opacity-80">Final Total</span>
                                    <span className="text-2xl font-bold text-primary">{formatRp(calculations.grandTotal)}</span>
                                </div>

                                <button type="submit" disabled={processing || data.items.length === 0} className="btn btn-primary btn-lg w-full mt-4 rounded-full">
                                    {processing ? <span className="loading loading-spinner"></span> : 'Submit Payment'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop"><button onClick={closeModal}>close</button></form>
            </dialog>
        </AuthenticatedLayout>
    );
}