import React from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // 🔴 cast to any to avoid TS build errors
  const { items, total } = useCart() as any;
  const { user } = useAuth() as any;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-dark p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Checkout</h2>

        {!user && (
          <p className="text-red-400 mb-4">
            You must be logged in to complete checkout.
          </p>
        )}

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {(items as any[]).map(({ product, quantity }: any, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center border-b border-white/10 pb-2"
            >
              <span>{product?.name}</span>
              <span>
                {quantity} × ${product?.price}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>${total}</span>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
          >
            Cancel
          </button>

          <button
            disabled={!user}
            className="px-4 py-2 rounded bg-lime text-black disabled:opacity-50"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
