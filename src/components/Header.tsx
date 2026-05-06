"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Package, ListOrdered, PlusCircle, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-white/10 bg-white/70 dark:bg-black/70 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 text-white p-2.5 rounded-xl shadow-lg group-hover:scale-105 transition-transform">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Order Allocation System
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
            <Package className="w-4 h-4" /> Products
          </Link>
          <Link href="/order-history" className="text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-2">
            <ListOrdered className="w-4 h-4" /> Orders
          </Link>
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-2 rounded-full"></div>
          <Link href="/products/create" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Add Product
          </Link>
          <Link href="/orders/create" className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-2 bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-full">
            <PlusCircle className="w-4 h-4" /> New Order
          </Link>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <nav className="md:hidden border-t border-gray-100 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl px-6 py-6 flex flex-col gap-2 shadow-2xl absolute w-full left-0">
          <Link href="/products" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl flex items-center gap-3 px-4 py-3 transition-colors">
            <Package className="w-5 h-5 text-indigo-500" /> Products
          </Link>
          <Link href="/order-history" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl flex items-center gap-3 px-4 py-3 transition-colors">
            <ListOrdered className="w-5 h-5 text-purple-500" /> Orders
          </Link>
          <Link href="/products/create" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl flex items-center gap-3 px-4 py-3 transition-colors">
            <PlusCircle className="w-5 h-5 text-indigo-500" /> Add Product
          </Link>
          <Link href="/orders/create" onClick={() => setIsMobileMenuOpen(false)} className="text-base font-semibold text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-xl flex items-center gap-3 px-4 py-3 transition-colors">
            <PlusCircle className="w-5 h-5" /> New Order
          </Link>
        </nav>
      )}
    </header>
  );
}
