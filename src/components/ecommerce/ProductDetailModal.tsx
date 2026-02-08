import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/types';
import { ShoppingCart, Check, Star, Minus, Plus, X } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setQuantity(1);
    }, 1500);
  };

  const inCart = isInCart(product.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-light border-white/10 text-foreground max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="font-display text-2xl">{product.name}</DialogTitle>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Image */}
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.originalPrice && (
              <div className="absolute top-3 left-3 px-3 py-1 bg-lime text-dark text-sm font-bold rounded-full">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-4">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-lime text-lime'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="font-bold text-3xl text-lime">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground">{product.description}</p>

            {/* Features */}
            <div>
              <h4 className="font-semibold mb-2">Key Features</h4>
              <ul className="space-y-1">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 bg-lime rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white/5 text-muted-foreground text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stock */}
            <p className={`text-sm ${product.stock < 10 ? 'text-red-500' : 'text-muted-foreground'}`}>
              {product.stock < 10 ? `Only ${product.stock} left in stock!` : `${product.stock} in stock`}
            </p>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                className={`flex-1 py-6 font-semibold transition-all ${
                  isAdded || inCart
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-lime text-dark hover:bg-lime-dark'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added to Cart
                  </>
                ) : inCart ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    In Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
