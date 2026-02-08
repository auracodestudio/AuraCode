import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useI18n } from '@/i18n/I18nContext';
import type { Product } from '@/types';
import { ShoppingCart, Check, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  const { t, isRTL } = useI18n();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const inCart = isInCart(product.id);

  return (
    <div
      onClick={onClick}
      className="group relative bg-[#1a1025] rounded-2xl border border-purple-500/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/30 hover:shadow-purple-glow-sm cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Discount badge */}
        {product.originalPrice && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </div>
        )}

        {/* Stock badge */}
        {product.stock < 10 && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-red-500/80 text-white text-xs font-medium rounded-full">
            {t.store.lowStock.replace('{count}', String(product.stock))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-purple-400">
            {product.category}
          </span>
          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Star className="w-3 h-3 fill-purple-400 text-purple-400" />
            <span className="text-xs text-muted-foreground">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold text-lg mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-purple-500/10 text-purple-300 text-xs rounded-full border border-purple-500/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="font-bold text-xl text-purple-400">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            size="sm"
            className={`transition-all ${
              isAdded || inCart
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
          >
            {isAdded ? (
              <Check className="w-4 h-4" />
            ) : inCart ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
