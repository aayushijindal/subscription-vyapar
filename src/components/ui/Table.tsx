import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, Download, FileText, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Button } from './Button';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  exportable?: boolean; // Default is true. Set false to exclude from export.
  render?: (item: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchKey?: keyof T | string;
  exportFilename?: string; // e.g. "Purchase"
  rowKey?: (item: T, index: number) => string; // To uniquely identify rows for selection
  isLoading?: boolean;
}

export function Table<T>({ data, columns, searchPlaceholder = 'Search...', searchKey, exportFilename = 'Data', rowKey = (item: any, idx: number) => item?.id ? String(item.id) : String(idx), isLoading = false }: TableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [showExportMenu, setShowExportMenu] = useState(false);

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
        const value = (item as any)[searchKey];
        if (typeof value === 'string' || typeof value === 'number') {
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
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

  // Selection Logic
  const rowKeys = filteredData.map((item, idx) => rowKey(item, idx));
  const isAllSelected = filteredData.length > 0 && rowKeys.every(id => selectedRowIds.has(id));
  const isSomeSelected = rowKeys.some(id => selectedRowIds.has(id));
  const isIndeterminate = isSomeSelected && !isAllSelected;

  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const toggleSelectAll = () => {
    const newMap = new Set(selectedRowIds);
    if (isAllSelected) {
      // deselect all on current page
      rowKeys.forEach(id => newMap.delete(id));
    } else {
      // select all on current page
      rowKeys.forEach(id => newMap.add(id));
    }
    setSelectedRowIds(newMap);
  };

  const toggleRow = (id: string) => {
    const newMap = new Set(selectedRowIds);
    if (newMap.has(id)) {
      newMap.delete(id);
    } else {
      newMap.add(id);
    }
    setSelectedRowIds(newMap);
  };

  // Export Logic
  const getExportData = () => {
    // If specific rows selected, export those. Otherwise export all filtered rows.
    const hasSelection = selectedRowIds.size > 0;
    const itemsToExport = hasSelection 
      ? filteredData.filter((item, idx) => selectedRowIds.has(rowKey(item, idx)))
      : filteredData;
    
    // Do not export columns explicitly market as exportable={false}
    const exportColumns = columns.filter(c => c.exportable !== false && typeof c.header === 'string');
    
    const formatValue = (val: any) => {
      if (val === null || val === undefined) return '';
      if (typeof val === 'object') return JSON.stringify(val);
      return String(val);
    };

    const header = exportColumns.map(c => c.header);
    const body = itemsToExport.map(item => {
      return exportColumns.map(c => {
         return formatValue((item as any)[c.key]);
      });
    });

    return { header, body };
  };

  const handleExportExcel = () => {
    const { header, body } = getExportData();
    const ws = XLSX.utils.aoa_to_sheet([header, ...body]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${exportFilename}.xlsx`);
    setShowExportMenu(false);
  };

  const handleExportPDF = () => {
    try {
      const { header, body } = getExportData();
      const doc = new jsPDF();
      doc.text(exportFilename, 14, 15);
      autoTable(doc, {
        head: [header],
        body: body,
        startY: 20,
      });
      doc.save(`${exportFilename}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setShowExportMenu(false);
    }
  };

  // Close export menu when clicking outside (simple handling via blur or just toggle, here we rely on toggle)
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
          <div className="relative">
            <Button variant="outline" onClick={() => setShowExportMenu(!showExportMenu)} className="gap-2">
              <Download className="h-4 w-4" /> Export
            </Button>
            {showExportMenu && (
              <>
                <div 
                  className="fixed inset-0 z-0" 
                  onClick={() => setShowExportMenu(false)} 
                />
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg z-10 overflow-hidden">
                  <button onClick={handleExportExcel} className="w-full text-left px-4 py-2.5 text-sm hover:bg-input flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-600" /> Excel (.xlsx)
                  </button>
                  <button onClick={handleExportPDF} className="w-full text-left px-4 py-2.5 text-sm hover:bg-input flex items-center gap-2">
                    <FileText className="h-4 w-4 text-red-500" /> PDF (.pdf)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {selectedRowIds.size > 0 && (
        <div className="text-sm text-primary font-medium px-1">
          {selectedRowIds.size} row(s) selected
        </div>
      )}

      {/* Responsive Table Panel */}
      <div className="overflow-x-auto border border-border/50 rounded-xl bg-surface shadow-sm">
        <table className="w-full border-collapse text-left text-sm text-text-secondary">
          <thead className="bg-input text-text-primary border-b border-border/50">
            <tr>
              <th className="p-4 w-12 border-r border-border/50">
                <input 
                  type="checkbox" 
                  ref={headerCheckboxRef}
                  checked={isAllSelected} 
                  onChange={toggleSelectAll}
                  className="rounded border-border text-primary focus:ring-primary/20 cursor-pointer w-4 h-4"
                />
              </th>
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
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <span className="text-text-muted font-medium text-sm">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, rowIdx) => {
                const id = rowKey(item, rowIdx);
                const isSelected = selectedRowIds.has(id);
                return (
                  <tr key={id} className={`hover:bg-input/50 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}>
                    <td className="p-4 align-middle border-r border-border/50">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleRow(id)}
                        className="rounded border-border text-primary focus:ring-primary/20 cursor-pointer w-4 h-4"
                      />
                    </td>
                    {columns.map((column, colIdx) => (
                      <td key={colIdx} className="p-4 align-middle">
                        {column.render ? column.render(item) : (item as any)[column.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="p-8 text-center text-text-muted">
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
