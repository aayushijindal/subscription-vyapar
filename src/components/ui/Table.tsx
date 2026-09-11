import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from './Button';

interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T;
}

export function Table<T>({ data, columns, searchPlaceholder = 'Search...', searchKey }: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: keyof T | string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const filteredData = React.useMemo(() => {
    let result = [...data];

    // Search filter
    if (searchQuery && searchKey) {
      result = result.filter((item) => {
        const value = item[searchKey];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      });
    }

    // Sort logic
    if (sortKey) {
      result.sort((a, b) => {
        const valA = (a as any)[sortKey];
        const valB = (b as any)[sortKey];
        
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, searchKey, sortKey, sortDirection]);

  return (
    <div className="space-y-4">
      {/* Table Actions Header */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        {searchKey && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface transition-all"
            />
          </div>
        )}
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
          <Button variant="outline" onClick={() => alert('Exporting data as CSV...')}>Export</Button>
        </div>
      </div>

      {/* Responsive Table Panel */}
      <div className="overflow-x-auto border border-border/50 rounded-xl bg-surface shadow-sm">
        <table className="w-full border-collapse text-left text-sm text-text-secondary">
          <thead className="bg-input text-text-primary border-b border-border/50">
            <tr>
              {columns.map((column, idx) => (
                <th 
                  key={idx} 
                  className={`p-4 font-semibold ${column.sortable ? 'cursor-pointer select-none hover:bg-background/80' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1.5">
                    {column.header}
                    {column.sortable && sortKey === column.key && (
                      sortDirection === 'asc' ? <ChevronUp className="h-4 w-4 text-text-secondary" /> : <ChevronDown className="h-4 w-4 text-text-secondary" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredData.length > 0 ? (
              filteredData.map((item, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-input/50 transition-colors">
                  {columns.map((column, colIdx) => (
                    <td key={colIdx} className="p-4 align-middle">
                      {column.render ? column.render(item) : (item as any)[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-text-muted">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
