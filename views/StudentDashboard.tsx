import React, { useState, useEffect } from 'react';
import { COLLEGES } from '../constants';
import { Listing } from '../types';
import { StorageService } from '../services/storage';
import { ListingCard } from '../components/ListingCard';
import { Filter, Search } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<string>('');
  const [maxDistance, setMaxDistance] = useState<number>(5);
  const [maxRent, setMaxRent] = useState<number>(10000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      const data = await StorageService.getListings();
      setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, []);

  if (loading) {
    return <div className="text-center py-12 dark:text-gray-300">Loading listings...</div>;
  }

  const filteredListings = listings.filter(l => {
    if (selectedCollege && l.collegeId !== selectedCollege) return false;
    if (l.distance > maxDistance) return false;
    if (l.rent > maxRent) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Search Header */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-slate-700 transition-colors duration-200">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#1F2933] dark:text-gray-100">
          <Search className="text-[#F2A65A]" size={24} />
          Find Accommodation
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select College</label>
            <select 
              className="w-full p-2.5 bg-[#F8FAFC] dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#3F4C6B] dark:focus:ring-blue-400 focus:border-[#3F4C6B] outline-none dark:text-white transition-colors duration-200"
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
            >
              <option value="">All Colleges</option>
              {COLLEGES.map(c => (
                <option key={c.id} value={c.id}>{c.name} - {c.location}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="font-medium text-gray-700 dark:text-gray-300">Distance</label>
              <span className="text-[#3F4C6B] dark:text-blue-400 font-semibold">&lt; {maxDistance} km</span>
            </div>
            <input 
              type="range" 
              min="0.5" 
              max="10" 
              step="0.5"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#F2A65A]"
            />
            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
              <span>0.5km</span>
              <span>10km</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="font-medium text-gray-700 dark:text-gray-300">Max Rent</label>
              <span className="text-[#3F4C6B] dark:text-blue-400 font-semibold">₹{maxRent}</span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="20000" 
              step="500"
              value={maxRent}
              onChange={(e) => setMaxRent(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#F2A65A]"
            />
            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
              <span>₹1k</span>
              <span>₹20k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#1F2933] dark:text-white">
            {filteredListings.length} Result{filteredListings.length !== 1 ? 's' : ''} Found
          </h3>
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Filter size={16} />
            <span>Sorted by relevance</span>
          </div>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => (
              <ListingCard 
                key={listing.id} 
                listing={listing} 
                collegeName={COLLEGES.find(c => c.id === listing.collegeId)?.name}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-600 transition-colors duration-200">
            <p className="text-gray-500 dark:text-gray-400">No PGs found matching your criteria.</p>
            <button 
              onClick={() => {
                setSelectedCollege('');
                setMaxDistance(10);
                setMaxRent(20000);
              }}
              className="text-[#F2A65A] font-medium mt-2 hover:underline"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};