import React, { useState, useEffect } from 'react';
import { COLLEGES } from '../constants';
import { Listing, FACILITIES_LIST, User } from '../types';
import { StorageService } from '../services/storage';
import { ListingCard } from '../components/ListingCard';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Plus, X, Home, GraduationCap, Route, Banknote, Phone, MapPin, LayoutGrid } from 'lucide-react';

interface OwnerDashboardProps {
  user: User;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ user }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Listing>>({
    facilities: []
  });

  useEffect(() => {
    // Refresh listings
    const fetchListings = async () => {
      const data = await StorageService.getListings();
      setListings(data);
    };
    fetchListings();
  }, [showForm]); 

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      await StorageService.deleteListing(id);
      setListings(await StorageService.getListings());
    }
  };

  const handleEdit = (listing: Listing) => {
    setFormData(listing);
    setEditingId(listing.id);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setFormData({ facilities: [] });
    setEditingId(null);
    setShowForm(true);
  };

  const handleFacilityToggle = (facility: string) => {
    setFormData(prev => {
      const current = prev.facilities || [];
      if (current.includes(facility)) {
        return { ...prev, facilities: current.filter(f => f !== facility) };
      } else {
        return { ...prev, facilities: [...current, facility] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.collegeId || !formData.rent) return;

    if (editingId) {
      // Update existing
      const updatedListing: Listing = {
        ...formData as Listing,
        id: editingId,
        ownerId: user.id, // Ensure owner doesn't change
        ownerName: user.name,
        createdAt: formData.createdAt || Date.now()
      };
      await StorageService.updateListing(updatedListing);
    } else {
      // Create new
      const newListing: Listing = {
        id: Date.now().toString(),
        ownerId: user.id,
        ownerName: user.name,
        title: formData.title!,
        collegeId: formData.collegeId!,
        distance: Number(formData.distance) || 0,
        rent: Number(formData.rent) || 0,
        facilities: formData.facilities || [],
        address: formData.address || '',
        contact: formData.contact || '',
        createdAt: Date.now()
      };
      await StorageService.addListing(newListing);
    }

    setShowForm(false);
    setFormData({ facilities: [] });
    setEditingId(null);
  };

  const inputClasses = "w-full pl-10 pr-3 py-3 bg-gray-50/50 focus:bg-white transition-all border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#3F4C6B] focus:border-[#3F4C6B]";
  const iconClasses = "absolute left-3.5 top-[38px] text-gray-400 group-focus-within:text-[#3F4C6B] transition-colors pointer-events-none";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2933]">My Properties</h2>
          <p className="text-gray-500">Manage your hostel and PG listings</p>
        </div>
        <Button onClick={handleAddNew} variant="cta" className="gap-2 shadow-lg shadow-orange-200 hover:shadow-orange-300" disabled={!user.isApproved}>
          <Plus size={20} />
          Add Property
        </Button>
      </div>

      {!user.isApproved && (
        <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">⏳</span>
          </div>
          <h3 className="text-lg font-bold text-amber-900 mb-2">Account Pending Verification</h3>
          <p className="text-sm text-amber-700 max-w-lg mx-auto">
            Your owner account is currently under review by our administration team. You will be able to manage and add properties once approved!
          </p>
        </div>
      )}

      {showForm && user.isApproved && (
        <div className="fixed inset-0 bg-[#3F4C6B]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
              <div>
                <h3 className="text-2xl font-bold text-[#1F2933]">
                  {editingId ? 'Edit Property' : 'List New Property'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">Fill in the details to reach students</p>
              </div>
              <button 
                onClick={() => setShowForm(false)} 
                className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Section 1: Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative group col-span-1 md:col-span-2">
                    <Home className={iconClasses} size={18} />
                    <Input 
                      label="Property Title" 
                      placeholder="e.g. Sunrise Boys Hostel" 
                      required 
                      value={formData.title || ''}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="pl-10 py-3 bg-gray-50/50 focus:bg-white transition-all border-gray-200 focus:ring-[#3F4C6B] focus:border-[#3F4C6B]"
                    />
                  </div>
                  
                  <div className="relative group">
                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Near College</label>
                    <GraduationCap className="absolute left-3.5 top-[38px] text-gray-400 group-focus-within:text-[#3F4C6B] pointer-events-none" size={18} />
                    <select 
                      className={inputClasses}
                      required
                      value={formData.collegeId || ''}
                      onChange={e => setFormData({...formData, collegeId: e.target.value})}
                    >
                      <option value="">Select College</option>
                      {COLLEGES.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="relative group">
                    <Route className={iconClasses} size={18} />
                    <Input 
                      label="Distance (km)" 
                      type="number" 
                      step="0.1" 
                      placeholder="0.5" 
                      required 
                      value={formData.distance || ''}
                      onChange={e => setFormData({...formData, distance: Number(e.target.value)})}
                      className="pl-10 py-3 bg-gray-50/50 focus:bg-white transition-all border-gray-200 focus:ring-[#3F4C6B] focus:border-[#3F4C6B]"
                    />
                  </div>

                  <div className="relative group">
                    <Banknote className={iconClasses} size={18} />
                    <Input 
                      label="Monthly Rent (₹)" 
                      type="number" 
                      placeholder="3500" 
                      required 
                      value={formData.rent || ''}
                      onChange={e => setFormData({...formData, rent: Number(e.target.value)})}
                      className="pl-10 py-3 bg-gray-50/50 focus:bg-white transition-all border-gray-200 focus:ring-[#3F4C6B] focus:border-[#3F4C6B]"
                    />
                  </div>

                  <div className="relative group">
                    <Phone className={iconClasses} size={18} />
                    <Input 
                      label="Contact Number" 
                      type="tel" 
                      placeholder="9876543210" 
                      required 
                      value={formData.contact || ''}
                      onChange={e => setFormData({...formData, contact: e.target.value})}
                      className="pl-10 py-3 bg-gray-50/50 focus:bg-white transition-all border-gray-200 focus:ring-[#3F4C6B] focus:border-[#3F4C6B]"
                    />
                  </div>
                </div>

                {/* Section 2: Address */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Full Address</label>
                  <MapPin className="absolute left-3.5 top-[38px] text-gray-400 group-focus-within:text-[#3F4C6B] pointer-events-none" size={18} />
                  <textarea 
                    className={`${inputClasses} min-h-[100px] resize-none`}
                    rows={3}
                    required
                    placeholder="Enter complete address..."
                    value={formData.address || ''}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                  ></textarea>
                </div>

                {/* Section 3: Facilities */}
                <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <LayoutGrid size={16} />
                    Available Facilities
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {FACILITIES_LIST.map(fac => (
                      <label key={fac} className={`
                        flex items-center gap-2 cursor-pointer p-3 rounded-lg border transition-all duration-200
                        ${(formData.facilities || []).includes(fac) 
                          ? 'bg-white border-[#F2A65A] shadow-sm ring-1 ring-[#F2A65A]/20' 
                          : 'bg-white border-gray-200 hover:border-gray-300'}
                      `}>
                        <input 
                          type="checkbox"
                          checked={(formData.facilities || []).includes(fac)}
                          onChange={() => handleFacilityToggle(fac)}
                          className="w-4 h-4 text-[#F2A65A] border-gray-300 rounded focus:ring-[#F2A65A]"
                        />
                        <span className="text-sm font-medium text-gray-700">{fac}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 flex gap-4 border-t border-gray-100">
                  <Button 
                    type="button" 
                    variant="secondary" 
                    className="flex-1 py-3" 
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    variant="cta" 
                    className="flex-1 py-3 shadow-lg shadow-orange-100"
                  >
                    {editingId ? 'Update Listing' : 'Publish Listing'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Listing Grid */}
      {listings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Home className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">No properties listed yet</h3>
          <p className="text-gray-500 mt-1 mb-6">Start by adding your first hostel or PG accommodation</p>
          <Button onClick={handleAddNew} variant="outline">
            Create First Listing
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <ListingCard 
              key={listing.id} 
              listing={listing} 
              collegeName={COLLEGES.find(c => c.id === listing.collegeId)?.name}
              isOwnerView={true}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};