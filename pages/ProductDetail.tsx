import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import { Button } from '../components/ui/Button';
import { 
  ArrowLeft, 
  Edit2, 
  Trash2, 
  Package, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Tag,
  BarChart,
  Calendar
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, deleteProduct, updateProduct } = useData();
  const { user } = useAuth();
  
  const product = products.find(p => p.id === id);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(product || {});

  // If product not found (e.g. deleted or invalid ID)
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The product you are looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate('/products')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inventory
        </Button>
      </div>
    );
  }

  const canEdit = user?.role === Role.ADMIN || user?.role === Role.MANAGER;
  
  const isLowStock = product.stock <= product.minStockLevel;
  const isOutOfStock = product.stock === 0;

  const handleDelete = () => {
      deleteProduct(product.id);
      navigate('/products');
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct({
        ...editForm,
        lastUpdated: new Date().toISOString(),
        price: Number(editForm.price),
        stock: Number(editForm.stock),
        minStockLevel: Number(editForm.minStockLevel)
    } as any);
    setIsEditModalOpen(false);
  };

  const inputClasses = "w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm";

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/products')} className="pl-0 hover:bg-transparent hover:text-gray-900 dark:hover:text-white text-gray-500 dark:text-gray-400">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Products
        </Button>
        
        {canEdit && (
          <div className="flex space-x-3">
             <Button variant="secondary" onClick={() => setIsEditModalOpen(true)}>
               <Edit2 className="w-4 h-4 mr-2" />
               Edit Product
             </Button>
             <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
               <Trash2 className="w-4 h-4 mr-2" />
               Delete
             </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image and Status */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden p-2">
            <div className="aspect-square w-full bg-gray-50 dark:bg-zinc-800 rounded-xl overflow-hidden relative group">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Package size={64} />
                </div>
              )}
              
              {/* Status Badge Overlay */}
              <div className="absolute top-4 left-4">
                 {isOutOfStock ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg">
                      Out of Stock
                    </span>
                  ) : isLowStock ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-lg">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Low Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-lg">
                      In Stock
                    </span>
                  )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800">
               <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Price</span>
               </div>
               <p className="text-2xl font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
            </div>
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800">
               <div className="flex items-center text-gray-500 dark:text-gray-400 mb-2">
                  <Package className="w-4 h-4 mr-1" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Stock</span>
               </div>
               <p className="text-2xl font-bold text-gray-900 dark:text-white">{product.stock} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">units</span></p>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-200 dark:border-zinc-800 p-8">
             <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded">
                        <Tag className="w-3 h-3 mr-1.5" />
                        {product.sku}
                    </span>
                    <span className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                        {product.category}
                    </span>
                  </div>
                </div>
             </div>

             <div className="prose prose-sm text-gray-600 dark:text-gray-300 max-w-none border-t border-gray-100 dark:border-zinc-800 pt-6">
               <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Description</h3>
               <p className="leading-relaxed">
                 {product.description || "No description provided for this product."}
               </p>
             </div>

             <div className="mt-8 pt-8 border-t border-gray-100 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Inventory Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg mr-3 text-blue-600 dark:text-blue-400 mt-1">
                            <BarChart className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Minimum Stock Level</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Alert triggers at <strong>{product.minStockLevel}</strong> units</p>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg mr-3 text-purple-600 dark:text-purple-400 mt-1">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Last Updated</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{new Date(product.lastUpdated).toLocaleDateString()} at {new Date(product.lastUpdated).toLocaleTimeString()}</p>
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      {/* Edit Modal (Reused Logic) */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Product">
        <form onSubmit={handleUpdate} className="space-y-5">
           <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Product Name</label>
            <input 
              required
              type="text" 
              className={inputClasses}
              value={editForm.name || ''}
              onChange={e => setEditForm({...editForm, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">SKU</label>
              <input 
                required
                type="text" 
                className={inputClasses}
                value={editForm.sku || ''}
                onChange={e => setEditForm({...editForm, sku: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
              <input 
                required
                type="text" 
                className={inputClasses}
                value={editForm.category || ''}
                onChange={e => setEditForm({...editForm, category: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Price ($)</label>
              <input 
                required
                type="number" 
                step="0.01"
                min="0"
                className={inputClasses}
                value={editForm.price || ''}
                onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Stock</label>
              <input 
                required
                type="number" 
                min="0"
                className={inputClasses}
                value={editForm.stock}
                onChange={e => setEditForm({...editForm, stock: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Min Level</label>
              <input 
                required
                type="number" 
                min="0"
                className={inputClasses}
                value={editForm.minStockLevel}
                onChange={e => setEditForm({...editForm, minStockLevel: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
            <textarea 
                className={inputClasses}
                rows={3}
                value={editForm.description || ''}
                onChange={e => setEditForm({...editForm, description: e.target.value})}
            />
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 dark:border-zinc-800">
            <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};