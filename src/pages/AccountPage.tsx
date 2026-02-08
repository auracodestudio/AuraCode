import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/i18n/I18nContext';
import type { Order, Address } from '@/types';
import {
  User,
  Package,
  CreditCard,
  MapPin,
  LogOut,
  Edit2,
  Check,
  ArrowLeft,
  Shield,
  Mail,
  Phone,
} from 'lucide-react';

// Mock order history - in production this would come from the database
const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    userId: 'user-1',
    items: [],
    total: 149.99,
    subtotal: 139.99,
    tax: 10,
    shipping: 0,
    status: 'delivered',
    shippingAddress: { id: '1', name: 'Home', street: '123 Main St', city: 'City', state: 'State', zipCode: '12345', country: 'USA', isDefault: true },
    paymentMethod: { id: '1', type: 'card', last4: '4242', brand: 'Visa' },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'ORD-2024-002',
    userId: 'user-1',
    items: [],
    total: 299.99,
    subtotal: 279.99,
    tax: 20,
    shipping: 0,
    status: 'processing',
    shippingAddress: { id: '1', name: 'Home', street: '123 Main St', city: 'City', state: 'State', zipCode: '12345', country: 'USA', isDefault: true },
    paymentMethod: { id: '1', type: 'card', last4: '4242', brand: 'Visa' },
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
];

const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    name: 'Home',
    street: '123 Developer Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    country: 'USA',
    isDefault: true,
  },
];

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const { t } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '+1 (555) 123-4567',
  });
  const [orders] = useState<Order[]>(mockOrders);
  const [addresses] = useState<Address[]>(mockAddresses);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        phone: '+1 (555) 123-4567',
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    // In production, save to database
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500/20 text-green-500';
      case 'processing':
        return 'bg-blue-500/20 text-blue-500';
      case 'shipped':
        return 'bg-purple-500/20 text-purple-500';
      default:
        return 'bg-yellow-500/20 text-yellow-500';
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-purple flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-purple">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark-purple/90 backdrop-blur-md border-b border-purple-500/10">
        <div className="w-full px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <h1 className="font-display text-xl font-bold">{t.account.title}</h1>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">{t.nav.signOut}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-900/50 to-dark-purple rounded-2xl p-6 mb-8 border border-purple-500/20">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-purple-500/25">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-bold mb-1">{user?.name}</h2>
              <p className="text-muted-foreground mb-2">{user?.email}</p>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs capitalize ${
                user?.role === 'admin' 
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                <Shield className="w-3 h-3" />
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-purple-900/30 border border-purple-500/20 w-full flex-wrap h-auto p-1">
            <TabsTrigger value="orders" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex-1">
              <Package className="w-4 h-4 mr-2" />
              {t.account.orders}
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex-1">
              <User className="w-4 h-4 mr-2" />
              {t.account.profile}
            </TabsTrigger>
            <TabsTrigger value="addresses" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex-1">
              <MapPin className="w-4 h-4 mr-2" />
              {t.account.addresses}
            </TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white flex-1">
              <CreditCard className="w-4 h-4 mr-2" />
              {t.account.payment}
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 bg-purple-900/20 rounded-2xl border border-purple-500/10">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-purple-900/20 rounded-xl border border-purple-500/10 p-5 hover:border-purple-500/30 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-sm text-purple-400">{order.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="text-left lg:text-right">
                        <p className="font-bold text-lg text-purple-400">${order.total.toFixed(2)}</p>
                        <Button variant="link" className="text-sm p-0 h-auto text-purple-400 hover:text-purple-300">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="bg-purple-900/20 rounded-xl border border-purple-500/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-400" />
                  {t.account.personalInfo}
                </h3>
                <button
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  {isEditing ? (
                    <>
                      <Check className="w-4 h-4" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      {t.account.edit}
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="bg-purple-950/50 border-purple-500/20"
                      />
                    ) : (
                      <p className="font-medium text-lg">{profileData.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    {isEditing ? (
                      <Input
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="bg-purple-950/50 border-purple-500/20"
                        disabled
                      />
                    ) : (
                      <p className="font-medium text-lg">{profileData.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone
                    </Label>
                    {isEditing ? (
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="bg-purple-950/50 border-purple-500/20"
                      />
                    ) : (
                      <p className="font-medium text-lg">{profileData.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <div className="space-y-4">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-purple-900/20 rounded-xl border border-purple-500/10 p-5 hover:border-purple-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{address.name}</span>
                        {address.isDefault && (
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                            {t.account.default}
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {address.street}<br />
                        {address.city}, {address.state} {address.zipCode}<br />
                        {address.country}
                      </p>
                    </div>
                    <button className="text-muted-foreground hover:text-purple-400 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full border-dashed border-purple-500/30 text-muted-foreground hover:text-foreground hover:border-purple-500/50"
              >
                + Add New Address
              </Button>
            </div>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment">
            <div className="bg-purple-900/20 rounded-xl border border-purple-500/10 p-8 text-center">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">{t.account.noPaymentMethods}</p>
              <Button className="bg-purple-600 hover:bg-purple-700">
                {t.account.addPayment}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
