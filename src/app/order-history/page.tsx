"use client";

import { useEffect, useState } from 'react';
import { api, Order } from '@/services/api';
import { ListOrdered, Clock, CheckCircle2, RefreshCw, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await api.getOrders(currentPage, itemsPerPage);
      setOrders(result.data);
      setTotalOrders(result.total);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = async (orderId: number) => {
    try {
      await api.cancelOrder(orderId);
      fetchOrders();
    } catch (error) {
      console.error("Failed to cancel order", error);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> Completed
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Processing
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3 text-gray-900 dark:text-white">
            <ListOrdered className="w-8 h-8 text-purple-500" />
            Order History
          </h1>
        </div>
        <Link
          href="/orders/create"
          className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30"
        >
          Create New Order
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-zinc-800/50 dark:text-gray-300 whitespace-nowrap">
              <tr>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider">Order ID</th>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider">User ID</th>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider">Date</th>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider">Qty</th>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider">Total</th>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider">Status</th>
                <th scope="col" className="px-6 py-5 font-bold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-32 text-center">
                    <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Loading Orders</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Please wait while we fetch the order history...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <p className="text-lg text-gray-500 dark:text-gray-400">No orders found.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-5 font-mono font-medium text-gray-900 dark:text-white whitespace-nowrap">
                      {order.id}
                    </td>
                    <td className="px-6 py-5 font-medium text-gray-900 dark:text-gray-200 whitespace-nowrap">
                      User {order.user_id}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {new Date(order?.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-5 font-medium text-gray-900 dark:text-gray-200 whitespace-nowrap">
                      {order.quantity || 1}
                    </td>
                    <td className="px-6 py-5 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                      ${order.total_amount}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' ? (
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold px-3 py-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-600 font-medium pr-4">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <label htmlFor="itemsPerPage" className="text-sm font-medium text-gray-500 dark:text-gray-400">Orders per page:</label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 text-sm font-semibold rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block px-3 py-2 text-gray-900 dark:text-white transition-all outline-none"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {totalOrders > itemsPerPage && (
          <div className="flex flex-wrap justify-center items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-gray-700 dark:text-gray-300"
            >
              Prev
            </button>

            <div className="flex flex-wrap justify-center items-center gap-1">
              {Array.from({ length: Math.ceil(totalOrders / itemsPerPage) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[36px] h-9 sm:min-w-[40px] sm:h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all ${currentPage === page
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(Math.min(Math.ceil(totalOrders / itemsPerPage), currentPage + 1))}
              disabled={currentPage === Math.ceil(totalOrders / itemsPerPage)}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-gray-700 dark:text-gray-300"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
