import React from 'react';
import { useData } from '../contexts/DataContext';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Download, TrendingUp, AlertOctagon } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Reports: React.FC = () => {
  const { products } = useData();

  // 1. Inventory Distribution by Category
  const categoryDataMap = products.reduce((acc, curr) => {
     acc[curr.category] = (acc[curr.category] || 0) + 1;
     return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.keys(categoryDataMap).map(key => ({
     name: key,
     value: categoryDataMap[key]
  }));

  // 2. Stock Value by Category
  const valueDataMap = products.reduce((acc, curr) => {
     acc[curr.category] = (acc[curr.category] || 0) + (curr.price * curr.stock);
     return acc;
  }, {} as Record<string, number>);

  const valueData = Object.keys(valueDataMap).map(key => ({
      name: key,
      value: valueDataMap[key]
  }));

  const COLORS = ['#eab308', '#f59e0b', '#d97706', '#b45309', '#78350f', '#fbbf24'];

  const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
          return (
              <div className="bg-white dark:bg-zinc-800 p-3 border border-gray-100 dark:border-zinc-700 shadow-lg rounded-lg">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{payload[0].name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {payload[0].value.toLocaleString()} 
                    {payload[0].dataKey === 'value' && payload[0].payload.name === 'value' ? '$' : ''}
                  </p>
              </div>
          )
      }
      return null;
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'SKU', 'Category', 'Price', 'Stock', 'Min Stock Level', 'Last Updated'];
    const rows = products.map(p => [
        p.id,
        `"${p.name.replace(/"/g, '""')}"`, // Escape quotes
        p.sku,
        p.category,
        p.price.toFixed(2),
        p.stock,
        p.minStockLevel,
        p.lastUpdated
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `inventory_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h2>
           <p className="text-gray-500 dark:text-gray-400 mt-1">Deep insights into your inventory performance.</p>
        </div>
        <Button variant="secondary" onClick={handleExportCSV}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Category Distribution */}
         <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Product Distribution by Category</h3>
             <div className="h-80">
                 <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                         <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                         >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                         </Pie>
                         <Tooltip content={<CustomTooltip />} />
                         <Legend verticalAlign="bottom" height={36}/>
                     </PieChart>
                 </ResponsiveContainer>
             </div>
         </div>

         {/* Inventory Value */}
         <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Total Inventory Value by Category ($)</h3>
             <div className="h-80">
                 <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={valueData} margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}} />
                         <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#64748b'}} tickFormatter={(val) => `$${val}`} />
                         <Tooltip cursor={{fill: '#f8fafc'}} />
                         <Bar dataKey="value" fill="#eab308" radius={[4, 4, 0, 0]} barSize={40} />
                     </BarChart>
                 </ResponsiveContainer>
             </div>
         </div>
      </div>
      
      {/* Low Stock Report Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-red-50/30 dark:bg-red-500/10">
              <div className="flex items-center">
                  <AlertOctagon className="w-5 h-5 text-red-500 mr-2" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Critical Stock Report</h3>
              </div>
              <span className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20 px-2 py-1 rounded-full">
                  {products.filter(p => p.stock <= p.minStockLevel).length} Items Attention Needed
              </span>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                  <thead className="bg-gray-50 dark:bg-zinc-800 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
                      <tr>
                          <th className="px-6 py-3">Product Name</th>
                          <th className="px-6 py-3">Category</th>
                          <th className="px-6 py-3 text-right">Current Stock</th>
                          <th className="px-6 py-3 text-right">Min Level</th>
                          <th className="px-6 py-3 text-right">Status</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                      {products.filter(p => p.stock <= p.minStockLevel).map(product => (
                          <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{product.name}</td>
                              <td className="px-6 py-4">{product.category}</td>
                              <td className="px-6 py-4 text-right font-bold text-red-600 dark:text-red-400">{product.stock}</td>
                              <td className="px-6 py-4 text-right">{product.minStockLevel}</td>
                              <td className="px-6 py-4 text-right">
                                  {product.stock === 0 ? (
                                      <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/20 px-2 py-1 rounded">Out of Stock</span>
                                  ) : (
                                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/20 px-2 py-1 rounded">Low Stock</span>
                                  )}
                              </td>
                          </tr>
                      ))}
                      {products.filter(p => p.stock <= p.minStockLevel).length === 0 && (
                          <tr>
                              <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                  <div className="flex flex-col items-center">
                                      <TrendingUp className="w-8 h-8 text-emerald-500 mb-2" />
                                      <p>All stock levels are healthy.</p>
                                  </div>
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};