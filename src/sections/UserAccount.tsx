import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  Package,
  CreditCard,
  LogOut,
  MapPin,
  Edit2,
  Check,
} from 'lucide-react';

interface UserAccountProps {
  className?: string;
}

// Mock order history
const mockOrders = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-15',
    items: ['VS Code Pro Extension Pack', 'Git Mastery Course'],
    total: 129.98,
    status: 'delivered',
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-10',
    items: ['React Dashboard Pro Template'],
    total: 129.99,
    status: 'processing',
  },
  {
    id: 'ORD-2023-089',
    date: '2023-12-20',
    items: ['Cloud VPS Starter'],
    total: 19.99,
    status: 'completed',
  },
];

// Mock addresses
const mockAddresses = [
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

export default function UserAccount({ className = '' }: UserAccountProps) {
  const { user, logout, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
  });

  if (!user) {
    return (
      <section className={`relative w-full bg-dark py-24 lg:py-32 ${className}`}>
        <div className="w-full px-6 lg:px-12 text-center">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2">Not Logged In</h2>
          <p className="text-muted-foreground">Please log in to view your account.</p>
        </div>
      </section>
    );
  }

  const handleSaveProfile = async () => {
    await updateProfile({ name: profileData.name });
    setIsEditing(false);
  };

  return (
    <section className={`relative w-full bg-dark py-24 lg:py-32 ${className}`}>
      <div className="w-full px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-lime/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-lime">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-lime/10 text-lime text-xs rounded-full capitalize">
                {user.role}
              </span>
            </div>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="border-white/10 text-muted-foreground hover:text-red-500 hover:border-red-500/30"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="bg-dark-light border border-white/5">
            <TabsTrigger value="orders" className="data-[state=active]:bg-lime data-[state=active]:text-dark">
              <Package className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-lime data-[state=active]:text-dark">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="addresses" className="data-[state=active]:bg-lime data-[state=active]:text-dark">
              <MapPin className="w-4 h-4 mr-2" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-lime data-[state=active]:text-dark">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment
            </TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-dark-light rounded-xl border border-white/5 p-5"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm text-muted-foreground">
                          {order.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                          order.status === 'delivered' ? 'bg-green-500/20 text-green-500' :
                          order.status === 'processing' ? 'bg-blue-500/20 text-blue-500' :
                          'bg-purple-500/20 text-purple-500'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-sm mt-1">{order.items.join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-lime">${order.total.toFixed(2)}</p>
                      <Button variant="link" className="text-sm p-0 h-auto">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="bg-dark-light rounded-xl border border-white/5 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Personal Information</h3>
                <button
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  className="flex items-center gap-2 text-lime hover:text-lime-dark transition-colors"
                >
                  {isEditing ? (
                    <>
                      <Check className="w-4 h-4" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="bg-dark border-white/10 mt-1"
                    />
                  ) : (
                    <p className="font-medium mt-1">{profileData.name}</p>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="bg-dark border-white/10 mt-1"
                      disabled
                    />
                  ) : (
                    <p className="font-medium mt-1">{profileData.email}</p>
                  )}
                </div>

                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="bg-dark border-white/10 mt-1"
                    />
                  ) : (
                    <p className="font-medium mt-1">{profileData.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <div className="space-y-4">
              {mockAddresses.map((address) => (
                <div
                  key={address.id}
                  className="bg-dark-light rounded-xl border border-white/5 p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{address.name}</span>
                        {address.isDefault && (
                          <span className="px-2 py-0.5 bg-lime/10 text-lime text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {address.street}<br />
                        {address.city}, {address.state} {address.zipCode}<br />
                        {address.country}
                      </p>
                    </div>
                    <button className="text-muted-foreground hover:text-lime transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full border-dashed border-white/20 text-muted-foreground hover:text-foreground"
              >
                + Add New Address
              </Button>
            </div>
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment">
            <div className="bg-dark-light rounded-xl border border-white/5 p-8 text-center">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No saved payment methods</p>
              <Button className="mt-4 bg-lime text-dark hover:bg-lime-dark">
                Add Payment Method
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
