import React from 'react';
import { Listing } from '../types';
import { Button } from './Button';
import { MapPin, Phone, User, Building, Wifi, Droplets, Utensils, Zap, Video, Wind, Home, Pencil } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  collegeName?: string;
  isOwnerView?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (listing: Listing) => void;
}

const getFacilityIcon = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes('wifi')) return <Wifi size={14} />;
  if (normalized.includes('water')) return <Droplets size={14} />;
  if (normalized.includes('food') || normalized.includes('mess')) return <Utensils size={14} />;
  if (normalized.includes('power')) return <Zap size={14} />;
  if (normalized.includes('cctv')) return <Video size={14} />;
  if (normalized.includes('ac')) return <Wind size={14} />;
  return <Building size={14} />;
};

export const ListingCard: React.FC<ListingCardProps> = ({ 
  listing, 
  collegeName, 
  isOwnerView = false,
  onDelete,
  onEdit
}) => {
  return (
    <div className="bg-[#E5E9F0] dark:bg-slate-800 rounded-xl shadow-sm border border-white/50 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow dark:transition-colors duration-200">
      {listing.image ? (
        <div 
          className="h-40 w-full bg-cover bg-center relative"
          style={{ backgroundImage: `url(${listing.image})` }}
        >
          <div className="absolute top-2 right-2 bg-[#F2A65A]/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-white shadow-sm">
            {listing.distance} km from College
          </div>
        </div>
      ) : (
        <div className="h-40 w-full bg-gradient-to-br from-white to-[#cbd5e1] dark:from-slate-700 dark:to-slate-600 flex items-center justify-center relative">
          <div className="text-[#3F4C6B]/50 dark:text-slate-400/50">
            <Home size={64} strokeWidth={1} />
          </div>
          <div className="absolute top-2 right-2 bg-[#F2A65A] px-2 py-1 rounded text-xs font-semibold text-white shadow-sm">
            {listing.distance} km from College
          </div>
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-[#1F2933] dark:text-white leading-tight">{listing.title}</h3>
            {collegeName && <p className="text-xs text-[#3F4C6B] dark:text-blue-300 font-medium mt-1">{collegeName}</p>}
          </div>
          <span className="text-[#4FBDBA] dark:text-teal-400 text-lg font-bold">
            ₹{listing.rent}<span className="text-xs text-gray-500 dark:text-gray-400 font-normal">/mo</span>
          </span>
        </div>

        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300 text-sm mb-3">
          <MapPin size={16} className="mt-0.5 shrink-0 text-[#3F4C6B] dark:text-blue-400" />
          <div className="flex-1">
            <p className="line-clamp-2">{listing.address}</p>
            {!isOwnerView && (
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(listing.address)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                📍 View on Map ({listing.distance} km)
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {listing.facilities.map((fac, idx) => (
            <span key={idx} className="inline-flex items-center gap-1 bg-white dark:bg-slate-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded border border-gray-200 dark:border-slate-600">
              {getFacilityIcon(fac)}
              {fac}
            </span>
          ))}
        </div>

        <div className="pt-3 border-t border-gray-200/60 dark:border-slate-600/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-[#3F4C6B] dark:text-blue-300 border border-gray-200 dark:border-slate-600">
              <User size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Owner</p>
              <p className="text-sm font-medium text-[#1F2933] dark:text-gray-200">{listing.ownerName}</p>
            </div>
          </div>
          
          {isOwnerView ? (
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => onEdit?.(listing)}
                className="px-3"
              >
                <Pencil size={14} className="mr-1" /> Edit
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => onDelete?.(listing.id)}
              >
                Delete
              </Button>
            </div>
          ) : (
            <a 
              href={`tel:${listing.contact}`} 
              className="inline-flex items-center gap-2 bg-[#F2A65A] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#d99046] transition-colors shadow-sm"
            >
              <Phone size={16} />
              Call
            </a>
          )}
        </div>
      </div>
    </div>
  );
};