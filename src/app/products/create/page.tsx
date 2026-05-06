"use client";
import { useState } from 'react';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import { PlusCircle, Loader2, Image as ImageIcon, AlignLeft, DollarSign, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CreateProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }

    const priceNum = parseFloat(formData.price);
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    const stockNum = parseInt(formData.stock, 10);
    if (!formData.stock) {
      newErrors.stock = 'Stock is required';
    } else if (isNaN(stockNum) || stockNum < 0) {
      newErrors.stock = 'Stock cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload: any = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
      };

      const response = await api.createProduct(payload);
      toast.success(response.message || "Product added successfully!");
      
      // Delay redirection to allow user to see the toast
      setTimeout(() => {
        router.push('/products');
      }, 1500);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to add product");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-6 py-16 max-w-3xl">
      <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-10 md:p-14 shadow-2xl border border-gray-100 dark:border-zinc-800">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-6">
            <PlusCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
            Add New Product
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Fill in the details below to add a new product to your catalog.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Product Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-800 border focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 rounded-2xl transition-all ${errors.name ? 'border-red-500' : 'border-transparent'}`}
                  placeholder="e.g. Premium Wireless Headphones"
                />
              </div>
              {errors.name && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Price ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className={`block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-800 border focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 rounded-2xl transition-all ${errors.price ? 'border-red-500' : 'border-transparent'}`}
                    placeholder="299.99"
                  />
                </div>
                {errors.price && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Stock Qty</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="stock"
                    step="1"
                    value={formData.stock}
                    onChange={handleChange}
                    className={`block w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-zinc-800 border focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 rounded-2xl transition-all ${errors.stock ? 'border-red-500' : 'border-transparent'}`}
                    placeholder="10"
                  />
                </div>
                {errors.stock && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.stock}</p>}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-4 px-8 border border-transparent rounded-2xl shadow-sm text-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" />
                  Creating Product...
                </>
              ) : (
                'Create Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
