import React from 'react';
import { useData } from '../contexts/DataContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  Package, 
  DollarSign 
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; subtext?: string }> = ({ title, value, icon, color, subtext }) => (
  <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-zinc-800 flex items-start space-x-4 transition-transform hover:-translate-y-1 duration-200 group">
    <div className={`p-3 rounded-xl ${color} text-white shadow-md group-hover:scale-110 transition-transform duration-200`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1 tracking-tight">{value}</h4>
      {subtext && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-medium">{subtext}</p>}
    </div>
  </div>
);

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-zinc-800 p-4 border border-gray-200 dark:border-zinc-700 shadow-xl rounded-lg">
        <p className="font-bold text-gray-900 dark:text-white mb-1">{data.fullName}</p>
        <div className="space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-300 flex justify-between">
                <span>Current Stock:</span>
                <span className="font-bold text-gray-900 dark:text-white ml-4">{data.stock}</span>
            </p>
            <p className="text-xs text-gray-400">Min. Required: {data.min}</p>
        </div>
        {data.stock <= data.min && (
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-zinc-700">
                <p className="text-xs text-red-500 font-semibold flex items-center">
                    <AlertTriangle size={12} className="mr-1" />
                    Low Stock Warning
                </p>
            </div>
        )}
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC = () => {
  const { getDashboardStats, products } = useData();
  const { darkMode } = useTheme();
  const stats = getDashboardStats();

  // Prepare data for chart - Top 10 products by stock (or reverse for priority)
  const chartData = [...products]
    .sort((a, b) => b.stock - a.stock)
    .slice(0, 10)
    .map(p => ({
      name: p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name,
      fullName: p.name,
      stock: p.stock,
      min: p.minStockLevel
    }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time insights into your inventory performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Products" 
          value={stats.totalProducts} 
          icon={<Package size={24} />} 
          color="bg-indigo-500"
        />
        <StatCard 
          title="Total Value" 
          value={`$${stats.totalValue.toLocaleString()}`} 
          icon={<DollarSign size={24} />} 
          color="bg-emerald-500"
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={stats.lowStockCount} 
          icon={<AlertTriangle size={24} />} 
          color="bg-amber-500"
          subtext="Items below minimum level"
        />
        <StatCard 
          title="Out of Stock" 
          value={stats.outOfStockCount} 
          icon={<TrendingUp size={24} />} 
          color="bg-red-500"
          subtext="Urgent restock needed"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold text-gray-800 dark:text-white">Stock Levels Overview</h3>
             <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-zinc-800 px-2 py-1 rounded">Top 10 Items</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#f1f5f9"} vertical={false} />
                <XAxis 
                    dataKey="name" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{fill: darkMode ? '#cbd5e1' : '#64748b'}}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={60}
                />
                <YAxis 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{fill: darkMode ? '#cbd5e1' : '#64748b'}} 
                />
                <Tooltip content={<CustomTooltip />} cursor={{fill: darkMode ? '#334155' : '#f8fafc'}} />
                <Bar 
                    dataKey="stock" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40}
                >
                   {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.stock <= entry.min ? '#ef4444' : '#eab308'} 
                        className="transition-all hover:opacity-80 cursor-pointer"
                      />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Low Stock List */}
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-amber-500 mr-2" />
            Needs Attention
          </h3>
          <div className="space-y-3 overflow-y-auto pr-1 flex-1 max-h-[300px] custom-scrollbar">
            {products.filter(p => p.stock <= p.minStockLevel).map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50/50 dark:bg-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg border border-gray-100 dark:border-zinc-700/50 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{product.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Min: {product.minStockLevel}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${product.stock === 0 ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400'}`}>
                    {product.stock} Units
                  </span>
                </div>
              </div>
            ))}
            {products.filter(p => p.stock <= p.minStockLevel).length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-center">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-3">
                        <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">All Good!</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Stock levels are healthy.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};