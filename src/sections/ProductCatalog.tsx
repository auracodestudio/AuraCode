import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { db } from '@/db/database';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ecommerce/ProductCard';
import ProductDetailModal from '@/components/ecommerce/ProductDetailModal';
import { useI18n } from '@/i18n/I18nContext';
import type { Product } from '@/types';
import { Search, Grid3X3, Code2, Server, GraduationCap, Wrench, Layout, Plug } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ProductCatalogProps {
  className?: string;
}

export default function ProductCatalog({ className = '' }: ProductCatalogProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, isRTL } = useI18n();

  // Category config with translations
  const categories = [
    { id: 'all', name: t.store.allProducts, icon: Grid3X3 },
    { id: 'programming', name: t.store.programming, icon: Code2 },
    { id: 'hosting', name: t.store.hosting, icon: Server },
    { id: 'courses', name: t.store.courses, icon: GraduationCap },
    { id: 'tools', name: t.store.tools, icon: Wrench },
    { id: 'templates', name: t.store.templates, icon: Layout },
    { id: 'plugins', name: t.store.plugins, icon: Plug },
  ];

  // Load products from database
  useEffect(() => {
    const loadProducts = async () => {
      const data = await db.getAll<Product>('products');
      setProducts(data);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.product-grid > *',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.product-grid',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [filteredProducts]);

  if (isLoading) {
    return (
      <section className={`relative w-full bg-dark-purple py-16 sm:py-24 lg:py-32 ${className}`}>
        <div className="w-full px-4 sm:px-6 lg:px-12 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm sm:text-base">{t.common.loading}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="store"
      className={`relative w-full bg-dark-purple py-16 sm:py-24 lg:py-32 ${className}`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.08em] text-purple-400 mb-3 sm:mb-4 block">
            {t.nav.store}
          </span>
          <h2
            className="font-display font-bold text-foreground leading-[0.95] tracking-tight mb-3 sm:mb-4"
            style={{ fontSize: 'clamp(28px, 6vw, 64px)' }}
          >
            {t.store.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
            {t.store.subtitle}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className={`absolute ${isRTL ? 'right-3 sm:right-4' : 'left-3 sm:left-4'} top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground`} />
            <Input
              placeholder={t.store.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${isRTL ? 'pr-10 sm:pr-12' : 'pl-10 sm:pl-12'} bg-[#1a1025] border-white/10 text-foreground rounded-full text-sm`}
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSearchQuery('');
                  }}
                  className={`rounded-full text-xs sm:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 ${
                    activeCategory === cat.id
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'border-white/10 text-muted-foreground hover:text-foreground hover:border-purple-500/30'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRTL ? 'ml-1 sm:ml-2' : 'mr-1 sm:mr-2'}`} />
                  <span className="hidden sm:inline">{cat.name}</span>
                  <span className="sm:hidden">{cat.name.split(' ')[0]}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="product-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => setSelectedProduct(product)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 sm:py-20">
            <p className="text-muted-foreground text-base sm:text-lg">{t.store.noProducts}</p>
            <Button
              variant="outline"
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="mt-4 border-white/10 text-sm"
            >
              {t.store.clearFilters}
            </Button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </section>
  );
}
