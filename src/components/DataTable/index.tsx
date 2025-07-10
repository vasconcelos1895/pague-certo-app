'use client';

import { useEffect, useMemo, useState } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import FilterComponent from './FilterComponent';
//import { useTheme } from "next-themes"

interface DataTableAppProps<T> {
	columns: TableColumn<T>[]
	data: T[]
}

export function DataTableApp<T>({ columns, data }: DataTableAppProps<T>): JSX.Element {
	//const { theme } = useTheme()
	const [records, setRecords] = useState<T[]>([])
	const [pending, setPending] = useState(true);
	const [filterText, setFilterText] = useState("");
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

	useEffect(() => {
		// Simula carregamento dos dados (pode tirar o timeout se for instantâneo)
		setPending(true);
		const timer = setTimeout(() => {
			setRecords(data);
			setPending(false);
		}, 500); 
		return () => clearTimeout(timer);
	}, [data]);

	const filteredItems = Array.isArray(records)
		? JSON.parse(JSON.stringify(records, (key, value) =>
			typeof value === 'bigint' ? value.toString() : value))
			.filter(item => JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase()))
		: [];

	// Se quiser mostrar loading também ao filtrar, descomente:
	// useEffect(() => {
	// 	setPending(true);
	// 	const timer = setTimeout(() => {
	// 		setPending(false);
	// 	}, 300);
	// 	return () => clearTimeout(timer);
	// }, [filterText]);

	const subHeaderComponent = useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterText("");
			}
		};

		return (
			<FilterComponent
				onFilter={e => setFilterText(e.target.value)}
				onClear={handleClear}
				filterText={filterText}
			/>
		);
	}, [filterText, resetPaginationToggle]);

	return (
		<DataTable
			//theme={theme}
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
			progressPending={pending}  // <-- Ativa o loading
			progressComponent={<span className="loading loading-ring loading-lg"></span>} // Seu spinner customizado
		/>
	);
}


// "use client"
// import * as React from "react"

// import type {
//   ColumnDef,
//   SortingState,
//   ColumnFiltersState,
// } from "@tanstack/react-table"

// import {
//   flexRender,
//   getCoreRowModel,
//   useReactTable,
//   getPaginationRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
// } from "@tanstack/react-table"

// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Input } from "../ui/input"
// import { DataTableViewOptions } from "./DatatableViewOptions"
// import { DataTablePagination } from "./DatatablePagination"

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[]
//   data: TData[]
// }

// export function DataTable<TData, TValue>({
//   columns,
//   data,
// }: DataTableProps<TData, TValue>) {
//   const [sorting, setSorting] = React.useState<SortingState>([])
//   // const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//   //   []
//   // )
//   const [globalFilter, setGlobalFilter] = React.useState<ColumnFiltersState>([])

//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     onSortingChange: setSorting,
//     getSortedRowModel: getSortedRowModel(),
//     //onColumnFiltersChange: setColumnFilters,
//     getFilteredRowModel: getFilteredRowModel(),
//     onGlobalFilterChange: setGlobalFilter,
//     globalFilterFn: 'includesString',
//     state: {
//       sorting,
//       //columnFilters,
//       globalFilter,
//     },
//   })

//   return (
//     <div>
//       <div className="flex items-center py-4 ">
//         <Input
//           placeholder="Filtre por qualquer coluna..."
//           //value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
//           value={globalFilter as string}
//           onChange={(event) =>
//             //table.getColumn("name")?.setFilterValue(event.target.value)
//             table.setGlobalFilter(String(event.target.value))
//           }
//           className="max-w-sm bg-white text-slate-800"
//         />
//         <DataTableViewOptions table={table} />
//       </div>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader  className="bg-slate-800">
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id} >
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id} className="text-slate-50">
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                           header.column.columnDef.header,
//                           header.getContext()
//                         )}
//                     </TableHead>
//                   )
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody  className="bg-white">
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow
//                   className="h-8"
//                   key={row.id}
//                   data-state={row.getIsSelected() && "selected"}
//                 >
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//         <DataTablePagination table={table} />
//       </div>
//     </div>
//   )
// }
