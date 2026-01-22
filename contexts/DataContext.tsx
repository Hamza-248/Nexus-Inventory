import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../constants';

interface DataContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  deleteProducts: (ids: string[]) => void;
  updateProductsStock: (ids: string[], newStock: number) => void;
  getDashboardStats: () => any;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Safe storage helper
const storage = {
  get: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = storage.get('nexus_products');
    return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    storage.set('nexus_products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const deleteProducts = (ids: string[]) => {
    setProducts(prev => prev.filter(p => !ids.includes(p.id)));
  };

  const updateProductsStock = (ids: string[], newStock: number) => {
    setProducts(prev => prev.map(p => 
      ids.includes(p.id) 
        ? { ...p, stock: newStock, lastUpdated: new Date().toISOString() } 
        : p
    ));
  };

  const getDashboardStats = () => {
    const totalProducts = products.length;
    const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= p.minStockLevel).length;
    const outOfStockCount = products.filter(p => p.stock === 0).length;

    return { totalProducts, totalValue, lowStockCount, outOfStockCount };
  };

  return (
    <DataContext.Provider value={{ 
      products, 
      addProduct, 
      updateProduct, 
      deleteProduct,
      deleteProducts,
      updateProductsStock,
      getDashboardStats
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
};