import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { CreditCard, Lock, Check, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');

  // Form states
  const [shippingData, setShippingData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setIsComplete(true);
    clearCart();

    // Close after showing success
    setTimeout(() => {
      setIsComplete(false);
      setStep('shipping');
      onClose();
    }, 3000);
  };

  if (isComplete) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-dark-light border-white/10 text-foreground max-w-md">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2">Order Confirmed!</h2>
            <p className="text-muted-foreground">
              Thank you for your purchase. You will receive a confirmation email shortly.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-light border-white/10 text-foreground max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {step === 'shipping' ? 'Shipping Information' : 'Payment'}
          </DialogTitle>
        </DialogHeader>

        {/* Order Summary */}
        <div className="bg-dark rounded-xl p-4 mb-6">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <div className="space-y-2">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {product.name} x{quantity}
                </span>
                <span>${(product.price * quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 mt-3 pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-lime">${total.toFixed(2)}</span>
          </div>
        </div>

        {step === 'shipping' ? (
          <form onSubmit={handleShippingSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={shippingData.name}
                  onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                  className="bg-dark border-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={shippingData.email}
                  onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                  className="bg-dark border-white/10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={shippingData.street}
                onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
                className="bg-dark border-white/10"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={shippingData.city}
                  onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                  className="bg-dark border-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={shippingData.state}
                  onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                  className="bg-dark border-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  value={shippingData.zipCode}
                  onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                  className="bg-dark border-white/10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-lime text-dark hover:bg-lime-dark font-semibold py-6 mt-4"
            >
              Continue to Payment
            </Button>
          </form>
        ) : (
          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            {/* Payment Method Selection */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center gap-3 p-4 rounded-xl bg-lime/10 border border-lime/50 text-left"
              >
                <CreditCard className="w-5 h-5 text-lime" />
                <div>
                  <p className="font-medium">Credit Card</p>
                  <p className="text-xs text-muted-foreground">Visa, Mastercard, Amex</p>
                </div>
              </button>
              <button
                type="button"
                className="flex items-center gap-3 p-4 rounded-xl bg-dark border border-white/10 text-left opacity-50"
                disabled
              >
                <div className="w-5 h-5" />
                <div>
                  <p className="font-medium">PayPal</p>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </div>
              </button>
            </div>

            {/* Card Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    className="bg-dark border-white/10 pl-10"
                    required
                  />
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    className="bg-dark border-white/10"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <div className="relative">
                    <Input
                      id="cvc"
                      placeholder="123"
                      className="bg-dark border-white/10 pl-10"
                      required
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('shipping')}
                className="flex-1 border-white/10"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-lime text-dark hover:bg-lime-dark font-semibold py-6"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  `Pay $${total.toFixed(2)}`
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
              <Lock className="w-3 h-3" />
              Secure payment powered by Stripe
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
