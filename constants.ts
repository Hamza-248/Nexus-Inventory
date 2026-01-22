import { Role, User, Product } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@nexus.com',
    role: Role.ADMIN,
    password: 'admin',
    avatarUrl: 'https://picsum.photos/id/1/200/200'
  },
  {
    id: '2',
    name: 'Store Manager',
    email: 'manager@nexus.com',
    role: Role.MANAGER,
    password: 'manager',
    avatarUrl: 'https://picsum.photos/id/2/200/200'
  },
  {
    id: '3',
    name: 'John Doe',
    email: 'employee@nexus.com',
    role: Role.EMPLOYEE,
    password: 'employee',
    avatarUrl: 'https://picsum.photos/id/3/200/200'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '101',
    name: 'Wireless Ergonomic Mouse',
    sku: 'TECH-001',
    category: 'Electronics',
    price: 49.99,
    stock: 120,
    minStockLevel: 20,
    description: 'A comfortable wireless mouse designed for productivity.',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&auto=format&fit=crop',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '102',
    name: 'Mechanical Keyboard RGB',
    sku: 'TECH-002',
    category: 'Electronics',
    price: 129.50,
    stock: 15, // Low stock
    minStockLevel: 25,
    description: 'High-performance mechanical keyboard with custom switches.',
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format&fit=crop',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '103',
    name: 'Noise Cancelling Headphones',
    sku: 'AUDIO-005',
    category: 'Audio',
    price: 299.00,
    stock: 5, // Very low stock
    minStockLevel: 10,
    description: 'Premium sound quality with active noise cancellation.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '104',
    name: 'Office Desk Chair',
    sku: 'FURN-101',
    category: 'Furniture',
    price: 199.99,
    stock: 50,
    minStockLevel: 5,
    description: 'Ergonomic mesh chair for long working hours.',
    imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&auto=format&fit=crop',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '105',
    name: 'USB-C Docking Station',
    sku: 'ACC-304',
    category: 'Accessories',
    price: 89.99,
    stock: 0, // Out of stock
    minStockLevel: 15,
    description: 'Connect multiple monitors and peripherals with one cable.',
    imageUrl: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=500&auto=format&fit=crop',
    lastUpdated: new Date().toISOString()
  }
];