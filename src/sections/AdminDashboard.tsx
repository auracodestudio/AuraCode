import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { sampleProducts } from '@/data/products';
import type { Product } from '@/types';
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

interface AdminDashboardProps {
  className?: string;
}

// Mock data for dashboard
const mockStats = {
  totalRevenue: 45678.90,
  totalOrders: 234,
  totalCustomers: 156,
  totalProducts: sampleProducts.length,
  recentOrders: [
    { id: 'ORD-001', customer: 'John Doe', total: 149.99, status: 'completed', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Jane Smith', total: 299.99, status: 'processing', date: '2024-01-14' },
    { id: 'ORD-003', customer: 'Bob Johnson', total: 79.99, status: 'pending', date: '2024-01-14' },
    { id: 'ORD-004', customer: 'Alice Brown', total: 199.99, status: 'completed', date: '2024-01-13' },
    { id: 'ORD-005', customer: 'Charlie Wilson', total: 49.99, status: 'shipped', date: '2024-01-13' },
  ],
};

export default function AdminDashboard({ className = '' }: AdminDashboardProps) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return (
      <section className={`relative w-full bg-dark py-24 lg:py-32 ${className}`}>
        <div className="w-full px-6 lg:px-12 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You need admin privileges to view this page.</p>
        </div>
      </section>
    );
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newProduct: Product = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      originalPrice: parseFloat(formData.get('originalPrice') as string) || undefined,
      image: '/product_placeholder.jpg',
      category: formData.get('category') as any,
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()),
      stock: parseInt(formData.get('stock') as string),
      rating: 0,
      reviewCount: 0,
      features: (formData.get('features') as string).split('\n').map(f => f.trim()).filter(Boolean),
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p));
    } else {
      setProducts([...products, newProduct]);
    }

    setIsAddModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <section className={`relative w-full bg-dark py-24 lg:py-32 ${className}`}>
      <div className="w-full px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold">Admin Dashboard</h2>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-lime text-dark hover:bg-lime-dark"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue', value: `$${mockStats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-500' },
            { label: 'Total Orders', value: mockStats.totalOrders, icon: ShoppingCart, color: 'text-blue-500' },
            { label: 'Customers', value: mockStats.totalCustomers, icon: Users, color: 'text-purple-500' },
            { label: 'Products', value: products.length, icon: Package, color: 'text-lime' },
          ].map((stat, i) => (
            <div key={i} className="bg-dark-light rounded-xl p-5 border border-white/5">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-dark-light border border-white/5">
            <TabsTrigger value="products" className="data-[state=active]:bg-lime data-[state=active]:text-dark">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-lime data-[state=active]:text-dark">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-lime data-[state=active]:text-dark">
              <Users className="w-4 h-4 mr-2" />
              Customers
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="bg-dark-light rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Product</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Price</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Stock</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-white/5">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground capitalize">{product.category}</td>
                      <td className="p-4">
                        <span className="text-lime">${product.price.toFixed(2)}</span>
                        {product.originalPrice && (
                          <span className="text-muted-foreground line-through ml-2 text-sm">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={product.stock < 10 ? 'text-red-500' : 'text-muted-foreground'}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsAddModalOpen(true);
                          }}
                          className="p-2 text-muted-foreground hover:text-lime transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="bg-dark-light rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Order ID</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mockStats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-white/5">
                      <td className="p-4 font-mono text-sm">{order.id}</td>
                      <td className="p-4">{order.customer}</td>
                      <td className="p-4 text-muted-foreground">{order.date}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                          order.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                          order.status === 'processing' ? 'bg-blue-500/20 text-blue-500' :
                          order.status === 'shipped' ? 'bg-purple-500/20 text-purple-500' :
                          'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right text-lime">${order.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers">
            <div className="bg-dark-light rounded-xl border border-white/5 p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Customer management coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add/Edit Product Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-dark-light border-white/10 text-foreground max-w-lg max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveProduct} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={editingProduct?.name}
                className="bg-dark border-white/10"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                defaultValue={editingProduct?.description}
                className="w-full px-3 py-2 bg-dark border border-white/10 rounded-md text-foreground resize-none"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  defaultValue={editingProduct?.price}
                  className="bg-dark border-white/10"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price ($)</Label>
                <Input
                  id="originalPrice"
                  name="originalPrice"
                  type="number"
                  step="0.01"
                  defaultValue={editingProduct?.originalPrice}
                  className="bg-dark border-white/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  defaultValue={editingProduct?.category || 'tools'}
                  className="w-full px-3 py-2 bg-dark border border-white/10 rounded-md text-foreground"
                >
                  <option value="programming">Programming</option>
                  <option value="hosting">Hosting</option>
                  <option value="courses">Courses</option>
                  <option value="tools">Tools</option>
                  <option value="templates">Templates</option>
                  <option value="plugins">Plugins</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  defaultValue={editingProduct?.stock || 100}
                  className="bg-dark border-white/10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                name="tags"
                defaultValue={editingProduct?.tags.join(', ')}
                placeholder="React, TypeScript, UI"
                className="bg-dark border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (one per line)</Label>
              <textarea
                id="features"
                name="features"
                defaultValue={editingProduct?.features.join('\n')}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                className="w-full px-3 py-2 bg-dark border border-white/10 rounded-md text-foreground resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="flex-1 border-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-lime text-dark hover:bg-lime-dark"
              >
                {editingProduct ? 'Save Changes' : 'Add Product'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
