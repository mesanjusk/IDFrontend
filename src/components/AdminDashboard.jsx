import React, { useState } from 'react';
import { Tabs, Tab } from '@/components/ui/tabs';
import CategoryManager from './CategoryManager';
import SubcategoryManager from './SubcategoryManager';
import TitleManager from './TitleManager';
import PriceManager from './PriceManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('categories');

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">🎛️ Admin Dashboard</h1>

      <div className="flex justify-center mb-6">
        <div className="bg-white shadow rounded-xl p-2 flex gap-2">
          <button
            className={`px-4 py-2 rounded-xl font-medium transition ${
              activeTab === 'categories'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </button>
          <button
            className={`px-4 py-2 rounded-xl font-medium transition ${
              activeTab === 'subcategories'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setActiveTab('subcategories')}
          >
            Subcategories
          </button>
          <button
            className={`px-4 py-2 rounded-xl font-medium transition ${
              activeTab === 'titles'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setActiveTab('titles')}
          >
            Titles
          </button>
          <button
            className={`px-4 py-2 rounded-xl font-medium transition ${
              activeTab === 'prices'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
            onClick={() => setActiveTab('prices')}
          >
            Prices
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        {activeTab === 'categories' && <CategoryManager />}
        {activeTab === 'subcategories' && <SubcategoryManager />}
        {activeTab === 'titles' && <TitleManager />}
        {activeTab === 'prices' && <PriceManager />}
      </div>
    </div>
  );
}
