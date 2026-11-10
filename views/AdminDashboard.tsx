import React, { useEffect, useState } from 'react';
import { StorageService } from '../services/storage';
import { Building, Users, Home, TrendingUp, DollarSign, BarChart3, PieChart, CheckCircle2, ShieldAlert } from 'lucide-react';
import { User } from '../types';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [owners, setOwners] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const fetchData = async () => {
    const data = await StorageService.getAnalytics();
    setStats(data);
    const ownerList = await StorageService.getOwners();
    setOwners(ownerList);
    const usersList = await StorageService.getAllUsers();
    setAllUsers(usersList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveOwner = async (ownerId: string) => {
    try {
      await StorageService.approveOwner(ownerId);
      // Optimistic update
      setOwners(owners.map(o => o.id === ownerId ? { ...o, isApproved: true } : o));
    } catch(e) {
      console.error(e);
    }
  };

  if (!stats) return (
    <div className="flex items-center justify-center min-h-[400px] text-gray-500">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
        <div className="text-sm">Loading analytics...</div>
      </div>
    </div>
  );

  const renderUserTable = (users: User[], title: string, subtitle: string, badgeColor: string) => (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-[#1F2933]">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className={`${badgeColor} px-3 py-1.5 rounded-full text-sm font-bold`}>
          Total: {users.length}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200 uppercase tracking-wider">
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Credentials</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Contact</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">{user.name}</td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4">
                    {user.password ? (
                      <span className="font-mono text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                        {user.password}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Auth</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'owner' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{user.contact || '-'}</td>
                  <td className="p-4">
                    {user.role === 'owner' ? (
                      user.isApproved ? (
                        <span className="text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle2 size={14} /> Approved
                        </span>
                      ) : (
                        <span className="text-amber-600 font-medium flex items-center gap-1">
                          <ShieldAlert size={14} /> Pending
                        </span>
                      )
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const pendingOwners = owners.filter(o => !o.isApproved);
  const maxListings = Math.max(...stats.listingsPerCollege.map((c: any) => c.count), 1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1F2933]">Admin Dashboard</h2>
          <p className="text-gray-500">Platform overview and performance metrics</p>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div className="bg-white text-[#3F4C6B] px-4 py-2 rounded-full text-sm font-medium border border-gray-200 shadow-sm flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            System Status: Operational
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white text-[#1F2933] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                activeTab === 'users'
                  ? 'bg-white text-[#1F2933] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Users Directory
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {pendingOwners.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
             <ShieldAlert className="text-amber-500" />
             <h3 className="text-lg font-bold text-amber-900">Pending Owner Approvals</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingOwners.map(owner => (
               <div key={owner.id} className="bg-white p-4 rounded-xl border border-amber-100 flex flex-col gap-3 shadow-sm">
                  <div>
                    <h4 className="font-semibold text-gray-800">{owner.name}</h4>
                    <p className="text-xs text-gray-500 truncate">{owner.email}</p>
                  </div>
                  <button 
                     onClick={() => handleApproveOwner(owner.id)}
                     className="w-full flex justify-center items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-800 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                     <CheckCircle2 size={16} /> Approve Account
                  </button>
               </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-gray-200 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <Users size={22} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <h3 className="text-3xl font-extrabold text-[#1F2933]">{stats.totalUsers}</h3>
          <p className="text-sm text-gray-500 font-medium">Total Registered Users</p>
          <div className="mt-4 flex gap-2">
             <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                <span className="block text-lg font-bold text-gray-700">{stats.totalStudents}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Students</span>
             </div>
             <div className="flex-1 bg-gray-50 rounded-lg p-2 text-center">
                <span className="block text-lg font-bold text-gray-700">{owners.length > 0 ? owners.length : stats.totalOwners}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wide">Owners</span>
             </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-gray-200 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:scale-110 transition-transform">
              <Home size={22} />
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">+5%</span>
          </div>
          <h3 className="text-3xl font-extrabold text-[#1F2933]">{stats.totalListings}</h3>
          <p className="text-sm text-gray-500 font-medium">Active Properties</p>
          <div className="mt-4 pt-3 border-t border-gray-50 text-xs text-gray-400 flex items-center gap-1">
            <Building size={12} />
            Across {stats.listingsPerCollege.length} Colleges
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-gray-200 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <DollarSign size={22} />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-[#1F2933]">₹{stats.avgRent}</h3>
          <p className="text-sm text-gray-500 font-medium">Average Monthly Rent</p>
           <div className="mt-4 pt-3 border-t border-gray-50 text-xs text-gray-400">
            Based on current inventory
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-gray-200 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
              <TrendingUp size={22} />
            </div>
             <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">High</span>
          </div>
          <h3 className="text-3xl font-extrabold text-[#1F2933]">94%</h3>
          <p className="text-sm text-gray-500 font-medium">Search Success Rate</p>
          <div className="mt-4 pt-3 border-t border-gray-50 text-xs text-gray-400">
            High student engagement
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#1F2933] flex items-center gap-2">
                <BarChart3 size={20} className="text-[#3F4C6B]" />
                Listings by College
              </h3>
              <p className="text-sm text-gray-500">Distribution of properties across campuses</p>
            </div>
          </div>
          
          <div className="space-y-5">
            {stats.listingsPerCollege.map((item: any, idx: number) => {
              const percentage = (item.count / maxListings) * 100;
              return (
                <div key={idx} className="group">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-gray-700 group-hover:text-[#3F4C6B] transition-colors truncate max-w-[70%]">
                      {item.name}
                    </span>
                    <span className="text-sm font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                      {item.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-[#3F4C6B] to-[#5a6b94] relative group/bar cursor-pointer"
                      style={{ width: `${percentage}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="absolute right-0 -top-10 translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-all duration-200 z-20 pointer-events-none">
                        <div className="bg-[#1F2933] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl border border-gray-600 whitespace-nowrap">
                          {item.count} Listings
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1F2933]"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#1F2933] mb-4 flex items-center gap-2">
              <PieChart size={20} className="text-[#F2A65A]" />
              Quick Analytics
            </h3>
            
            <div className="space-y-6">
               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-600">Avg. Distance from College</span>
                   <span className="font-semibold text-[#1F2933]">1.2 km</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-1.5">
                   <div className="bg-[#F2A65A] h-1.5 rounded-full" style={{ width: '40%' }}></div>
                 </div>
               </div>

               <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-600">Amenities Availability</span>
                   <span className="font-semibold text-[#1F2933]">85%</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-1.5">
                   <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                 </div>
                 <p className="text-xs text-gray-400">Listings with 3+ facilities</p>
               </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
               <h4 className="text-sm font-semibold text-gray-900 mb-3">Top Facilities</h4>
               <div className="flex flex-wrap gap-2">
                 {['WiFi', 'Hot Water', 'Mess', 'CCTV'].map(tag => (
                   <span key={tag} className="px-3 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200">
                     {tag}
                   </span>
                 ))}
               </div>
            </div>
            </div>
          </div>
        </div>
       </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-8">
          {renderUserTable(allUsers.filter(u => u.role === 'student'), 'Students Directory', 'Manage all students on the platform.', 'bg-blue-50 text-blue-700')}
          {renderUserTable(allUsers.filter(u => u.role === 'owner'), 'Owners Directory', 'Manage all property owners on the platform.', 'bg-orange-50 text-orange-700')}
        </div>
      )}

    </div>
  );
};