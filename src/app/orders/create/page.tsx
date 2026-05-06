"use client";

import { useEffect, useState, Suspense } from 'react';
import { api, Product } from '@/services/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ShoppingBag, User, CreditCard, Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

function OrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedProductId = searchParams.get('product');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [productsLoading, setProductsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState({
    userId: '1',
    items: [] as Array<{ productId: string; quantity: number }>,
  });

  const [newItem, setNewItem] = useState({
    productId: '',
    quantity: 1,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await api.getProducts();
        const data = result.data;
        setProducts(data.filter(p => p.stock > 0));
        if (preselectedProductId && formData.items.length === 0) {
          setFormData(prev => ({ ...prev, items: [{ productId: preselectedProductId, quantity: 1 }] }));
        }
      } catch (error: any) {
        console.error("Error fetching products:", error);
        setErrorMsg("Failed to load products. Please ensure the backend is running and accessible.");
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, [preselectedProductId]);

  if (productsLoading) {
    return (
      <div className="container mx-auto px-6 py-16 max-w-3xl flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Loading Form</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Preparing the order form...</p>
      </div>
    );
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.userId.trim()) {
      newErrors.userId = 'User ID is required';
    }

    if (formData.items.length === 0) {
      newErrors.items = 'Please add at least one product';
    } else {
      formData.items.forEach((item, index) => {
        const product = products.find(p => String(p.id) === String(item.productId));
        if (!product) {
          newErrors[`item_${index}`] = 'Invalid product';
        } else if (item.quantity <= 0) {
          newErrors[`item_${index}`] = 'Quantity must be at least 1';
        } else if (item.quantity > product.stock) {
          newErrors[`item_${index}`] = `Only ${product.stock} units available`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addItem = () => {
    const product = products.find(p => String(p.id) === String(newItem.productId));
    if (!product) return;

    if (newItem.quantity <= 0 || newItem.quantity > product.stock) return;

    // Check if product already added
    if (formData.items.some(item => item.productId === newItem.productId)) {
      setErrors({ addItem: 'Product already added to order' });
      return;
    }

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...newItem }]
    }));
    setNewItem({ productId: '', quantity: 1 });
    setErrors({});
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      const product = products.find(p => String(p.id) === String(item.productId));
      return total + (product ? parseFloat(product.price) * item.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const payload = {
        user_id: Number(formData.userId) || 1,
        items: formData.items.map(item => ({
          product_id: Number(item.productId),
          quantity: item.quantity,
        }))
      };

      const response = await api.createOrder(payload);
      toast.success("Order placed successfully!");

      setTimeout(() => {
        router.push('/order-history');
      }, 1500);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.message || "An error occurred";
      setErrorMsg(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-16 max-w-3xl">
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 md:p-14 shadow-2xl border border-gray-100 dark:border-zinc-800">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-6">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            Place New Order
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Select a product and enter customer details to process the order.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {errorMsg && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-[2rem] text-sm font-semibold border border-red-100 dark:border-red-900/50 flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 w-full justify-center">
                <Loader2 className="w-5 h-5 animate-spin hidden" />
                <span>{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-xs bg-red-100 dark:bg-red-900/40 px-4 py-2 rounded-full hover:bg-red-200 dark:hover:bg-red-800/60 transition-colors"
              >
                Reload Page
              </button>
            </div>
          )}

          <div className="space-y-6">
            <div className="p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-3xl border border-gray-100 dark:border-zinc-800 space-y-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <ShoppingBag className="w-5 h-5 text-purple-500" />
                Product Items
              </h3>

              {/* Add new item */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Product</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <ShoppingBag className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        value={newItem.productId}
                        onChange={(e) => setNewItem({ ...newItem, productId: e.target.value })}
                        className="block w-full pl-12 pr-10 py-3 bg-gray-50 dark:bg-zinc-800 border border-transparent focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-purple-500 rounded-2xl transition-all appearance-none"
                      >
                        <option value="" disabled>Select a product...</option>
                        {products.filter(p => !formData.items.some(item => item.productId === String(p.id))).map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} - ${product.price} ({product.stock} in stock)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
                    <input
                      type="number"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                      className="block w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-transparent focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-purple-500 rounded-2xl transition-all"
                      min="1"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={addItem}
                      disabled={!newItem.productId || newItem.quantity <= 0}
                      className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </button>
                  </div>
                </div>
                {errors.addItem && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.addItem}</p>}
              </div>

              {/* Display added items */}
              {formData.items.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Order Items:</h4>
                  {formData.items.map((item, index) => {
                    const product = products.find(p => String(p.id) === String(item.productId));
                    return (
                      <div key={index} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{product?.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Quantity: {item.quantity} × ${product?.price} = ${(parseFloat(product?.price || '0') * item.quantity).toFixed(2)}
                          </p>
                          {errors[`item_${index}`] && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[`item_${index}`]}</p>}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="ml-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {errors.items && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.items}</p>}
            </div>

            {formData.items.length > 0 && (
              <div className="mt-8 p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30 flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">Order Total</p>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">
                    ${calculateTotal().toFixed(2)}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-full bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || formData.items.length === 0}
              className="w-full flex items-center justify-center py-4 px-8 border border-transparent rounded-2xl shadow-sm text-lg font-bold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" />
                  Processing Order...
                </>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreateOrderPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-20 text-center"><Loader2 className="animate-spin w-10 h-10 mx-auto text-purple-500" /></div>}>
      <OrderForm />
    </Suspense>
  );
}
