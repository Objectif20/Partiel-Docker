"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next"

export type Billing = {
    id: string
    date: string
    type: "auto" | "not-auto"
    invoiceLink: string
}

type BillingsDataTableProps = {
    billings: Billing[];
  };



export const BillingsDataTable: React.FC<BillingsDataTableProps> = ({ billings }) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const { t } = useTranslation();

  const columns: ColumnDef<Billing>[] = [
      {
          accessorKey: "date",
          header: ({ column }) => {
              return (
                  <Button
                      variant="ghost"
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                      className="font-medium"
                  >
                      {t("client.pages.office.settings.billings.table.columns.date")}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
              )
          },
          cell: ({ row }) => {
              const date = new Date(row.getValue("date"));
              const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}/${date.getFullYear()}`;
              return <div className="font-medium">{formattedDate}</div>;
          },
      },
      {
          accessorKey: "amount",
          header: ({ column }) => {
              return (
                  <Button
                      variant="ghost"
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                      className="font-medium"
                  >
                      {t("client.pages.office.settings.billings.table.columns.amount")}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
              )
          },
          cell: ({ row }) => {
              const amount = row.getValue("amount") as number
              return <div className="font-medium">{amount} €</div>
          }
      },
      {
          accessorKey: "type",
          header: ({ column }) => {
              return (
                  <Button
                      variant="ghost"
                      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                      className="font-medium"
                  >
                      {t("client.pages.office.settings.billings.table.columns.type")}

                      <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
              )
          },
          cell: ({ row }) => {
              const type = row.getValue("type") as string

              return (
                <Badge variant="outline">
                  {type === "auto"
                    ? t("client.pages.office.settings.billings.table.type.auto")
                    : t("client.pages.office.settings.billings.table.type.manual")}
                </Badge>
              )
          },
          filterFn: (row, id, value) => {
              return value.includes(row.getValue(id))
          },
      },
      {
          id: "facture",
          header: () => <div className="text-right font-medium">{t("client.pages.office.settings.billings.table.columns.invoice")}</div>,
          cell: ({ row }) => {
              const invoiceLink = row.original.invoiceLink

              return (
                  <div className="text-right">
                      <a href={invoiceLink} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="text-primary hover:text-primary/85 hover:bg-background">
                              {t("client.pages.office.settings.billings.table.download")} <Download className="ml-2 h-4 w-4" />
                          </Button>
                      </a>
                  </div>
              )
          },
      },
  ]

  const table = useReactTable({
    data: billings,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder={t("client.pages.office.settings.billings.table.filter")}
          value={(table.getColumn("date")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("date")?.setFilterValue(event.target.value)}
          className="max-w-xs"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {t("client.pages.office.settings.billings.table.columns.invoice")} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id === "date"
                      ? t('client.pages.office.settings.billings.table.columns.date')
                      : column.id === "type"
                        ? t('client.pages.office.settings.billings.table.columns.type')
                        : column.id === "facture"
                          ? t('client.pages.office.settings.billings.table.columns.invoice')
                          : column.id === "amount"
                            ? t('client.pages.office.settings.billings.table.columns.amount')
                            : column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    {t("client.pages.office.settings.billings.table.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t("client.pages.office.settings.billings.table.previous")}
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            {t("client.pages.office.settings.billings.table.next")}
          </Button>
        </div>
      </div>
    </div>
  )
}
