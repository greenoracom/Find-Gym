import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { ChevronUp, ChevronDown } from 'lucide-react';

const Table = ({ 
  data = [], 
  columns = [], 
  loading = false, 
  onSort, 
  sortColumn, 
  sortDirection 
}) => {
  if (loading) {
    return <div className="py-12"><LoadingSpinner /></div>;
  }

  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={`px-4 py-3 text-sm font-semibold text-gray-900 ${col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                onClick={() => col.sortable && onSort && onSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.title}
                  {col.sortable && sortColumn === col.key && (
                    sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
              {columns.map((col, colIndex) => (
                <td key={colIndex} className="px-4 py-3 text-sm text-gray-700">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
