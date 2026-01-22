import React, { useState, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Role, Product } from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  AlertCircle,
  Filter,
  X,
  Check,
  Upload,
  Image as ImageIcon,
  Layers
} from 'lucide-react';

export const ProductList: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, deleteProducts, updateProductsStock } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Bulk Actions State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkStockModalOpen, setIsBulkStockModalOpen] = useState(false);
  const [bulkStockValue, setBulkStockValue] = useState<number>(0);
  
  // Confirmation State
  const [confirmDelete, setConfirmDelete] = useState<{ type: 'single' | 'bulk', id?: string, count?: number } | null>(null);

  // Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>('All');

  // Authorization Check
  const canEdit = user?.role === Role.ADMIN || user?.role === Role.MANAGER;
  const canDelete = user?.role === Role.ADMIN || user?.role === Role.MANAGER; 

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    
    let matchesStatus = true;
    if (selectedStockStatus === 'Low Stock') {
        matchesStatus = p.stock <= p.minStockLevel && p.stock > 0;
    } else if (selectedStockStatus === 'Out of Stock') {
        matchesStatus = p.stock === 0;
    } else if (selectedStockStatus === 'In Stock') {
        matchesStatus = p.stock > p.minStockLevel;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Bulk Selection Logic
  const handleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length && filteredProducts.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleSelectOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDeleteRequest = () => {
    setConfirmDelete({ type: 'bulk', count: selectedIds.size });
  };

  const handleBulkStockUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProductsStock(Array.from(selectedIds), bulkStockValue);
    setIsBulkStockModalOpen(false);
    setSelectedIds(new Set());
    setBulkStockValue(0);
  };

  const executeDelete = () => {
      if (confirmDelete?.type === 'bulk') {
          deleteProducts(Array.from(selectedIds));
          setSelectedIds(new Set());
      } else if (confirmDelete?.type === 'single' && confirmDelete.id) {
          deleteProduct(confirmDelete.id);
      }
      setConfirmDelete(null);
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      ...currentProduct,
      lastUpdated: new Date().toISOString(),
      price: Number(currentProduct.price),
      stock: Number(currentProduct.stock),
      minStockLevel: Number(currentProduct.minStockLevel)
    } as Product;

    if (currentProduct.id) {
      updateProduct(productData);
    } else {
      addProduct({ ...productData, id: Date.now().toString() });
    }
    setIsModalOpen(false);
  };

  const handleEdit = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDelete({ type: 'single', id });
  };

  const handleAddNew = () => {
    setCurrentProduct({
        name: '',
        sku: '',
        category: '',
        price: 0,
        stock: 0,
        minStockLevel: 5,
        description: '',
        imageUrl: undefined
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentProduct({ ...currentProduct, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearFilters = () => {
      setSelectedCategory('All');
      setSelectedStockStatus('All');
      setIsFilterOpen(false);
  }

  const inputClasses = "w-full px-4 py-2.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm";

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Products</h2>
           <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Manage your inventory, track stock levels, and update prices.</p>
        </div>
        {canEdit && (
          <Button onClick={handleAddNew} className="shadow-lg shadow-primary-500/30">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 flex flex-col sm:flex-row gap-4 items-center relative">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name, SKU, or category..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm text-gray-900 dark:text-white placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative">
            <Button 
                variant={isFilterOpen ? 'primary' : 'secondary'} 
                className={`sm:w-auto w-full border-gray-200 dark:border-zinc-700 ${isFilterOpen ? '' : 'text-gray-600 dark:text-gray-300'} dark:bg-zinc-800`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
                <Filter className="w-4 h-4 mr-2" />
                Filter
                {(selectedCategory !== 'All' || selectedStockStatus !== 'All') && (
                    <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
            </Button>

            {/* Filter Dropdown */}
            {isFilterOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 p-4 z-20 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
                        <button onClick={clearFilters} className="text-xs text-primary-600 hover:underline">Clear all</button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Category</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-3 py-1 text-xs rounded-full border transition-all ${
                                            selectedCategory === cat 
                                            ? 'bg-primary-50 border-primary-500 text-primary-900 font-medium' 
                                            : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:border-gray-300'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Stock Status</label>
                             <div className="flex flex-col gap-2">
                                {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map(status => (
                                    <label key={status} className="flex items-center space-x-2 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedStockStatus === status ? 'bg-primary-500 border-primary-500' : 'border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 group-hover:border-primary-400'}`}>
                                            {selectedStockStatus === status && <Check size={10} className="text-white" />}
                                        </div>
                                        <input 
                                            type="radio" 
                                            name="stockStatus" 
                                            className="hidden"
                                            checked={selectedStockStatus === status} 
                                            onChange={() => setSelectedStockStatus(status)} 
                                        />
                                        <span className={`text-sm ${selectedStockStatus === status ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-600 dark:text-gray-400'}`}>{status}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                        <Button size="sm" className="w-full" onClick={() => setIsFilterOpen(false)}>Done</Button>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCategory !== 'All' || selectedStockStatus !== 'All') && (
          <div className="flex gap-2">
              {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-800 border border-primary-100">
                      Category: {selectedCategory}
                      <button onClick={() => setSelectedCategory('All')} className="ml-2 text-primary-600 hover:text-primary-900"><X size={12}/></button>
                  </span>
              )}
              {selectedStockStatus !== 'All' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-800 border border-primary-100">
                      Status: {selectedStockStatus}
                      <button onClick={() => setSelectedStockStatus('All')} className="ml-2 text-primary-600 hover:text-primary-900"><X size={12}/></button>
                  </span>
              )}
          </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
            <thead className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
              <tr>
                {canEdit && (
                    <th className="px-6 py-4 w-4">
                        <input 
                            type="checkbox" 
                            className="rounded border-gray-300 dark:border-zinc-600 text-primary-500 accent-[#eab308] focus:ring-primary-500"
                            checked={filteredProducts.length > 0 && selectedIds.size === filteredProducts.length}
                            onChange={handleSelectAll}
                        />
                    </th>
                )}
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Stock</th>
                {canEdit && <th className="px-6 py-4 text-right"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {filteredProducts.map((product) => {
                const isLowStock = product.stock <= product.minStockLevel;
                const isOutOfStock = product.stock === 0;
                const isSelected = selectedIds.has(product.id);

                return (
                  <tr 
                    key={product.id} 
                    onClick={() => navigate(`/products/${product.id}`)}
                    className={`cursor-pointer hover:bg-gray-50/80 dark:hover:bg-zinc-800/80 transition-colors ${isSelected ? 'bg-primary-50/30 dark:bg-primary-500/10' : ''}`}
                  >
                    {canEdit && (
                        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                            <input 
                                type="checkbox" 
                                className="rounded border-gray-300 dark:border-zinc-600 text-primary-500 accent-[#eab308] focus:ring-primary-500"
                                checked={isSelected}
                                onChange={(e) => handleSelectOne(product.id, e)}
                            />
                        </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3 bg-gray-100 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden">
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-xs font-bold text-gray-400">{product.name.charAt(0)}</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 dark:text-white text-sm">{product.name}</span>
                          <span className="text-xs text-gray-400 font-mono mt-0.5">SKU: {product.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700">
                            {product.category}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                      {isOutOfStock ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30">
                           <AlertCircle className="w-3 h-3 mr-1.5" />
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold ${isLowStock ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white'}`}>
                        {product.stock}
                      </span>
                    </td>
                    {canEdit && (
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={(e) => handleEdit(product, e)}
                            className="group p-2 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-colors border border-transparent hover:border-primary-100 dark:hover:border-primary-500/20"
                            title="Edit"
                          >
                            <Edit2 size={16} className="text-gray-400 group-hover:text-primary-600 transition-colors" />
                          </button>
                          {canDelete && (
                            <button 
                              onClick={(e) => handleDeleteRequest(product.id, e)}
                              className="group p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                              title="Delete"
                            >
                              <Trash2 size={16} className="text-gray-400 group-hover:text-red-500 transition-colors" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                    <td colSpan={canEdit ? 7 : 6} className="px-6 py-16 text-center text-gray-400 bg-gray-50/30 dark:bg-zinc-800/30">
                        <div className="flex flex-col items-center justify-center">
                            <Search className="w-8 h-8 text-gray-300 mb-2" />
                            <p className="font-medium">No products found.</p>
                            {(selectedCategory !== 'All' || selectedStockStatus !== 'All') && 
                                <p className="text-sm mt-1">Try adjusting your filters.</p>
                            }
                        </div>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Bulk Actions Bar */}
      {selectedIds.size > 0 && canEdit && (
          <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center animate-in slide-in-from-bottom-5 duration-300">
              <div className="bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-6 border border-zinc-200 dark:border-zinc-700/50 backdrop-blur-md">
                  <div className="flex items-center space-x-2 border-r border-zinc-200 dark:border-zinc-700 pr-6">
                      <span className="bg-primary-500 text-zinc-900 text-xs font-bold px-2 py-0.5 rounded-full">{selectedIds.size}</span>
                      <span className="text-sm font-medium">Selected</span>
                  </div>
                  <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => setIsBulkStockModalOpen(true)}
                        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors text-sm font-medium"
                      >
                          <Layers size={16} className="text-zinc-500 dark:text-zinc-300" />
                          <span>Update Stock</span>
                      </button>
                      {canDelete && (
                        <button 
                            onClick={handleBulkDeleteRequest}
                            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 text-red-500 dark:text-red-400 transition-colors text-sm font-medium"
                        >
                            <Trash2 size={16} />
                            <span>Delete</span>
                        </button>
                      )}
                  </div>
                  <button onClick={() => setSelectedIds(new Set())} className="ml-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white">
                      <X size={18} />
                  </button>
              </div>
          </div>
      )}

      {/* Custom Confirmation Modal */}
      <ConfirmModal 
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={executeDelete}
        title={confirmDelete?.type === 'bulk' ? `Delete ${confirmDelete.count} Products` : "Delete Product"}
        message={confirmDelete?.type === 'bulk' 
            ? `Are you sure you want to delete ${confirmDelete.count} selected products? This action cannot be undone.` 
            : "Are you sure you want to delete this product? This action cannot be undone."}
        confirmText="Delete"
        variant="danger"
      />

      {/* Product Edit/Create Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={currentProduct.id ? 'Edit Product' : 'Add New Product'}
      >
        <form onSubmit={handleSave} className="space-y-5">
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Product Image</label>
            <div className="flex items-center space-x-4">
                <div className="h-20 w-20 rounded-lg bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center overflow-hidden">
                    {currentProduct.imageUrl ? (
                        <img src={currentProduct.imageUrl} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                        <ImageIcon className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                    )}
                </div>
                <div>
                    <label className="cursor-pointer bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors flex items-center shadow-sm text-sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                    {currentProduct.imageUrl && (
                        <button 
                            type="button" 
                            onClick={() => setCurrentProduct({...currentProduct, imageUrl: undefined})} 
                            className="text-red-500 text-xs font-medium hover:underline mt-2 ml-1"
                        >
                            Remove Image
                        </button>
                    )}
                </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Product Name</label>
            <input 
              required
              type="text" 
              className={inputClasses}
              value={currentProduct.name || ''}
              onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">SKU</label>
              <input 
                required
                type="text" 
                className={inputClasses}
                value={currentProduct.sku || ''}
                onChange={e => setCurrentProduct({...currentProduct, sku: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
              <input 
                required
                type="text" 
                className={inputClasses}
                value={currentProduct.category || ''}
                onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
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
                value={currentProduct.price || ''}
                onChange={e => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Stock</label>
              <input 
                required
                type="number" 
                min="0"
                className={inputClasses}
                value={currentProduct.stock !== undefined ? currentProduct.stock : ''}
                onChange={e => setCurrentProduct({...currentProduct, stock: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Min Level</label>
              <input 
                required
                type="number" 
                min="0"
                className={inputClasses}
                value={currentProduct.minStockLevel !== undefined ? currentProduct.minStockLevel : ''}
                onChange={e => setCurrentProduct({...currentProduct, minStockLevel: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div>
             <div className="flex justify-between items-center mb-1.5">
                 <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Description</label>
             </div>
             <textarea 
                className={inputClasses}
                rows={3}
                value={currentProduct.description || ''}
                onChange={e => setCurrentProduct({...currentProduct, description: e.target.value})}
             />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 dark:border-zinc-800">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Product</Button>
          </div>
        </form>
      </Modal>

      {/* Bulk Stock Update Modal */}
      <Modal
        isOpen={isBulkStockModalOpen}
        onClose={() => setIsBulkStockModalOpen(false)}
        title="Bulk Update Stock"
      >
        <form onSubmit={handleBulkStockUpdate} className="space-y-5">
           <p className="text-sm text-gray-600 dark:text-gray-300">
              Set the new stock quantity for <strong>{selectedIds.size}</strong> selected products.
           </p>
           <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">New Stock Quantity</label>
              <input 
                required
                type="number" 
                min="0"
                className={inputClasses}
                value={bulkStockValue}
                onChange={e => setBulkStockValue(parseInt(e.target.value))}
                autoFocus
              />
           </div>
           <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
              <Button type="button" variant="secondary" onClick={() => setIsBulkStockModalOpen(false)}>Cancel</Button>
              <Button type="submit">Update All</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};