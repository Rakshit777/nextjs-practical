"use client";

import { useEffect, useState } from 'react';
import { api, Product } from '@/services/api';
import { Package, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await api.getProducts(currentPage, itemsPerPage);
        setProducts(result.data);
        setTotalProducts(result.total);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-500" />
            Products
          </h1>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Loading Products</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Please wait while we fetch the latest catalog...</p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-800/50 dark:text-gray-300 whitespace-nowrap">
                  <tr>
                    <th scope="col" className="px-6 py-5 font-bold tracking-wider">Product ID</th>
                    <th scope="col" className="px-6 py-5 font-bold tracking-wider min-w-[200px]">Product Name</th>
                    <th scope="col" className="px-6 py-5 font-bold tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-5 font-bold tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-5 font-bold tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-6 py-5 font-mono font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {product.id}
                      </td>
                      <td className="px-6 py-5 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                        {product.name}
                      </td>
                      <td className="px-6 py-5 font-black text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                        ${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        {product.stock <= 0 ? (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 whitespace-nowrap">Out of Stock</span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 whitespace-nowrap">{product.stock} in stock</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right whitespace-nowrap">
                        {product.stock > 0 ? (
                          <Link
                            href={`/orders/create?product=${product.id}`}
                            className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20"
                          >
                            Buy Now
                          </Link>
                        ) : (
                          <span className="inline-block bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-gray-500 px-5 py-2 rounded-full text-sm font-semibold cursor-not-allowed">
                            Unavailable
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center">
                        <Package className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No products found</h3>
                        <p className="text-gray-500 mb-4 text-sm">Check back later or add some new products.</p>
                        <Link href="/products/create" className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-colors">
                          Add First Product
                        </Link>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-500 dark:text-gray-400">Products per page:</label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 text-sm font-semibold rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block px-3 py-2 text-gray-900 dark:text-white transition-all outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-gray-700 dark:text-gray-300"
                >
                  Prev
                </button>

                <div className="flex flex-wrap justify-center items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[36px] h-9 sm:min-w-[40px] sm:h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${currentPage === page
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-gray-700 dark:text-gray-300"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
