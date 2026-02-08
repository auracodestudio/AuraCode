import { useState, useEffect } from 'react';
import { db } from '@/db/database';
import { seedDatabase, resetDatabase } from '@/db/seed';
import type { User, Product, Order, SiteSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  AlertCircle,
  Settings,
  RefreshCw,
  Save,
} from 'lucide-react';

interface AdminPanelProps {
  className?: string;
}

export default function AdminPanel({ className = '' }: AdminPanelProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  
  // Modal states
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Stats
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });

  // Initialize database and load data
  useEffect(() => {
    const init = async () => {
      await db.init();
      await seedDatabase();
      await loadAllData();
      setIsLoading(false);
    };
    init();
  }, []);

  const loadAllData = async () => {
    const [productsData, usersData, ordersData, settingsData] = await Promise.all([
      db.getAll<Product>('products'),
      db.getAll<User>('users'),
      db.getAll<Order>('orders'),
      db.getAll<SiteSettings>('siteSettings'),
    ]);
    
    setProducts(productsData);
    setUsers(usersData);
    setOrders(ordersData);
    setSiteSettings(settingsData[0] || null);
    
    // Calculate stats
    const revenue = ordersData.reduce((sum, order) => sum + order.total, 0);
    const customers = usersData.filter(u => u.role === 'customer').length;
    
    setStats({
      totalRevenue: revenue,
      totalOrders: ordersData.length,
      totalCustomers: customers,
      totalProducts: productsData.length,
    });
  };

  // Product handlers
  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const productData: Product = {
      id: editingProduct?.id || `prod-${Date.now()}`,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      originalPrice: parseFloat(formData.get('originalPrice') as string) || undefined,
      image: (formData.get('image') as string) || '/product_placeholder.jpg',
      category: formData.get('category') as any,
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
      stock: parseInt(formData.get('stock') as string),
      rating: editingProduct?.rating || 0,
      reviewCount: editingProduct?.reviewCount || 0,
      features: (formData.get('features') as string).split('\n').map(f => f.trim()).filter(Boolean),
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingProduct) {
      await db.update('products', productData);
    } else {
      await db.add('products', productData);
    }

    await loadAllData();
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await db.delete('products', productId);
      await loadAllData();
    }
  };

  // User handlers
  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const userData: User = {
      id: editingUser?.id || `user-${Date.now()}`,
      email: formData.get('email') as string,
      password: (formData.get('password') as string) || editingUser?.password || 'password123',
      name: formData.get('name') as string,
      role: formData.get('role') as 'admin' | 'customer',
      avatar: editingUser?.avatar || null,
      createdAt: editingUser?.createdAt || new Date().toISOString(),
    };

    if (editingUser) {
      await db.update('users', userData);
    } else {
      await db.add('users', userData);
    }

    await loadAllData();
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user?.id) {
      alert('You cannot delete your own account!');
      return;
    }
    if (confirm('Are you sure you want to delete this user?')) {
      await db.delete('users', userId);
      await loadAllData();
    }
  };

  // Settings handler
  const handleSaveSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (!siteSettings) return;

    const updatedSettings: SiteSettings = {
      ...siteSettings,
      siteName: formData.get('siteName') as string,
      siteDescription: formData.get('siteDescription') as string,
      contactEmail: formData.get('contactEmail') as string,
      contactPhone: formData.get('contactPhone') as string,
      currency: formData.get('currency') as string,
      currencySymbol: formData.get('currencySymbol') as string,
      taxRate: parseFloat(formData.get('taxRate') as string) || 0,
      shippingFee: parseFloat(formData.get('shippingFee') as string) || 0,
      freeShippingThreshold: parseFloat(formData.get('freeShippingThreshold') as string) || 0,
      enableRegistration: formData.get('enableRegistration') === 'on',
      enableCart: formData.get('enableCart') === 'on',
      enableReviews: formData.get('enableReviews') === 'on',
      updatedAt: new Date().toISOString(),
    };

    await db.update('siteSettings', updatedSettings);
    await loadAllData();
    setIsSettingsModalOpen(false);
    alert('Settings saved successfully!');
  };

  // Reset database
  const handleResetDatabase = async () => {
    await resetDatabase();
    await loadAllData();
    setIsResetDialogOpen(false);
    alert('Database has been reset to default values!');
  };

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

  if (isLoading) {
    return (
      <section className={`relative w-full bg-dark py-24 lg:py-32 ${className}`}>
        <div className="w-full px-6 lg:px-12 text-center">
          <RefreshCw className="w-12 h-12 text-lime animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="admin" className={`relative w-full bg-dark py-24 lg:py-32 ${className}`}>
      <div className="w-full px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl font-bold">Admin Panel</h2>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsResetDialogOpen(true)}
              variant="outline"
              className="border-red-500/50 text-red-500 hover:bg-red-500/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset DB
            </Button>
            <Button
              onClick={() => setIsSettingsModalOpen(true)}
              className="bg-lime text-dark hover:bg-lime-dark"
            >
              <Settings className="w-4 h-4 mr-2" />
              Site Settings
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-500' },
            { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, color: 'text-blue-500' },
            { label: 'Customers', value: stats.totalCustomers, icon: Users, color: 'text-purple-500' },
            { label: 'Products', value: stats.totalProducts, icon: Package, color: 'text-lime' },
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-dark-light border border-white/5 flex-wrap h-auto">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-lime data-[state=active]:text-dark">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-lime data-[state=active]:text-dark">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-lime data-[state=active]:text-dark">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-lime data-[state=active]:text-dark">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-dark-light rounded-xl border border-white/5 p-6">
                <h3 className="font-semibold mb-4">Recent Orders</h3>
                {orders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No orders yet</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex justify-between items-center p-3 bg-dark rounded-lg">
                        <div>
                          <p className="font-mono text-sm">{order.id}</p>
                          <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                          order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                          order.status === 'processing' ? 'bg-blue-500/20 text-blue-500' :
                          order.status === 'shipped' ? 'bg-purple-500/20 text-purple-500' :
                          'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-dark-light rounded-xl border border-white/5 p-6">
                <h3 className="font-semibold mb-4">Low Stock Products</h3>
                {products.filter(p => p.stock < 50).length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">All products well stocked</p>
                ) : (
                  <div className="space-y-3">
                    {products.filter(p => p.stock < 50).map((product) => (
                      <div key={product.id} className="flex justify-between items-center p-3 bg-dark rounded-lg">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                          <p className="text-sm">{product.name}</p>
                        </div>
                        <span className={`text-sm font-bold ${product.stock < 20 ? 'text-red-500' : 'text-yellow-500'}`}>
                          {product.stock} left
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">All Products</h3>
              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setIsProductModalOpen(true);
                }}
                className="bg-lime text-dark hover:bg-lime-dark"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
            <div className="bg-dark-light rounded-xl border border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
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
                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground capitalize">{product.category}</td>
                        <td className="p-4">
                          <span className="text-lime">${product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-muted-foreground line-through ml-2 text-sm">${product.originalPrice.toFixed(2)}</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={product.stock < 20 ? 'text-red-500' : 'text-muted-foreground'}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              setEditingProduct(product);
                              setIsProductModalOpen(true);
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
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">All Users</h3>
              <Button
                onClick={() => {
                  setEditingUser(null);
                  setIsUserModalOpen(true);
                }}
                className="bg-lime text-dark hover:bg-lime-dark"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>
            <div className="bg-dark-light rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">User</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Role</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-lime/10 flex items-center justify-center">
                            <span className="font-bold text-lime">{u.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <span className="font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                          u.role === 'admin' ? 'bg-lime/20 text-lime' : 'bg-blue-500/20 text-blue-500'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground text-sm">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setIsUserModalOpen(true);
                          }}
                          className="p-2 text-muted-foreground hover:text-lime transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
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
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">No orders yet</td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/5">
                        <td className="p-4 font-mono text-sm">{order.id}</td>
                        <td className="p-4">{users.find(u => u.id === order.userId)?.name || 'Unknown'}</td>
                        <td className="p-4 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                            order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                            order.status === 'processing' ? 'bg-blue-500/20 text-blue-500' :
                            order.status === 'shipped' ? 'bg-purple-500/20 text-purple-500' :
                            'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right text-lime">${order.total.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Product Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="bg-dark-light border-white/10 text-foreground max-w-lg max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveProduct} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" defaultValue={editingProduct?.name} className="bg-dark border-white/10" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea id="description" name="description" defaultValue={editingProduct?.description} rows={3} className="w-full px-3 py-2 bg-dark border border-white/10 rounded-md text-foreground resize-none" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" name="price" type="number" step="0.01" defaultValue={editingProduct?.price} className="bg-dark border-white/10" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price ($)</Label>
                <Input id="originalPrice" name="originalPrice" type="number" step="0.01" defaultValue={editingProduct?.originalPrice} className="bg-dark border-white/10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select id="category" name="category" defaultValue={editingProduct?.category || 'tools'} className="w-full px-3 py-2 bg-dark border border-white/10 rounded-md text-foreground">
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
                <Input id="stock" name="stock" type="number" defaultValue={editingProduct?.stock || 100} className="bg-dark border-white/10" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" name="image" defaultValue={editingProduct?.image} placeholder="/product_image.jpg" className="bg-dark border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" name="tags" defaultValue={editingProduct?.tags.join(', ')} placeholder="React, TypeScript, UI" className="bg-dark border-white/10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">Features (one per line)</Label>
              <textarea id="features" name="features" defaultValue={editingProduct?.features.join('\n')} rows={4} className="w-full px-3 py-2 bg-dark border border-white/10 rounded-md text-foreground resize-none" />
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)} className="flex-1 border-white/10">Cancel</Button>
              <Button type="submit" className="flex-1 bg-lime text-dark hover:bg-lime-dark">{editingProduct ? 'Save Changes' : 'Add Product'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Modal */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="bg-dark-light border-white/10 text-foreground max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editingUser ? 'Edit User' : 'Add New User'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveUser} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Full Name</Label>
              <Input id="userName" name="name" defaultValue={editingUser?.name} className="bg-dark border-white/10" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="userEmail">Email</Label>
              <Input id="userEmail" name="email" type="email" defaultValue={editingUser?.email} className="bg-dark border-white/10" required />
            </div>
            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="userPassword">Password</Label>
                <Input id="userPassword" name="password" type="password" placeholder="Leave blank for default: password123" className="bg-dark border-white/10" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="userRole">Role</Label>
              <select id="userRole" name="role" defaultValue={editingUser?.role || 'customer'} className="w-full px-3 py-2 bg-dark border border-white/10 rounded-md text-foreground">
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsUserModalOpen(false)} className="flex-1 border-white/10">Cancel</Button>
              <Button type="submit" className="flex-1 bg-lime text-dark hover:bg-lime-dark">{editingUser ? 'Save Changes' : 'Add User'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent className="bg-dark-light border-white/10 text-foreground max-w-2xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Site Settings</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Edit your website configuration. Changes are saved to the database.
            </DialogDescription>
          </DialogHeader>
          {siteSettings && (
            <form onSubmit={handleSaveSettings} className="space-y-6 mt-4">
              <div className="space-y-4">
                <h4 className="font-semibold text-lime">General</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input id="siteName" name="siteName" defaultValue={siteSettings.siteName} className="bg-dark border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Description</Label>
                    <Input id="siteDescription" name="siteDescription" defaultValue={siteSettings.siteDescription} className="bg-dark border-white/10" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lime">Contact</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input id="contactEmail" name="contactEmail" type="email" defaultValue={siteSettings.contactEmail} className="bg-dark border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Phone</Label>
                    <Input id="contactPhone" name="contactPhone" defaultValue={siteSettings.contactPhone} className="bg-dark border-white/10" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lime">Commerce</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input id="currency" name="currency" defaultValue={siteSettings.currency} className="bg-dark border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currencySymbol">Currency Symbol</Label>
                    <Input id="currencySymbol" name="currencySymbol" defaultValue={siteSettings.currencySymbol} className="bg-dark border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input id="taxRate" name="taxRate" type="number" step="0.01" defaultValue={siteSettings.taxRate} className="bg-dark border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingFee">Shipping Fee</Label>
                    <Input id="shippingFee" name="shippingFee" type="number" step="0.01" defaultValue={siteSettings.shippingFee} className="bg-dark border-white/10" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lime">Features</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="enableRegistration" defaultChecked={siteSettings.enableRegistration} className="w-4 h-4 accent-lime" />
                    <span>Enable User Registration</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="enableCart" defaultChecked={siteSettings.enableCart} className="w-4 h-4 accent-lime" />
                    <span>Enable Shopping Cart</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="enableReviews" defaultChecked={siteSettings.enableReviews} className="w-4 h-4 accent-lime" />
                    <span>Enable Product Reviews</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsSettingsModalOpen(false)} className="flex-1 border-white/10">Cancel</Button>
                <Button type="submit" className="flex-1 bg-lime text-dark hover:bg-lime-dark">
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Reset Dialog */}
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent className="bg-dark-light border-white/10 text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-500">Reset Database?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This will delete all data and restore default values. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetDatabase} className="bg-red-500 text-white hover:bg-red-600">
              Reset Database
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
