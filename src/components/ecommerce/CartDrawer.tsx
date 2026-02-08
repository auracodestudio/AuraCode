import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useI18n } from '@/i18n/I18nContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { items, total, itemCount, updateQuantity, removeFromCart } = useCart();
  const { t, isRTL } = useI18n();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="bg-[#1a1025] border-purple-500/20 text-foreground w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-xl flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-400" />
            {t.cart.title} ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 rounded-full bg-purple-500/10 flex items-center justify-center mb-4 border border-purple-500/20">
              <ShoppingBag className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="font-display text-lg mb-2">{t.cart.empty}</h3>
            <p className="text-muted-foreground">
              {t.cart.emptyDesc}
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4 space-y-4">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3 rounded-xl bg-[#0f0a1a] border border-purple-500/10"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{product.name}</h4>
                    <p className="text-purple-400 font-semibold mt-1">
                      ${product.price.toFixed(2)}
                    </p>
                    
                    <div className={`flex items-center gap-2 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-7 h-7 rounded-full bg-purple-500/10 flex items-center justify-center hover:bg-purple-500/20 transition-colors border border-purple-500/20"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-7 h-7 rounded-full bg-purple-500/10 flex items-center justify-center hover:bg-purple-500/20 transition-colors border border-purple-500/20"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors self-start"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <SheetFooter className="border-t border-purple-500/10 pt-4 flex-col gap-4">
              <div className="w-full space-y-2">
                <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-muted-foreground">{t.cart.subtotal}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-muted-foreground">{t.cart.shipping}</span>
                  <span className="text-purple-400">{t.cart.free}</span>
                </div>
                <div className={`flex justify-between font-semibold text-lg pt-2 border-t border-purple-500/10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span>{t.cart.total}</span>
                  <span className="text-purple-400">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button
                onClick={onCheckout}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6"
              >
                {t.cart.checkout}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
