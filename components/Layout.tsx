import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  LogOut, 
  Menu,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle,
  BarChart3
} from 'lucide-react';

const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean; collapsed: boolean }> = ({ to, icon, label, active, collapsed }) => (
  <Link
    to={to}
    className={`flex items-center ${collapsed ? 'justify-center h-10 w-10 mx-auto' : 'space-x-3 px-3 py-2'} rounded-md transition-all mb-1 group relative ${
      active 
        ? 'bg-primary-500 text-zinc-950 font-semibold shadow-md shadow-primary-500/20' 
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
    }`}
  >
    <div className="shrink-0">
      {icon}
    </div>
    {!collapsed && <span className="text-sm tracking-normal">{label}</span>}
    
    {/* Tooltip for collapsed state */}
    {collapsed && (
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-zinc-800 border border-zinc-700 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
        {label}
      </div>
    )}
  </Link>
);

const SectionLabel: React.FC<{ label: string; collapsed: boolean }> = ({ label, collapsed }) => {
    if (collapsed) return <div className="h-4 border-b border-zinc-800/50 mx-2 my-2"></div>;
    return (
        <p className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-6 mb-2">{label}</p>
    )
}

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return <>{children}</>;

  const isAdmin = user.role === Role.ADMIN;
  // Employee can see products but maybe limited actions in the page itself
  const canSeeProducts = true; 

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden transition-colors">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 bg-zinc-950 text-white transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col border-r border-zinc-800 shadow-2xl
        ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
        ${isSidebarCollapsed ? 'lg:w-[72px]' : 'lg:w-64'}
      `}>
        {/* Sidebar Header */}
        <div className={`flex items-center h-16 border-b border-zinc-800 transition-all duration-300 ${isSidebarCollapsed ? 'justify-center' : 'px-4'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20 shrink-0">
              <Package className="w-5 h-5 text-zinc-950" />
            </div>
            {!isSidebarCollapsed && (
                <div className="flex flex-col">
                    <span className="text-base font-bold tracking-tight text-white whitespace-nowrap leading-none">Nexus</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Inventory</span>
                </div>
            )}
          </div>
        </div>

        {/* Sidebar Nav */}
        <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar overflow-x-hidden">
             
             <nav className="flex flex-col gap-0.5">
                <SidebarItem 
                  to="/" 
                  icon={<LayoutDashboard size={18} />} 
                  label="Overview" 
                  active={location.pathname === '/'}
                  collapsed={isSidebarCollapsed}
                />
             </nav>

             <SectionLabel label="Operations" collapsed={isSidebarCollapsed} />
             <nav className="flex flex-col gap-0.5">
                {canSeeProducts && (
                  <SidebarItem 
                    to="/products" 
                    icon={<Package size={18} />} 
                    label="Inventory" 
                    active={location.pathname === '/products' || location.pathname.startsWith('/products/')}
                    collapsed={isSidebarCollapsed}
                  />
                )}
                <SidebarItem 
                  to="/reports" 
                  icon={<BarChart3 size={18} />} 
                  label="Reports" 
                  active={location.pathname === '/reports'}
                  collapsed={isSidebarCollapsed}
                />
             </nav>

            <SectionLabel label="System" collapsed={isSidebarCollapsed} />
            <nav className="flex flex-col gap-0.5">
                {isAdmin && (
                  <SidebarItem 
                      to="/users" 
                      icon={<Users size={18} />} 
                      label="Users" 
                      active={location.pathname === '/users'}
                      collapsed={isSidebarCollapsed}
                  />
                )}
                <SidebarItem 
                    to="/settings" 
                    icon={<Settings size={18} />} 
                    label="Settings" 
                    active={location.pathname === '/settings'}
                    collapsed={isSidebarCollapsed}
                />
            </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/50">
           {/* Collapse Toggle (Desktop Only) */}
           <div className="hidden lg:flex justify-end mb-3">
                <button 
                    onClick={toggleSidebar}
                    className="p-1.5 rounded-md bg-zinc-900 text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors w-full flex justify-center"
                    title={isSidebarCollapsed ? "Expand" : "Collapse"}
                >
                    {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
           </div>
          
          {/* User Profile */}
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center flex-col gap-2' : 'gap-3'} rounded-xl bg-zinc-900/50 p-2 border border-zinc-800/50`}>
             <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-white overflow-hidden shrink-0">
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    user.name.charAt(0)
                )}
             </div>
             {!isSidebarCollapsed && (
               <div className="flex-1 min-w-0 overflow-hidden">
                 <p className="text-xs font-semibold truncate text-white">{user.name}</p>
                 <p className="text-[10px] text-zinc-500 truncate capitalize">{user.role.toLowerCase()}</p>
               </div>
             )}
             
             {!isSidebarCollapsed ? (
                <button 
                    onClick={handleLogout}
                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                    title="Sign out"
                >
                    <LogOut size={16} />
                </button>
             ) : (
                 <button 
                    onClick={handleLogout}
                    className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                    title="Sign out"
                 >
                    <LogOut size={14} />
                 </button>
             )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50/50 dark:bg-zinc-950/50 transition-all duration-300">
        {/* Header */}
        <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
          <div className="flex items-center">
              <button 
                className="lg:hidden p-2 rounded-md text-zinc-600 hover:bg-zinc-100 mr-3"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
              
              <div className="flex flex-col">
                  <h1 className="text-lg font-bold text-zinc-800 dark:text-white capitalize leading-tight">
                    {location.pathname === '/' ? 'Dashboard' : 
                    location.pathname === '/products' ? 'Product Inventory' : 
                    location.pathname.startsWith('/products/') ? 'Product Details' :
                    location.pathname === '/users' ? 'User Management' :
                    location.pathname === '/settings' ? 'Settings' :
                    location.pathname === '/reports' ? 'Reports' :
                    location.pathname.split('/')[1]}
                  </h1>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">Welcome back, {user.name.split(' ')[0]}</span>
              </div>
          </div>

          <div className="flex items-center gap-4">
             <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
                <HelpCircle size={20} />
             </button>
             <div className="hidden md:flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Operational</span>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
           <div className="max-w-7xl mx-auto">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
};