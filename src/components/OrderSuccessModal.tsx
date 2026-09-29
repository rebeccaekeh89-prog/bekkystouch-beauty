import React from 'react';
import { CustomerOrder } from '../types';
import { CheckCircle, PackageCheck, Printer, ArrowRight } from 'lucide-react';

interface OrderSuccessModalProps {
  order: CustomerOrder | null;
  onClose: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-in zoom-in-95 duration-200 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Icon & Heading */}
        <div className="text-center space-y-3 pb-6 border-b border-stone-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-widest text-amber-900 font-semibold">
            Thank you for choosing Bekky&apos;s Touch
          </span>
          <h2 className="font-serif text-3xl font-semibold text-stone-900">
            Order Received!
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            Your order is recorded for offline payment. Keep your order number for reference. We have not sent an email to <strong>{order.customer.email}</strong>.
          </p>
        </div>

        {/* Order Details Grid */}
        <div className="py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs border-b border-stone-200 bg-[#FAF9F5] p-4 rounded-xl my-4">
          <div>
            <span className="text-stone-400 block mb-0.5">Order Number</span>
            <span className="font-mono font-bold text-stone-900">{order.orderId}</span>
          </div>
          <div>
            <span className="text-stone-400 block mb-0.5">Date</span>
            <span className="font-medium text-stone-900">{order.date}</span>
          </div>
          <div>
            <span className="text-stone-400 block mb-0.5">Payment</span>
            <span className="font-medium text-stone-900">{order.paymentMethod}</span>
          </div>
          <div>
            <span className="text-stone-400 block mb-0.5">Delivery Status</span>
            <span className="font-medium text-emerald-700 flex items-center gap-1">
              <PackageCheck className="w-3.5 h-3.5" /> Preparing
            </span>
          </div>
        </div>

        {/* Items List */}
        <div className="py-4 space-y-3">
          <h4 className="font-serif text-base font-semibold text-stone-900">Ordered products</h4>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100 last:border-none">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover border border-stone-200" />
                  <div>
                    <span className="font-medium text-stone-900 block">{item.name}</span>
                    <span className="text-stone-500 text-[11px]">
                      Qty: {item.qty} {item.selectedShade ? `· ${item.selectedShade}` : ''}
                    </span>
                  </div>
                </div>
                <span className="font-semibold text-stone-900 tabular-nums">
                  £{(item.price * item.qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="pt-4 border-t border-stone-200 text-xs text-stone-600 space-y-1.5">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="tabular-nums">£{order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-amber-800">
              <span>Savings Applied</span>
              <span className="tabular-nums">-£{order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? 'FREE' : `£${order.shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
            <span>Total Paid</span>
            <span className="tabular-nums">£{order.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mt-4 p-3 bg-stone-50 rounded-lg text-xs text-stone-600">
          <span className="font-semibold text-stone-800 block mb-0.5">Shipping to:</span>
          <p>{order.customer.name} · {order.customer.address}, {order.customer.city} {order.customer.postcode}</p>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#1E1B18] text-white rounded-lg text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
