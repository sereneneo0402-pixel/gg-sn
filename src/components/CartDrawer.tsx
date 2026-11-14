import React, { useMemo, useState } from 'react';
import { CheckCircle2, Minus, Plus, Trash2, X } from 'lucide-react';
import { CartItem, SegmentId } from '../types/businessModel';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  activeSegment: SegmentId;
  onUpdateQty: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCompleteOrder: (orderDetails: {
    customerName: string;
    email: string;
    address: string;
    paymentMethod: string;
  }) => string;
  onViewWarranty: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  activeSegment,
  onUpdateQty,
  onRemoveItem,
  onCompleteOrder,
  onViewWarranty,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Card · Instant Checkout');
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items]
  );

  const totalUnits = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const bundleDiscount = totalUnits >= 3 ? Math.round(subtotal * 0.15) : 0;
  const finalTotal = subtotal - bundleDiscount;

  if (!isOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !email.trim() || !address.trim()) return;
    const orderId = onCompleteOrder({
      customerName: customerName.trim(),
      email: email.trim(),
      address: address.trim(),
      paymentMethod,
    });
    setConfirmedOrderId(orderId);
    setCustomerName('');
    setEmail('');
    setAddress('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/50"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      <div className="bg-white w-full max-w-md h-full flex flex-col justify-between border-l border-slate-200 overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-slate-900">Your Protection Bag</h2>
            <p className="text-xs text-slate-500">
              {totalUnits} {totalUnits === 1 ? 'item' : 'items'} · Segment: {activeSegment}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmedOrderId(null);
              onClose();
            }}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
            aria-label="Close shopping bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          {confirmedOrderId ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Order #{confirmedOrderId} Confirmed — Preparing Shipment</span>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                Your custom items have been automatically registered under our 1-Year Manufacturing Defect Warranty and synced with your Personal Analytics.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmedOrderId(null);
                    onClose();
                    onViewWarranty();
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  View Warranty Ledger
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmedOrderId(null);
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <p className="text-sm font-medium text-slate-700">Your bag is empty.</p>
              <p className="text-xs text-slate-500">
                Customize a phone, earbud, laptop, or bottle protector in Studio to get started.
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-slate-200">
                {items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span
                            className="w-3 h-3 rounded-xs border border-slate-300 inline-block"
                            style={{ backgroundColor: item.primaryColor }}
                          />
                          <span
                            className="w-3 h-3 rounded-xs border border-slate-300 inline-block"
                            style={{ backgroundColor: item.accentColor }}
                          />
                          <span>{item.materialName}</span>
                          {item.engraving && (
                            <span className="font-mono text-slate-700">· {item.engraving}</span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        aria-label={`Remove ${item.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="inline-flex items-center border border-slate-200 rounded-md">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-mono tabular-nums font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-mono tabular-nums text-sm font-semibold text-slate-900">
                        ${(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary & Checkout Form */}
              <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Holistic Multi-Item Savings (3+ items · 15%)</span>
                  <span className="font-mono tabular-nums">-${bundleDiscount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping (Free over $75)</span>
                  <span className="font-mono tabular-nums">{finalTotal >= 75 ? 'Free' : '$8'}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">
                    ${(finalTotal + (finalTotal >= 75 ? 0 : 8)).toLocaleString()}
                  </span>
                </div>
              </div>

              <form onSubmit={handleCheckout} className="space-y-3 pt-4 border-t border-slate-200">
                <div className="text-xs font-semibold text-slate-900">Checkout Details</div>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email for receipt & 1-yr warranty"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Delivery Address & Postal Code"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Card · Instant Checkout">Card · Instant Checkout</option>
                  <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                  <option value="School / Corporate PO">School / Corporate PO</option>
                </select>
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 text-xs font-semibold text-white bg-[#EA580C] rounded-xl hover:bg-[#C2410C] transition-colors cursor-pointer"
                >
                  Place Order &amp; Activate Warranty
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
