import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Role, User } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { UserPlus, Trash2, Mail, Shield } from 'lucide-react';

export const UserList: React.FC = () => {
  const { users, addUser, deleteUser, user: currentUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Confirm Modal State
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const [newUser, setNewUser] = useState<Partial<User>>({
    role: Role.EMPLOYEE
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) return;
    
    addUser({
      ...newUser,
      id: Date.now().toString(),
      avatarUrl: `https://picsum.photos/seed/${newUser.email}/200/200`
    } as User);
    
    setIsModalOpen(false);
    setNewUser({ role: Role.EMPLOYEE });
  };

  const confirmDelete = () => {
      if (deleteUserId) {
          deleteUser(deleteUserId);
          setDeleteUserId(null);
      }
  };

  const handleDeleteRequest = (id: string) => {
    if (id === currentUser?.id) {
        alert("You cannot delete yourself.");
        return;
    }
    setDeleteUserId(id);
  };

  const inputClasses = "w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h2>
           <p className="text-gray-500 dark:text-gray-400 mt-1">Manage system access and roles.</p>
         </div>
         <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-primary-500/30">
           <UserPlus className="w-4 h-4 mr-2" />
           Add User
         </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((u) => (
          <div key={u.id} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 flex flex-col items-center text-center transition-all hover:shadow-md hover:border-primary-200 dark:hover:border-primary-500/30 group">
            <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-zinc-800 mb-4 overflow-hidden border-2 border-white dark:border-zinc-700 shadow-sm group-hover:border-primary-500 transition-colors">
                {u.avatarUrl ? <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" /> : null}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{u.name}</h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">
               <Mail className="w-3 h-3 mr-1" />
               {u.email}
            </div>
            
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border
                ${u.role === Role.ADMIN ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                  u.role === Role.MANAGER ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                  'bg-gray-50 text-gray-700 border-gray-100'}`}>
                {u.role}
            </span>

            {u.id !== currentUser?.id && (
                <button 
                    onClick={() => handleDeleteRequest(u.id)}
                    className="w-full mt-auto py-2.5 flex items-center justify-center text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 dark:text-red-400 rounded-lg transition-colors border border-transparent"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove User
                </button>
            )}
            {u.id === currentUser?.id && (
                 <div className="text-xs font-medium text-emerald-600 mt-auto pt-2 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                    Current Session
                 </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation Modal for Delete */}
      <ConfirmModal 
        isOpen={!!deleteUserId}
        onClose={() => setDeleteUserId(null)}
        onConfirm={confirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Remove User"
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New User">
        <form onSubmit={handleCreate} className="space-y-5">
           <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
            <input 
              required
              type="text" 
              className={inputClasses}
              value={newUser.name || ''}
              onChange={e => setNewUser({...newUser, name: e.target.value})}
            />
          </div>
           <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
            <input 
              required
              type="email" 
              className={inputClasses}
              value={newUser.email || ''}
              onChange={e => setNewUser({...newUser, email: e.target.value})}
            />
          </div>
           <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
            <input 
              required
              type="password" 
              className={inputClasses}
              value={newUser.password || ''}
              onChange={e => setNewUser({...newUser, password: e.target.value})}
            />
          </div>
           <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
            <div className="grid grid-cols-3 gap-3">
                {Object.values(Role).map((role) => (
                    <button
                        key={role}
                        type="button"
                        onClick={() => setNewUser({...newUser, role})}
                        className={`px-3 py-2.5 text-sm font-bold uppercase rounded-lg border transition-all ${
                            newUser.role === role 
                            ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-900 dark:text-primary-400 ring-1 ring-primary-500' 
                            : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-slate-300'
                        }`}
                    >
                        {role}
                    </button>
                ))}
            </div>
          </div>
          <div className="pt-6 flex justify-end space-x-3 border-t border-gray-100 dark:border-zinc-800">
              <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">Create User</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};