'use client';

import { useEffect, useMemo, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import FilterComponent from './FilterComponent';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, X, Loader2 } from 'lucide-react';
import ButtonExportPdf from '@/components/ButtonExportPdf';
import { Input } from "@/components/ui/input";

// Overlay Loading Component
const LoadingOverlay = ({ message }: { message: string }) => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="flex flex-col items-center bg-white rounded-lg p-8 shadow-2xl">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-700 text-lg font-medium">{message}</p>
        </div>
    </div>
);

interface DataTableAppProps<T> {
    columns: TableColumn<T>[]
    data: T[]
    urlReport?: string
}

export function DataTableApp<T>({ columns, data, urlReport }: DataTableAppProps<T>): JSX.Element {
    const [records, setRecords] = useState<T[]>([])
    const [pending, setPending] = useState(true);
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    
    // State for column-specific filters
    const [columnFilters, setColumnFilters] = useState<{[key: string]: string}>({});
    
    // Loading states
    const [isExporting, setIsExporting] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("");

    useEffect(() => {
        setPending(true);
        const timer = setTimeout(() => {
            setRecords(data);
            setPending(false);
        }, 500); 
        return () => clearTimeout(timer);
    }, [data]);

    // Function to convert BigInt to string for JSON compatibility
    const stringifyBigInt = (obj: any) => 
        JSON.parse(JSON.stringify(obj, (key, value) => 
            typeof value === 'bigint' ? value.toString() : value
        ));

    // Improved filtering logic
    const filteredItems = useMemo(() => {
        if (!Array.isArray(records)) return [];

        const stringifiedRecords = stringifyBigInt(records);

        return stringifiedRecords.filter(item => {
            // Global text filter
            const matchesGlobalFilter = filterText 
                ? JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
                : true;

            // Column-specific filters
            const matchesColumnFilters = Object.entries(columnFilters).every(([key, filterValue]) => {
                if (!filterValue) return true; // Skip empty filters

                // Use the column's selector function if available
                const column = columns.find(col => 
                    col.selector && String(col.selector) === key
                );

                // Get the value using the column's selector or direct property access
                const getValue = (item: any) => {
                    if (column && column.selector) {
                        // If selector is a function, call it
                        if (typeof column.selector === 'function') {
                            return column.selector(item);
                        }
                        // If selector is a string, use it as a key
                        return item[column.selector];
                    }
                    // Fallback to direct property access
                    return item[key];
                };

                const itemValue = getValue(item);
                
                // Handle different types of values
                if (itemValue === null || itemValue === undefined) return false;

                return String(itemValue)
                    .toLowerCase()
                    .includes(filterValue.toLowerCase());
            });

            return matchesGlobalFilter && matchesColumnFilters;
        });
    }, [records, filterText, columnFilters, columns]);

    // Excel Export Function with Loading
    const handleExport = async () => {
        try {
            setIsExporting(true);
            setLoadingMessage("Processando exportação Excel...");

            // Simulate processing time (remove in production if not needed)
            await new Promise(resolve => setTimeout(resolve, 1000));

            const dataToExport = filteredItems;

            // Convert data to worksheet
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            
            // Create workbook and export
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
            
            // Generate file name with timestamp
            const fileName = `Exportacao_${new Date().toISOString().split('T')[0]}.xlsx`;
            
            // Export to Excel
            XLSX.writeFile(workbook, fileName);

        } catch (error) {
            console.error('Erro ao exportar Excel:', error);
            // Optionally show error message
        } finally {
            setIsExporting(false);
            setLoadingMessage("");
        }
    };

    // Handle column filter change
    const handleColumnFilterChange = (columnSelector: string, value: string) => {
        setColumnFilters(prev => ({
            ...prev,
            [columnSelector]: value
        }));
    };

    // Clear all column filters
    const clearColumnFilters = () => {
        setColumnFilters({});
    };

    // Function to handle PDF loading state
    const handlePdfLoadingChange = (isLoading: boolean) => {
        setIsExporting(isLoading);
        setLoadingMessage(isLoading ? "Gerando relatório PDF..." : "");
    };

    const subHeaderComponent = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText("");
            }
        };

        return (
            <div className="w-full space-y-2">
                <div className="flex justify-between items-center space-x-2">
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleExport}
                            disabled={isExporting}
                            className="flex items-center gap-2"
                        >
                            <FileSpreadsheet className="w-4 h-4" />
                            Exportar
                        </Button>
                        <ButtonExportPdf 
                            data={filteredItems} 
                            onLoadingChange={handlePdfLoadingChange}
                            urlReport={urlReport ?? ""}
                        />
                    </div>
                    <FilterComponent
                        onFilter={e => setFilterText(e.target.value)}
                        onClear={handleClear}
                        filterText={filterText}
                    />
                </div>
                
                {/* Column Filters */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 items-center">
                    {columns
                        .filter(col => col.name && col.selector) // Only columns with name and selector
                        .map((col) => {
                            // Convert selector to string key
                            const selectorKey = String(col.selector);
                            
                            return (
                                <div key={selectorKey} className="relative">
                                    <Input
                                        type="text"
                                        placeholder={`Filtrar por ${col.name}`}
                                        value={columnFilters[selectorKey] || ''}
                                        onChange={(e) => 
                                            handleColumnFilterChange(
                                                selectorKey, 
                                                e.target.value
                                            )
                                        }
                                        className="pr-8" // Space for clear button
                                        disabled={isExporting} // Disable during export
                                    />
                                    {columnFilters[selectorKey] && (
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6"
                                            onClick={() => 
                                                handleColumnFilterChange(
                                                    selectorKey, 
                                                    ''
                                                )
                                            }
                                            disabled={isExporting}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            );
                        })
                    }
                </div>
                <div className="flex justify-start">
                    {Object.keys(columnFilters).some(key => columnFilters[key]) && (
                        <Button 
                            variant="outline"                             
                            size="sm"
                            onClick={clearColumnFilters}
                            className="flex items-center gap-2"
                            disabled={isExporting}
                        >
                            <X className="h-4 w-4" />
                            Limpar Filtros
                        </Button>
                    )}                    
                </div>
            </div>
        );
    }, [
        filterText, 
        resetPaginationToggle, 
        columns, 
        columnFilters,
        isExporting,
        filteredItems, 
        handleExport,
        urlReport
    ]);

    return (
        <>
            {/* Loading Overlay */}
            {isExporting && <LoadingOverlay message={loadingMessage} />}
            
            <DataTable
                columns={columns}
                data={filteredItems}
                dense
                striped
                pagination
                subHeader
                subHeaderComponent={subHeaderComponent}
                noDataComponent="Nenhum registro encontrado"
                persistTableHead
                paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
                paginationPerPage={25}
                style={{ width: '100%', overflow: 'auto'}}
                paginationComponentOptions={{
                    rowsPerPageText: 'Registros por página',
                    rangeSeparatorText: 'de',
                    selectAllRowsItem: true,
                    selectAllRowsItemText: 'Todos',
                }}
                progressPending={pending}
                progressComponent={<span className="loading loading-ring loading-lg"></span>}
            />
        </>
    );
}