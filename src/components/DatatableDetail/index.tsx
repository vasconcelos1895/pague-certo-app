
'use client';

import { useEffect, useMemo, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import FilterComponent from './FilterComponent';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, X, Loader2, List, ChevronDown, ChevronRight, FolderDown, FolderUp } from 'lucide-react';
import ButtonExportPdf from '@/components/ButtonExportPdf';
import { Input } from "@/components/ui/input";
import type { EventoNomeacao, Nomeacao } from '@prisma/client';
import {
    Award, CheckCircle2, Clock, Edit, ListCheck, PlusCircle, RefreshCcw, Share2, Target, XCircle, LockIcon, Repeat,
    Gavel, MinusCircle, AlignVerticalJustifyStart, AlignVerticalJustifyEnd
} from "lucide-react";
import Link from 'next/link';
import ButtonDelete from '../buttonDelete';
import ButtonDeleteEvento from './buttonDeleteEvento';
import { ButtonModal } from './buttonModal';
import { useSession } from 'next-auth/react';

// Mapping of Vaga options to colors and icons
const VagaConfig = {
    "ASSESSOR": {
        color: "bg-cyan-100 text-cyan-800",
        icon: AlignVerticalJustifyEnd
    },
    "CHEFIA": {
        color: "bg-indigo-100 text-indigo-800",
        icon: AlignVerticalJustifyStart
    },
}

// Mapping of Vínculo options to colors and icons
const VinculoConfig = {
    "Aguardando": {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock
    },
    "Aguardando Criação": {
        color: "bg-orange-100 text-orange-800",
        icon: PlusCircle
    },
    "Cedência": {
        color: "bg-blue-100 text-blue-800",
        icon: Share2
    },
    "Contratado": {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle2
    },
    "Designado": {
        color: "bg-purple-100 text-purple-800",
        icon: Target
    },
    "Exonerar": {
        color: "bg-red-100 text-red-800",
        icon: XCircle
    },
    "Exonerar/Nomear": {
        color: "bg-rose-200 text-rose-900",
        icon: RefreshCcw
    },
    "Exonerar/Transformar": {
        color: "bg-red-200 text-red-900",
        icon: RefreshCcw
    },
    "Nomeado": {
        color: "bg-indigo-100 text-indigo-800",
        icon: Award
    },
    "Reservado": {
        color: "bg-gray-100 text-gray-800",
        icon: LockIcon
    },
    "Transformar": {
        color: "bg-teal-100 text-teal-800",
        icon: Repeat
    },
    "TSE": {
        color: "bg-pink-100 text-pink-800",
        icon: Gavel
    },
    "Vago": {
        color: "bg-teal-200 text-teal-900",
        icon: MinusCircle
    }
};

// Overlay Loading Component
const LoadingOverlay = ({ message }: { message: string }) => (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="flex flex-col items-center bg-white rounded-lg p-8 shadow-2xl">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-700 text-lg font-medium">{message}</p>
        </div>
    </div>
);

// Interface for component props
interface DataTableAppProps {
    data: (Nomeacao & { eventos: EventoNomeacao[] })[];
}

// Extended Nomeacao type with eventos
type NomeacaoWithEventos = Nomeacao & {
    eventos: EventoNomeacao[];
};

export function DataTableDetail({ data }: DataTableAppProps): JSX.Element {
    const [records, setRecords] = useState<NomeacaoWithEventos[]>([]);
    const [pending, setPending] = useState(true);
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>({});
    const { data: session } = useSession();

    // State for column-specific filters
    const [columnFilters, setColumnFilters] = useState<{ [key: string]: string }>({});

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

    // Função para alternar a expansão de linhas
    const toggleRowExpansion = (rowId: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [rowId]: !prev[rowId]
        }));
    };

    // Function to convert BigInt to string for JSON compatibility
    const stringifyBigInt = (obj: any) =>
        JSON.parse(JSON.stringify(obj, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        ));

    // Excel Export Function with Loading
    const handleExport = async () => {
        try {
            setIsExporting(true);
            setLoadingMessage("Processando exportação Excel...");

            await new Promise(resolve => setTimeout(resolve, 1000));

            const dataToExport = filteredItems.map(item => {
                const { eventos, ...rest } = item;
                return {
                    ...rest,
                    totalEventos: eventos ? eventos.length : 0
                };
            });

            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Nomeações");

            const fileName = `Nomeacoes_${new Date().toISOString().split('T')[0]}.xlsx`;
            XLSX.writeFile(workbook, fileName);

        } catch (error) {
            console.error('Erro ao exportar Excel:', error);
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

    // Main table columns
    const columns: TableColumn<NomeacaoWithEventos>[] = useMemo(() => [
        {
            name: "Eventos",
            cell: (row) => {
                const isExpanded = expandedRows[row.id.toString()];
                const eventCount = row.eventos ? row.eventos.length : 0;
                
                return (
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleRowExpansion(row.id.toString())}
                            className="p-2"
                            disabled={eventCount === 0}
                        >
                            {isExpanded ? <FolderUp className='w-4 h-4' /> : <FolderDown className='w-4 h-4' /> }
                        </Button>
                        <span className="text-xs text-gray-500">({eventCount})</span>
                    </div>
                );
            },
            width: '100px',
            ignoreRowClick: true,
        },
        {
            selector: row => row?.orgao || '',
            name: "Órgão",
            wrap: true,
            sortable: true,
            width: '120px'
        },
        {
            selector: row => row?.nome || '',
            name: "Nome",
            wrap: true,
            sortable: true,
        },
        {
            selector: row => row?.matricula || '',
            name: "Matrícula",
            wrap: true,
            sortable: true,
            width: '110px'
        },
        {
            name: "Vínculo",
            cell: row => {
                const vinculo = row?.vinculo;
                
                if (!vinculo || !VinculoConfig[vinculo]) {
                    return (
                        <div className="flex items-center">
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                                {vinculo || 'N/A'}
                            </span>
                        </div>
                    );
                }

                const { color, icon: Icon } = VinculoConfig[vinculo];

                return (
                    <div className="flex items-center">
                        <div className={`inline-flex items-center ${color} px-2 py-1 rounded-full text-xs font-medium`}>
                            <Icon className="w-4 h-4 mr-1" />
                            {vinculo}
                        </div>
                    </div>
                );
            },
            wrap: true,
            sortable: true,
            width: '170px'
        },
        {
            selector: row => row?.sexo || '',
            name: "Sexo",
            wrap: true,
            sortable: true,
            width: '80px'
        },
        {
            selector: row => row?.simbolo || '',
            name: "Símb.",
            wrap: true,
            sortable: true,
            width: '100px'
        },
        {
            selector: row => {
                if (row?.dataDecreto) {
                    let date = new Date(row.dataDecreto);
                    date.setDate(date.getDate() + 1); // Adiciona um dia
                    return date.toLocaleString('pt-BR', {day: "2-digit", month: "2-digit", year: "numeric"});
                }
                return '';
            },
            name: "Dt. Decreto",
            sortable: true,
            width: '150px'
        },
        {
            selector: row => {
                if (row?.validadeDecreto) {
                    let date = new Date(row.validadeDecreto);
                    date.setDate(date.getDate() + 1); // Adiciona um dia
                    return date.toLocaleString('pt-BR', {day: "2-digit", month: "2-digit", year: "numeric"});
                }
                return '';
            },            
            name: "Validade",
            sortable: true,
            width: '150px'
        },  
        {
            cell: row => {
                const tipoVaga = row?.tipoVaga;
                
                if (!tipoVaga || !VagaConfig[tipoVaga]) {
                    return (
                        <div className="flex items-center">
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                                {tipoVaga || 'N/A'}
                            </span>
                        </div>
                    );
                }

                const { color, icon: Icon } = VagaConfig[tipoVaga];

                return (
                    <div className="flex items-center">
                        <div className={`inline-flex items-center ${color} px-2 py-1 rounded-full text-xs font-medium`}>
                            <Icon className="w-4 h-4 mr-1" />
                            {tipoVaga}
                        </div>
                    </div>
                );
            },
            name: "Tipo Vaga",
            sortable: true,
            width: '140px'
        },
        {
            name: "Ações",
            cell: row => {
                return (
                    <div className="flex justify-start gap-2">
                        {session?.user.role === 'ADMIN' && <>
                            <Button asChild variant={'secondary'} size="sm">
                                <Link href={`/admin/nomeacoes/edit/${row.id}`}>
                                    <Edit className="w-4 h-4" />
                                </Link>
                            </Button>
                            {(row.simbolo?.trim() === '-' || row.simbolo?.trim() === '') && (
                                <ButtonDelete data={row} />
                            )}                        
                        </>}
                    </div>
                )
            },
            ignoreRowClick: true,
            width: '150px'
        }
    ],[]);

    // Detail table columns for eventos
    const detailColumns: TableColumn<EventoNomeacao>[] = [
        {
            selector: row => row?.descricao || '',
            name: "Descrição",
            wrap: true,
            sortable: true,
        },
        {
            selector: row => row?.createdAt ? new Date(row.createdAt).toLocaleString('pt-BR') : '',
            name: "Registrado em",
            sortable: true,
            width: '180px'
        },
        {
            name: "Ações",
            cell: row => {
                return (
                    <div className="flex gap-2">
                        <ButtonDeleteEvento data={row} />
                        <ButtonModal data={row} nomeacaoId={row.nomeacaoId} />
                    </div>
                )
            },
            ignoreRowClick: true,
            width: '120px'
        }
    ];

    // Improved filtering logic
    const filteredItems = useMemo(() => {
        if (!Array.isArray(records)) return [];

        const stringifiedRecords = stringifyBigInt(records);

        return stringifiedRecords.filter((item: NomeacaoWithEventos) => {
            // Global text filter
            const matchesGlobalFilter = filterText
                ? JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
                : true;

            // Column-specific filters
            const matchesColumnFilters = Object.entries(columnFilters).every(([key, filterValue]) => {
                if (!filterValue) return true;

                const column = columns.find(col =>
                    col.selector && String(col.selector) === key
                );

                const getValue = (item: any) => {
                    if (column && column.selector) {
                        if (typeof column.selector === 'function') {
                            return column.selector(item);
                        }
                        return item[column.selector as keyof typeof item];
                    }
                    return item[key];
                };

                const itemValue = getValue(item);

                if (itemValue === null || itemValue === undefined) return false;

                return String(itemValue)
                    .toLowerCase()
                    .includes(filterValue.toLowerCase());
            });

            return matchesGlobalFilter && matchesColumnFilters;
        });
    }, [records, filterText, columnFilters, columns]);

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
                            Exportar Excel
                        </Button>
                        <ButtonExportPdf
                            data={filteredItems}
                            onLoadingChange={handlePdfLoadingChange}
                            urlReport="consolidacao"
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
                        .filter(col => col.name && col.selector)
                        .map((col, index) => {
                            const selectorKey = String(col.selector);

                            return (
                                <div key={`${selectorKey}-${index}`} className="relative">
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
                                        className="pr-8"
                                        disabled={isExporting}
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
        isExporting
    ]);

    // Expanded component for showing events
    const ExpandedComponent = ({ data }: { data: NomeacaoWithEventos }) => {
        const eventos = data.eventos || [];

        return (
            <div className="p-6 bg-gray-50 border-l-4 border-blue-500 space-y-3">
                <div className="flex items-center gap-2 mb-4">
                    <List className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                        Eventos da Nomeação - {data.nome}
                    </h3>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                        {eventos.length} evento(s)
                    </span>
                </div>

                <ButtonModal action={"Novo evento"} data={null} nomeacaoId={data.id} />                     
                
                {eventos.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-sm">                 
                        <DataTable
                            columns={detailColumns}
                            data={eventos}
                            dense
                            pagination
                            paginationPerPage={5}
                            paginationRowsPerPageOptions={[5, 10, 15]}
                            noDataComponent="Nenhum evento encontrado"
                            paginationComponentOptions={{
                                rowsPerPageText: 'Eventos por página',
                                rangeSeparatorText: 'de',
                            }}
                        />
                    </div>
                ) : (
                    <div className="text-center py-8">                         
                        <List className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 text-lg">Não há eventos registrados para esta nomeação.</p>
                    </div>
                )}
            </div>
        );
    };

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
                noDataComponent={
                    <div className="text-center py-8">
                        <ListCheck className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 text-lg">Nenhum registro encontrado</p>
                    </div>
                }
                persistTableHead
                expandableRows
                expandableRowsComponent={ExpandedComponent}
                expandOnRowClicked={false}
                expandOnRowDoubleClicked={false}
                expandableRowExpanded={(row) => expandedRows[row.id.toString()] || false}
                onRowExpandToggled={(expanded, row) => toggleRowExpansion(row.id.toString())}
                paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
                paginationPerPage={25}
                style={{ width: '100%', overflow: 'auto' }}
                paginationComponentOptions={{
                    rowsPerPageText: 'Registros por página',
                    rangeSeparatorText: 'de',
                    selectAllRowsItem: true,
                    selectAllRowsItemText: 'Todos',
                }}
                progressPending={pending}
                progressComponent={
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                        <span>Carregando dados...</span>
                    </div>
                }
            />
        </>
    );
}
