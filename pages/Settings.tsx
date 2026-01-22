import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Role } from '../types';
import { Button } from '../components/ui/Button';
import { 
  User, 
  Bell, 
  Shield, 
  Monitor, 
  Moon, 
  Globe,
  Save
} from 'lucide-react';

const SettingsSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden mb-6 transition-colors">
    <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center bg-gray-50/50 dark:bg-zinc-800/50">
      <div className="text-gray-500 dark:text-gray-400 mr-3">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
    </div>
    <div className="p-6 dark:text-gray-300">
      {children}
    </div>
  </div>
);

const Toggle: React.FC<{ label: string; checked: boolean; onChange: () => void; description?: string }> = ({ label, checked, onChange, description }) => (
  <div className="flex items-center justify-between py-3">
    <div>
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
      {description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
    </div>
    <button 
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${checked ? 'bg-primary-500' : 'bg-gray-200 dark:bg-zinc-700'}`}
    >
      <span 
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  </div>
);

export const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  
  const [isLoading, setIsLoading] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
      name: user?.name || '',
      email: user?.email || '',
  });

  useEffect(() => {
      if (user) {
          setProfileForm({ name: user.name, email: user.email });
      }
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    // Update profile if admin
    if (user && user.role === Role.ADMIN) {
        updateUser({
            ...user,
            name: profileForm.name,
            email: profileForm.email
        });
    }

    // Simulate save delay for other settings
    setTimeout(() => {
        setIsLoading(false);
        alert("Settings saved successfully!");
    }, 800);
  };

  const isAdmin = user?.role === Role.ADMIN;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences and system configurations.</p>
        </div>
        <Button onClick={handleSave} isLoading={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
        </Button>
      </div>

      <SettingsSection title="Profile Information" icon={<User size={20} />}>
         <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-xl font-bold text-gray-400 overflow-hidden border border-gray-200 dark:border-zinc-700">
                {user?.avatarUrl ? <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" /> : user?.name.charAt(0)}
            </div>
            <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            value={profileForm.name} 
                            onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                            disabled={!isAdmin}
                            className={`w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${!isAdmin ? 'bg-gray-50 dark:bg-zinc-800/50 cursor-not-allowed text-gray-500' : ''}`} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            value={profileForm.email} 
                            onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                            disabled={!isAdmin}
                            className={`w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${!isAdmin ? 'bg-gray-50 dark:bg-zinc-800/50 cursor-not-allowed text-gray-500' : ''}`} 
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                        <input type="text" value={user?.role} disabled className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg text-gray-500 dark:text-gray-400 text-sm cursor-not-allowed capitalize" />
                    </div>
                </div>
                {!isAdmin && <p className="text-xs text-gray-400 italic">To change profile details, please contact an administrator.</p>}
            </div>
         </div>
      </SettingsSection>

      <SettingsSection title="Notifications" icon={<Bell size={20} />}>
         <div className="divide-y divide-gray-100 dark:divide-zinc-800">
            <Toggle 
                label="Email Notifications" 
                description="Receive daily summaries and critical alerts via email."
                checked={emailNotifs} 
                onChange={() => setEmailNotifs(!emailNotifs)} 
            />
            <Toggle 
                label="Low Stock Alerts" 
                description="Get notified instantly when items drop below minimum stock levels."
                checked={lowStockAlerts} 
                onChange={() => setLowStockAlerts(!lowStockAlerts)} 
            />
            <Toggle 
                label="Browser Push Notifications" 
                description="Receive notifications on your desktop."
                checked={pushNotifs} 
                onChange={() => setPushNotifs(!pushNotifs)} 
            />
         </div>
      </SettingsSection>

      <SettingsSection title="Appearance" icon={<Monitor size={20} />}>
         <div className="divide-y divide-gray-100 dark:divide-zinc-800">
             <Toggle 
                label="Dark Mode" 
                description="Switch to a dark theme for low-light environments."
                checked={darkMode} 
                onChange={toggleDarkMode} 
            />
            <div className="py-3 flex items-center justify-between">
                 <div>
                     <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Language</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Select your preferred language.</p>
                 </div>
                 <select className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2">
                     <option>English (US)</option>
                     <option>Spanish</option>
                     <option>French</option>
                 </select>
            </div>
         </div>
      </SettingsSection>
    </div>
  );
};