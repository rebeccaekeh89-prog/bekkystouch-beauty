import React, { useState, useEffect } from 'react';
import { CustomerOrder, Product } from '../types';
import {
  User, Package, MapPin, Heart, Settings, LogOut, Check,
  AlertCircle, Plus, Trash2, Edit2, ShoppingBag, Eye,
  Lock, KeyRound, ExternalLink, ShieldCheck, Clock
} from 'lucide-react';
import { getAuthToken, updateUserProfile, updatePassword } from '../auth';

export interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  isDefault: boolean;
}

interface MyAccountAreaProps {
  currentUser: { name: string; email: string };
  onSignOut: () => void;
  localOrders: CustomerOrder[];
  products: Product[];
  wishlistIds: number[];
  onToggleWishlist: (productId: number) => void;
  onAddToCart: (product: Product, shade?: string) => void;
  onClose?: () => void;
  initialTab?: 'profile' | 'orders' | 'addresses' | 'wishlist' | 'settings';
}

export const MyAccountArea: React.FC<MyAccountAreaProps> = ({
  currentUser,
  onSignOut,
  localOrders,
  products,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onClose,
  initialTab = 'profile'
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'wishlist' | 'settings'>(initialTab);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Address Form State
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrPostcode, setAddrPostcode] = useState('');
  const [addrDefault, setAddrDefault] = useState(false);

  // Settings State
  const [nameInput, setNameInput] = useState(currentUser.name);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [settingsBusy, setSettingsBusy] = useState(false);

  // Load Saved Addresses strictly for this user
  useEffect(() => {
    try {
      const key = `bekkys_touch_addresses_${currentUser.email.toLowerCase()}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setAddresses(JSON.parse(saved));
      } else {
        setAddresses([]);
      }
    } catch (e) {
      console.warn('Could not read saved addresses:', e);
      setAddresses([]);
    }
  }, [currentUser.email]);

  const saveAddressesToStorage = (newList: SavedAddress[]) => {
    setAddresses(newList);
    try {
      const key = `bekkys_touch_addresses_${currentUser.email.toLowerCase()}`;
      localStorage.setItem(key, JSON.stringify(newList));
    } catch (e) {
      console.warn('Could not save addresses to storage:', e);
    }
  };

  // Load Orders from Serverless Supabase GET /api/orders merged with verified local orders
  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      setLoadingOrders(true);
      const token = getAuthToken();
      let serverOrders: CustomerOrder[] = [];

      if (token) {
        try {
          const res = await fetch('/api/orders', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data.orders)) {
              serverOrders = data.orders.map((row: any) => ({
                orderId: row.id,
                date: new Date(row.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }),
                items: Array.isArray(row.items)
                  ? row.items.map((it: any) => {
                      const prod = products.find(p => p.id === it.product_id);
                      return {
                        id: it.product_id,
                        name: it.name || prod?.name || 'Luxury Product',
                        price: it.unit_price || prod?.price || 0,
                        qty: it.quantity || 1,
                        selectedShade: it.shade || '',
                        image: prod?.image || '/Philosophy.png',
                        category: prod?.category || 'BEAUTY'
                      };
                    })
                  : [],
                subtotal: Number(row.subtotal || 0),
                discount: Number(row.discount || 0),
                shipping: 0,
                total: Number(row.total || 0),
                customer: {
                  name: row.customer_name || currentUser.name,
                  email: row.email || currentUser.email,
                  address: row.address || '',
                  city: row.city || '',
                  postcode: row.postcode || ''
                },
                paymentMethod: row.payment_method === 'offline' ? 'Offline pending' : row.payment_method
              }));
            }
          }
        } catch (e) {
          console.warn('Could not retrieve orders from /api/orders:', e);
        }
      }

      if (!mounted) return;

      // Merge with local orders strictly for this customer's email (no other customer records)
      const userLocal = localOrders.filter(
        o => o.customer.email.toLowerCase() === currentUser.email.toLowerCase()
      );

      const combined = [...serverOrders];
      for (const loc of userLocal) {
        if (!combined.some(c => c.orderId === loc.orderId)) {
          combined.push(loc);
        }
      }

      setOrders(combined);
      setLoadingOrders(false);
    };

    fetchOrders();
    return () => {
      mounted = false;
    };
  }, [currentUser.email, localOrders, products]);

  // Handle Add/Edit Address
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet.trim() || !addrCity.trim() || !addrPostcode.trim()) return;

    let updated: SavedAddress[];
    if (editingAddressId) {
      updated = addresses.map(a =>
        a.id === editingAddressId
          ? {
              ...a,
              name: addrName.trim() || currentUser.name,
              phone: addrPhone.trim(),
              address: addrStreet.trim(),
              city: addrCity.trim(),
              postcode: addrPostcode.trim(),
              isDefault: addrDefault
            }
          : addrDefault ? { ...a, isDefault: false } : a
      );
    } else {
      const newAddr: SavedAddress = {
        id: 'addr_' + Date.now(),
        name: addrName.trim() || currentUser.name,
        phone: addrPhone.trim(),
        address: addrStreet.trim(),
        city: addrCity.trim(),
        postcode: addrPostcode.trim(),
        isDefault: addrDefault || addresses.length === 0
      };
      updated = addrDefault
        ? [...addresses.map(a => ({ ...a, isDefault: false })), newAddr]
        : [...addresses, newAddr];
    }

    saveAddressesToStorage(updated);
    setIsAddingAddress(false);
    setEditingAddressId(null);
    setAddrName('');
    setAddrPhone('');
    setAddrStreet('');
    setAddrCity('');
    setAddrPostcode('');
    setAddrDefault(false);
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter(a => a.id !== id);
    saveAddressesToStorage(updated);
  };

  // Handle Profile Name Update
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setSettingsBusy(true);
    setSettingsError('');
    setSettingsSuccess('');
    try {
      await updateUserProfile(nameInput.trim());
      setSettingsSuccess('Your profile name was successfully updated in Supabase.');
    } catch (err: any) {
      setSettingsError(err.message || 'Could not update your name.');
    } finally {
      setSettingsBusy(false);
    }
  };

  // Handle Password Update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setSettingsError('Please enter a new password.');
      return;
    }
    if (newPassword.length < 6) {
      setSettingsError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setSettingsError('Passwords do not match.');
      return;
    }
    setSettingsBusy(true);
    setSettingsError('');
    setSettingsSuccess('');
    try {
      await updatePassword(newPassword);
      setSettingsSuccess('Your password was successfully updated.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setSettingsError(err.message || 'Could not update your password.');
    } finally {
      setSettingsBusy(false);
    }
  };

  const wishlistProducts = products.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden max-w-5xl mx-auto my-8">
      {/* Account Hero Bar */}
      <div className="bg-[#1E1B18] text-[#FAF9F5] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-950 border border-amber-800/80 flex items-center justify-center font-serif text-2xl font-bold text-amber-200 shrink-0">
            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'B'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-semibold tracking-tight">
                {currentUser.name || 'Valued Customer'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold uppercase tracking-wider">
                Member
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">{currentUser.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSignOut}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-stone-200 text-xs font-semibold rounded-xl border border-white/15 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Account"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-stone-200 bg-[#FAF9F5] px-4 sm:px-8 flex overflow-x-auto gap-2 sm:gap-6 text-xs font-semibold scrollbar-none">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3.5 px-2 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'border-stone-900 text-stone-900 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3.5 px-2 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'border-stone-900 text-stone-900 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Order History ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`py-3.5 px-2 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'addresses'
              ? 'border-stone-900 text-stone-900 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({addresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`py-3.5 px-2 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'wishlist'
              ? 'border-stone-900 text-stone-900 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishlistProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3.5 px-2 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'settings'
              ? 'border-stone-900 text-stone-900 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-6 sm:p-8 min-h-[380px]">
        {/* 1. Profile Overview */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => setActiveTab('orders')}
                className="p-5 rounded-2xl bg-[#FAF9F5] border border-stone-200/90 hover:border-stone-400 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
                  <span>Recent Orders</span>
                  <Package className="w-4 h-4 text-amber-800" />
                </div>
                <p className="font-serif text-3xl font-bold text-stone-900 mt-2">
                  {orders.length}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  {orders.length === 1 ? '1 order placed' : `${orders.length} total orders recorded`}
                </p>
              </div>

              <div
                onClick={() => setActiveTab('addresses')}
                className="p-5 rounded-2xl bg-[#FAF9F5] border border-stone-200/90 hover:border-stone-400 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
                  <span>Shipping Addresses</span>
                  <MapPin className="w-4 h-4 text-amber-800" />
                </div>
                <p className="font-serif text-3xl font-bold text-stone-900 mt-2">
                  {addresses.length}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  {addresses.length === 0 ? 'No addresses saved yet' : `${addresses.length} delivery location(s)`}
                </p>
              </div>

              <div
                onClick={() => setActiveTab('wishlist')}
                className="p-5 rounded-2xl bg-[#FAF9F5] border border-stone-200/90 hover:border-stone-400 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-stone-500 text-xs font-medium">
                  <span>Wishlist Items</span>
                  <Heart className="w-4 h-4 text-rose-700" />
                </div>
                <p className="font-serif text-3xl font-bold text-stone-900 mt-2">
                  {wishlistProducts.length}
                </p>
                <p className="text-[11px] text-stone-500 mt-1">
                  {wishlistProducts.length === 0 ? 'No saved items yet' : `${wishlistProducts.length} favorites saved`}
                </p>
              </div>
            </div>

            {/* Member Benefits */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FAF6F0] to-[#F5ECE0] border border-[#E9DFCE] text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">
                  VIP Beauty Privileges Active
                </span>
                <h4 className="font-serif text-lg font-semibold">
                  Free UK tracked delivery enabled on all orders
                </h4>
                <p className="text-xs text-amber-900/80 max-w-xl">
                  As an authenticated member, your checkout details are prefilled and your order receipts are tied directly to your Supabase account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className="px-4 py-2 bg-[#1E1B18] text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors shrink-0 cursor-pointer"
              >
                Manage Profile
              </button>
            </div>
          </div>
        )}

        {/* 2. Order History */}
        {activeTab === 'orders' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-semibold text-stone-900">
                  Your Order History
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Orders associated strictly with {currentUser.email}
                </p>
              </div>
              {loadingOrders && (
                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <div className="w-3 h-3 border-2 border-stone-400 border-t-stone-800 rounded-full animate-spin" />
                  <span>Checking database...</span>
                </div>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="py-16 text-center bg-[#FAF9F5] rounded-2xl border border-dashed border-stone-300 space-y-3">
                <Package className="w-10 h-10 text-stone-400 mx-auto" />
                <h4 className="font-serif text-lg font-medium text-stone-800">
                  No orders recorded yet
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  When you complete an order, its details and offline payment reference will appear right here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.orderId}
                    className="p-5 rounded-2xl border border-stone-200 bg-white shadow-xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                      <div>
                        <span className="font-serif text-sm font-bold text-stone-900 block">
                          Order #{order.orderId.slice(0, 8).toUpperCase()}
                        </span>
                        <span className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3 h-3 text-stone-400" /> Placed on {order.date}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold uppercase tracking-wider inline-block">
                          {order.paymentMethod || 'Offline Pending'}
                        </span>
                        <p className="font-serif text-sm font-bold text-stone-900 mt-1">
                          £{order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-stone-800">{item.name}</span>
                            {item.selectedShade && (
                              <span className="text-stone-500 text-[11px]">({item.selectedShade})</span>
                            )}
                            <span className="text-stone-400 text-[11px]">× {item.qty}</span>
                          </div>
                          <span className="font-mono text-stone-700">
                            £{(item.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address note */}
                    {order.customer.address && (
                      <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>Delivery to: {order.customer.address}, {order.customer.city} {order.customer.postcode}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-semibold text-stone-900">
                  Saved Shipping Addresses
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Manage delivery addresses for seamless, 1-click checkout.
                </p>
              </div>

              {!isAddingAddress && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingAddressId(null);
                    setAddrName(currentUser.name);
                    setAddrPhone('');
                    setAddrStreet('');
                    setAddrCity('');
                    setAddrPostcode('');
                    setAddrDefault(addresses.length === 0);
                    setIsAddingAddress(true);
                  }}
                  className="px-4 py-2 bg-[#1E1B18] text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Address</span>
                </button>
              )}
            </div>

            {/* Address Add / Edit Form */}
            {isAddingAddress && (
              <form onSubmit={handleSaveAddress} className="p-6 bg-[#FAF9F5] rounded-2xl border border-stone-200 space-y-4">
                <h4 className="font-serif text-base font-semibold text-stone-900">
                  {editingAddressId ? 'Edit Address' : 'Add New Shipping Address'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Recipient Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={addrName}
                      onChange={(e) => setAddrName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={addrPhone}
                      onChange={(e) => setAddrPhone(e.target.value)}
                      placeholder="+44 7000 000000"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={addrStreet}
                    onChange={(e) => setAddrStreet(e.target.value)}
                    placeholder="e.g. 14 Kensington High Street"
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      City / Town
                    </label>
                    <input
                      type="text"
                      required
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      placeholder="London"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Postcode
                    </label>
                    <input
                      type="text"
                      required
                      value={addrPostcode}
                      onChange={(e) => setAddrPostcode(e.target.value)}
                      placeholder="W8 4PF"
                      className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="addrDefault"
                    checked={addrDefault}
                    onChange={(e) => setAddrDefault(e.target.checked)}
                    className="rounded text-stone-900 focus:ring-stone-900"
                  />
                  <label htmlFor="addrDefault" className="text-xs text-stone-700">
                    Set as my default delivery address
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1E1B18] text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingAddress(false);
                      setEditingAddressId(null);
                    }}
                    className="px-4 py-2 border border-stone-300 text-stone-600 text-xs font-semibold rounded-xl hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Address List */}
            {addresses.length === 0 && !isAddingAddress ? (
              <div className="py-16 text-center bg-[#FAF9F5] rounded-2xl border border-dashed border-stone-300 space-y-3">
                <MapPin className="w-10 h-10 text-stone-400 mx-auto" />
                <h4 className="font-serif text-lg font-medium text-stone-800">
                  No saved addresses yet
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Add your primary delivery address to enjoy faster checkout on future orders.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((a) => (
                  <div
                    key={a.id}
                    className={`p-5 rounded-2xl border transition-all relative ${
                      a.isDefault
                        ? 'border-stone-900 bg-white shadow-xs'
                        : 'border-stone-200 bg-[#FAF9F5]'
                    }`}
                  >
                    {a.isDefault && (
                      <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-stone-900 text-white text-[10px] font-semibold uppercase tracking-wider">
                        Default
                      </span>
                    )}

                    <h4 className="font-serif text-sm font-semibold text-stone-900">
                      {a.name}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {a.address}<br />
                      {a.city}, {a.postcode}
                    </p>
                    {a.phone && (
                      <p className="text-xs text-stone-500 mt-1">Tel: {a.phone}</p>
                    )}

                    <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAddressId(a.id);
                          setAddrName(a.name);
                          setAddrPhone(a.phone || '');
                          setAddrStreet(a.address);
                          setAddrCity(a.city);
                          setAddrPostcode(a.postcode);
                          setAddrDefault(a.isDefault);
                          setIsAddingAddress(true);
                        }}
                        className="text-stone-700 hover:text-stone-900 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(a.id)}
                        className="text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. Wishlist */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="font-serif text-xl font-semibold text-stone-900">
                Your Saved Wishlist
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Curated essentials you have bookmarked for future beauty routines.
              </p>
            </div>

            {wishlistProducts.length === 0 ? (
              <div className="py-16 text-center bg-[#FAF9F5] rounded-2xl border border-dashed border-stone-300 space-y-3">
                <Heart className="w-10 h-10 text-stone-400 mx-auto" />
                <h4 className="font-serif text-lg font-medium text-stone-800">
                  Your wishlist is empty
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Click the heart icon on any formula in our boutique catalogue to save your favorites here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl border border-stone-200 bg-white shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 relative mb-3 border border-stone-200">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover object-center"
                        />
                        <button
                          type="button"
                          onClick={() => onToggleWishlist(p.id)}
                          className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 rounded-full shadow-xs text-rose-600 hover:bg-white cursor-pointer"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[10px] uppercase tracking-wider text-amber-900 font-semibold block">
                        {p.category}
                      </span>
                      <h4 className="font-serif text-sm font-semibold text-stone-900 mt-0.5">
                        {p.name}
                      </h4>
                      <p className="font-mono text-xs font-semibold text-stone-800 mt-1">
                        £{p.price.toFixed(2)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddToCart(p)}
                      className="mt-4 w-full py-2 bg-[#1E1B18] text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. Account Settings */}
        {activeTab === 'settings' && (
          <div className="max-w-xl space-y-8 animate-in fade-in duration-200">
            {settingsSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{settingsSuccess}</span>
              </div>
            )}

            {settingsError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{settingsError}</span>
              </div>
            )}

            {/* Profile Info Form */}
            <form onSubmit={handleUpdateName} className="space-y-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  Profile Information
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Update your display name stored in your Supabase profile.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full px-3.5 py-2 bg-stone-100 border border-stone-200 rounded-xl text-xs text-stone-500 cursor-not-allowed"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Email address changes require Supabase verification.
                </span>
              </div>

              <button
                type="submit"
                disabled={settingsBusy || nameInput.trim() === currentUser.name}
                className="px-5 py-2 bg-[#1E1B18] text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-40 cursor-pointer"
              >
                {settingsBusy ? 'Saving...' : 'Update Name'}
              </button>
            </form>

            <hr className="border-stone-200" />

            {/* Change Password Form */}
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <h3 className="font-serif text-lg font-semibold text-stone-900">
                  Security &amp; Password
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Update your authentication password for Bekky’s Touch.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2 bg-[#FAF9F5] border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <button
                type="submit"
                disabled={settingsBusy || !newPassword}
                className="px-5 py-2 bg-[#1E1B18] text-white text-xs font-semibold rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-40 cursor-pointer"
              >
                {settingsBusy ? 'Updating...' : 'Set New Password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
