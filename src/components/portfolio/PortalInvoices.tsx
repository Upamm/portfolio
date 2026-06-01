'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Receipt,
  Calendar,
  DollarSign,
  X,
  FileText,
  Loader2,
  Inbox,
  CheckCircle2,
} from 'lucide-react';

type InvoiceStatus = 'all' | 'pending' | 'paid' | 'overdue' | 'cancelled';

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  tax: number;
  discount: number;
  status: string;
  dueDate: string;
  projectName: string;
  items: InvoiceItem[];
  createdAt: string;
}

const statusFilters: { key: InvoiceStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'paid', label: 'Paid' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'cancelled', label: 'Cancelled' },
];

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
  paid: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  overdue: 'bg-red-500/15 text-red-400 border-red-500/25',
  cancelled: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function PortalInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filter, setFilter] = useState<InvoiceStatus>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = useCallback(async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('portal_token='))
        ?.split('=')[1];
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/portal/invoices', { headers });
      if (res.ok) {
        const data = await res.json();
        const list = data.data || (Array.isArray(data) ? data : []);
        setInvoices(
          list.map((inv: Record<string, unknown>) => ({
            id: String(inv.id || Math.random().toString(36).slice(2)),
            invoiceNumber: (inv.invoiceNumber as string) || (inv.invoice_number as string) || 'INV-000',
            amount: Number(inv.amount) || 0,
            tax: Number(inv.tax) || 0,
            discount: Number(inv.discount) || 0,
            status: (inv.status as string) || 'pending',
            dueDate: (inv.dueDate as string) || (inv.due_date as string) || '',
            projectName: (inv.projectName as string) || (inv.project_name as string) || '',
            items: Array.isArray(inv.items)
              ? inv.items.map((item: Record<string, unknown>) => ({
                  description: (item.description as string) || '',
                  quantity: Number(item.quantity) || 1,
                  rate: Number(item.rate) || 0,
                  amount: Number(item.amount) || 0,
                }))
              : [],
            createdAt: (inv.createdAt as string) || (inv.created_at as string) || '',
          }))
        );
      }
    } catch {
      // Fallback demo data
      setInvoices([
        {
          id: '1',
          invoiceNumber: 'INV-0042',
          amount: 1500,
          tax: 75,
          discount: 0,
          status: 'pending',
          dueDate: '2025-07-15',
          projectName: 'E-Commerce Website Redesign',
          items: [
            { description: 'UI/UX Design', quantity: 1, rate: 800, amount: 800 },
            { description: 'Frontend Development', quantity: 40, rate: 17.5, amount: 700 },
          ],
          createdAt: '2025-06-15',
        },
        {
          id: '2',
          invoiceNumber: 'INV-0039',
          amount: 800,
          tax: 40,
          discount: 40,
          status: 'paid',
          dueDate: '2025-06-30',
          projectName: 'SEO Optimization Campaign',
          items: [
            { description: 'SEO Audit', quantity: 1, rate: 500, amount: 500 },
            { description: 'On-Page Optimization', quantity: 1, rate: 300, amount: 300 },
          ],
          createdAt: '2025-05-30',
        },
        {
          id: '3',
          invoiceNumber: 'INV-0041',
          amount: 600,
          tax: 30,
          discount: 0,
          status: 'overdue',
          dueDate: '2025-06-01',
          projectName: 'Logo Design Package',
          items: [
            { description: 'Logo Design (3 concepts)', quantity: 1, rate: 400, amount: 400 },
            { description: 'Brand Guidelines', quantity: 1, rate: 200, amount: 200 },
          ],
          createdAt: '2025-05-15',
        },
        {
          id: '4',
          invoiceNumber: 'INV-0043',
          amount: 1200,
          tax: 60,
          discount: 60,
          status: 'pending',
          dueDate: '2025-08-01',
          projectName: 'Lead Generation Landing Pages',
          items: [
            { description: 'Landing Page Design', quantity: 5, rate: 180, amount: 900 },
            { description: 'A/B Testing Setup', quantity: 1, rate: 300, amount: 300 },
          ],
          createdAt: '2025-06-20',
        },
        {
          id: '5',
          invoiceNumber: 'INV-0038',
          amount: 450,
          tax: 22.5,
          discount: 0,
          status: 'cancelled',
          dueDate: '2025-05-15',
          projectName: 'Maintenance Package',
          items: [
            { description: 'Monthly Maintenance', quantity: 1, rate: 450, amount: 450 },
          ],
          createdAt: '2025-04-30',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const filtered =
    filter === 'all'
      ? invoices
      : invoices.filter(inv => inv.status.toLowerCase() === filter);

  const outstandingTotal = invoices
    .filter(inv => inv.status.toLowerCase() === 'pending' || inv.status.toLowerCase() === 'overdue')
    .reduce((sum, inv) => {
      const subtotal = inv.items.reduce((s, item) => s + item.amount, 0);
      return sum + subtotal - inv.discount + inv.tax;
    }, 0);

  const formatDate = (d: string) => {
    if (!d) return 'TBD';
    try {
      return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return d;
    }
  };

  const calcTotal = (inv: Invoice) => {
    const subtotal = inv.items.reduce((s, item) => s + item.amount, 0);
    return subtotal - inv.discount + inv.tax;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 rounded-lg bg-white/5 animate-pulse" />
        <div className="h-20 rounded-xl bg-white/5 animate-pulse" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Receipt className="w-6 h-6 text-teal-400" />
          Invoices
        </h1>
      </div>

      {/* Outstanding Total */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl p-5 border border-teal-500/20"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-slate-400 text-sm">Total Outstanding</p>
            <p className="text-2xl font-bold text-white mt-0.5">
              ${outstandingTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <p className="text-yellow-400 font-bold text-lg">{invoices.filter(i => i.status === 'pending').length}</p>
              <p className="text-slate-500">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-red-400 font-bold text-lg">{invoices.filter(i => i.status === 'overdue').length}</p>
              <p className="text-slate-500">Overdue</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map(sf => (
          <button
            key={sf.key}
            onClick={() => setFilter(sf.key)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === sf.key
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/20'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:bg-teal-500/10 hover:text-teal-400 hover:border-teal-500/30'
            }`}
          >
            {sf.label}
          </button>
        ))}
      </div>

      {/* Invoice List */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-xl p-12 text-center"
        >
          <Inbox className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">No invoices found</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {filtered.map(invoice => (
            <motion.div
              key={invoice.id}
              variants={itemVariants}
              className="glass-card rounded-xl p-4 sm:p-5 cursor-pointer hover-glow group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              onClick={() => setSelectedInvoice(invoice)}
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                  <Receipt className="w-5 h-5 text-teal-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm">{invoice.invoiceNumber}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-md border ${statusStyles[invoice.status] || statusStyles.pending}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5 truncate">{invoice.projectName}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 sm:gap-8 text-sm flex-shrink-0">
                <div className="text-right">
                  <p className="text-white font-bold">${calcTotal(invoice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <div className="flex items-center gap-1 text-slate-500 text-xs justify-end mt-0.5">
                    <Calendar className="w-3 h-3" />
                    {formatDate(invoice.dueDate)}
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-teal-400 group-hover:bg-teal-500/10 transition-colors">
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Invoice Detail Modal */}
      <AnimatePresence>
        {selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedInvoice(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="glass-card rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedInvoice.invoiceNumber}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-md border ${statusStyles[selectedInvoice.status] || statusStyles.pending}`}>
                      {selectedInvoice.status}
                    </span>
                    <span className="text-slate-500 text-xs">{selectedInvoice.projectName}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Items Table */}
                <div>
                  <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-teal-400" />
                    Items Breakdown
                  </h3>
                  <div className="bg-white/5 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left text-slate-400 font-medium px-4 py-3">Description</th>
                          <th className="text-center text-slate-400 font-medium px-4 py-3 hidden sm:table-cell">Qty</th>
                          <th className="text-right text-slate-400 font-medium px-4 py-3 hidden sm:table-cell">Rate</th>
                          <th className="text-right text-slate-400 font-medium px-4 py-3">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.items.map((item, i) => (
                          <tr key={i} className="border-b border-white/5 last:border-b-0">
                            <td className="px-4 py-3 text-white">{item.description}</td>
                            <td className="px-4 py-3 text-slate-400 text-center hidden sm:table-cell">{item.quantity}</td>
                            <td className="px-4 py-3 text-slate-400 text-right hidden sm:table-cell">${item.rate.toFixed(2)}</td>
                            <td className="px-4 py-3 text-white text-right font-medium">${item.amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-full sm:w-64 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Subtotal</span>
                      <span className="text-white">
                        ${selectedInvoice.items.reduce((s, i) => s + i.amount, 0).toFixed(2)}
                      </span>
                    </div>
                    {selectedInvoice.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Discount</span>
                        <span className="text-emerald-400">-${selectedInvoice.discount.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedInvoice.tax > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Tax</span>
                        <span className="text-white">${selectedInvoice.tax.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base pt-2 border-t border-white/10">
                      <span className="text-white font-semibold">Total</span>
                      <span className="text-teal-400 font-bold">${calcTotal(selectedInvoice).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-slate-500 text-xs mb-0.5">Created</p>
                    <p className="text-white text-sm font-medium">{formatDate(selectedInvoice.createdAt)}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-slate-500 text-xs mb-0.5">Due Date</p>
                    <p className={`text-sm font-medium ${selectedInvoice.status === 'overdue' ? 'text-red-400' : 'text-white'}`}>
                      {formatDate(selectedInvoice.dueDate)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
