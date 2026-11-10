import React, { useState } from 'react';
import { UserRole } from '../types';
import { StorageService } from '../services/storage';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { UserCircle2, Building2, Lock, Mail, Home, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in email and password');
      return;
    }
    if (isSignUp && (!name.trim() || !contact.trim() || !address.trim())) {
      setError('Please fill in all fields for registration');
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (isSignUp && role !== 'admin') {
         const user = await StorageService.signUp(email, password, role, { name, contact, address });
         onLogin(user);
      } else {
         const user = await StorageService.login(email, password, role);
         onLogin(user);
      }
    } catch (err: any) {
      setError(err.message || (isSignUp ? 'Sign Up failed' : 'Login failed'));
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      const user = await StorageService.googleLogin(role);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Google Login failed');
      setIsSubmitting(false);
    }
  };

  const getRoleDescription = () => {
    switch(role) {
      case 'student': return 'Find your perfect home away from home';
      case 'owner': return 'Manage your properties and find tenants';
      case 'admin': return 'System administration access';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 animate-gradient-xy -z-10"></div>
      
      <style>{`
        @keyframes gradient-xy {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 15s ease infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center animate-float">
          <div className="bg-[#3F4C6B] p-4 rounded-2xl mb-4 shadow-xl shadow-blue-900/10 transform rotate-3">
            <Home className="text-[#F2A65A] w-10 h-10 -rotate-3" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-extrabold text-[#1F2933] tracking-tight mb-2">HostelConnect</h1>
          <p className="text-gray-500 font-medium">Islampur's Best Accommodation Finder</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 space-y-8">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-[#1F2933]">Welcome Back</h2>
            <p className="text-sm text-gray-500">{getRoleDescription()}</p>
          </div>

          {/* Role Toggle */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-gray-100/80 rounded-2xl">
            {(['student', 'owner', 'admin'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                type="button"
                className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  role === r 
                    ? 'bg-white text-[#3F4C6B] shadow-sm ring-1 ring-black/5 scale-[1.02]' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                {r === 'student' && <UserCircle2 size={18} />}
                {r === 'owner' && <Building2 size={18} />}
                {r === 'admin' && <ShieldCheck size={18} />}
                <span className="capitalize">{r}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {isSignUp && role !== 'admin' && (
                <div className="relative group">
                  <UserCircle2 className="absolute left-3.5 top-[38px] text-gray-400 group-focus-within:text-[#3F4C6B] transition-colors" size={18} />
                  <Input 
                    label="Full Name" 
                    placeholder="Enter your name" 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isSignUp}
                    className="pl-10 py-3 bg-gray-50/50 focus:bg-white transition-all border-gray-200 focus:ring-[#3F4C6B] focus:border-[#3F4C6B]"
                  />
                </div>
              )}

              <div className="relative group">
                <Mail className="absolute left-3.5 top-[38px] text-gray-400 group-focus-within:text-[#3F4C6B] transition-colors" size={18} />
                <Input 
                  label="Email Address" 
                  placeholder="name@example.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 py-3 bg-gray-50/50 focus:bg-white transition-all border-gray-200 focus:ring-[#3F4C6B] focus:border-[#3F4C6B]"
                />
              </div>

              {isSignUp && role !== 'admin' && (
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-[38px] text-gray-400 group-focus-within:text-[#3F4C6B] transition-colors opacity-0" size={18} />
                  <Input 
                    label="Mobile Number" 
                    placeholder="Enter your contact number" 
                    type="tel"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    required={isSignUp}
                    className="pl-3 py-3 bg-gray-50/50 focus:bg-white transition-all border-gray-200 focus:ring-[#3F4C6B] focus:border-[#3F4C6B]"
                  />
                </div>
              )}

              {isSignUp && role !== 'admin' && (
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Complete Address</label>
                  <textarea 
                    placeholder="Enter your full address" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required={isSignUp}
                    rows={2}
                    className="w-full px-3 py-3 bg-gray-50/50 focus:bg-white transition-all border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-[#3F4C6B] focus:border-[#3F4C6B] resize-none"
                  ></textarea>
                </div>
              )}

              <div className="relative group">
                <Lock className="absolute left-3.5 top-[38px] text-gray-400 group-focus-within:text-[#3F4C6B] transition-colors" size={18} />
                <Input 
                  label="Password" 
                  placeholder="Enter your password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 py-3 bg-gray-50/50 focus:bg-white transition-all border-gray-200 focus:ring-[#3F4C6B] focus:border-[#3F4C6B]"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100 animate-pulse">
                {error}
              </div>
            )}
            
            <Button 
              type="submit" 
              variant="cta" 
              className="w-full shadow-lg shadow-orange-200 hover:shadow-orange-300 transform active:scale-[0.98] transition-all py-3 text-lg" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (isSignUp ? 'Signing Up...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>
            
            {role !== 'admin' && (
               <div className="text-center text-sm font-semibold mt-2 text-gray-500">
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}
                  <button 
                     type="button"
                     onClick={() => setIsSignUp(!isSignUp)}
                     className="ml-1 text-[#3F4C6B] hover:text-[#F2A65A] underline underline-offset-2"
                  >
                     {isSignUp ? "Sign In" : "Sign Up"}
                  </button>
               </div>
            )}

            <div className="relative flex items-center py-2 text-sm text-gray-400">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 px-2">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold border border-gray-200 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 rounded-lg py-3 shadow-sm transition-all text-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </button>
          </form>

          <div className="text-center space-y-3 pt-6 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Demo Credentials</p>
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 flex flex-col gap-1.5 border border-gray-100">
               <div className="flex justify-between">
                 <span>Student/Owner:</span>
                 <span className="font-mono text-gray-700">Any Email</span>
               </div>
               <div className="flex justify-between">
                 <span>Admin:</span>
                 <span className="font-mono text-gray-700">admin@hostel.com / admin123</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};