import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Package, Lock, Mail, ArrowRight, User as UserIcon, Check } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@nexus.com');
  const [password, setPassword] = useState('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeDemo, setActiveDemo] = useState<string>('admin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid credentials. Please try again.');
    }
    setIsLoading(false);
  };

  const handleDemoClick = (role: string, e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    setActiveDemo(role);
  };

  const inputClasses = "w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 transition-all shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 hover:border-emerald-500/50";

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0f172a]">
        {/* Background Gradients similar to Shopify style */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-950 to-black z-0"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl z-0"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl z-0"></div>

      <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
        
        {/* Brand Logo */}
        <div className="mb-8 flex flex-col items-center">
             <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 mb-4">
               <Package className="w-7 h-7 text-zinc-950" />
             </div>
             <h1 className="text-2xl font-bold text-white tracking-tight">Nexus Inventory</h1>
             <p className="text-zinc-400 mt-2 text-sm">Sign in to continue to your dashboard</p>
        </div>

        {/* Card */}
        <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-zinc-200/50">
           <div className="p-8">
               <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5 ml-1">Email</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                    type="email" 
                    required
                    className={inputClasses}
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                </div>

                <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1.5 ml-1">Password</label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                    type="password" 
                    required
                    className={inputClasses}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-3">
                         <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
                         <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                )}

                <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3.5 rounded-lg transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                >
                {isLoading ? (
                    <span>Signing in...</span>
                ) : (
                    <>
                    <span>Sign In</span>
                    <ArrowRight size={18} />
                    </>
                )}
                </button>
            </form>
           </div>
           
           <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
               <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">One-Click Demo Access</p>
               <div className="grid grid-cols-3 gap-3">
                   <button 
                     type="button"
                     onClick={() => handleDemoClick('admin', 'admin@nexus.com', 'admin')}
                     className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${activeDemo === 'admin' ? 'bg-white border-primary-500 shadow-sm ring-1 ring-primary-500' : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                   >
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 text-xs font-bold ${activeDemo === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}>A</div>
                       <span className="text-xs font-medium text-gray-700">Admin</span>
                   </button>
                   
                   <button 
                     type="button"
                     onClick={() => handleDemoClick('manager', 'manager@nexus.com', 'manager')}
                     className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${activeDemo === 'manager' ? 'bg-white border-primary-500 shadow-sm ring-1 ring-primary-500' : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                   >
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 text-xs font-bold ${activeDemo === 'manager' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>M</div>
                       <span className="text-xs font-medium text-gray-700">Manager</span>
                   </button>

                   <button 
                     type="button"
                     onClick={() => handleDemoClick('employee', 'employee@nexus.com', 'employee')}
                     className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${activeDemo === 'employee' ? 'bg-white border-primary-500 shadow-sm ring-1 ring-primary-500' : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                   >
                       <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 text-xs font-bold ${activeDemo === 'employee' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>E</div>
                       <span className="text-xs font-medium text-gray-700">Employee</span>
                   </button>
               </div>
           </div>
        </div>
        
        <div className="mt-8 flex items-center space-x-4 text-xs text-zinc-500">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-zinc-300 transition-colors">Help</a>
        </div>
      </div>
    </div>
  );
};