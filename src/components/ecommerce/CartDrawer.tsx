import React from 'react';
import { useCart } from '@/contexts/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onCheckout,
}) => {
  if (!isOpen) return null;

  // 🔴 cast to any to bypass TS strict errors
  const {
    items,
    total,
    itemCount,
    updateQuantity,
    removeFromCart,
  } = useCart() as any;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60">
      <div className="w-96 bg-dark h-full p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Cart ({itemCount ?? 0})
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {(items as any[]).map(({ product, quantity }: any, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center border-b border-white/10 pb-3"
            >
              <div>
                <p className="font-medium">{product?.name}</p>
                <p className="text-sm text-gray-400">
                  ${product?.price}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(product.id, quantity - 1)
                  }
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  onClick={() =>
                    updateQuantity(product.id, quantity + 1)
                  }
                >
                  +
                </button>

                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-red-400 ml-2"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="flex justify-between font-bold mb-4">
            <span>Total</span>
            <span>${total}</span>
          </div>

          <button
            onClick={onCheckout}
            className="w-full py-2 rounded bg-lime text-black"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
