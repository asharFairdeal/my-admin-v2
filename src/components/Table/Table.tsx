// src/components/Table.tsx

import React from 'react';

interface TableColumn {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
}

interface TableProps {
  columns: TableColumn[];
  data: any[];
  onSort: (key: string) => void; // Add onSort function prop
  sortKey: string;
  sortOrder: 'asc' | 'desc';
}

const Table: React.FC<TableProps> = ({ columns, data, onSort, sortKey, sortOrder }) => {
  const handleSort = (key: string) => {
    onSort(key);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
      <table className="table w-full table-auto border border-gray-300 rounded-lg">
        <thead className="bg-blue-300">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleSort(column.key)}
                className={`py-3 px-4 border-b border-gray-400 text-left font-bold text-gray-900 uppercase tracking-wider shadow-md hover:bg-blue-400 transition duration-200 ease-in-out cursor-pointer ${
                  sortKey === column.key ? (sortOrder === 'asc' ? 'text-blue-600' : 'text-red-600') : ''
                }`}
              >
                {column.label} {sortKey === column.key && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`transition duration-200 ease-in-out ${
                rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'
              } hover:bg-blue-100`}
            >
              {columns.map((column) => (
                <td key={column.key} className="py-2 px-4 border-b border-gray-300 text-gray-800">
                  {column.render ? column.render(row) : row[column.key]}
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
