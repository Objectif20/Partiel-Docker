"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ColumnsIcon,
  ChevronDownIcon,
} from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

export const schema = z.object({
  id: z.string(),
  name: z.string(),
  matricule: z.string(),
  co2: z.number(),
  allow: z.boolean(),
  image: z.string(),
  justification_file: z.string().url(),
});



export const columns = (t: any): ColumnDef<z.infer<typeof schema>>[] => {
  const [, setSelectedVehicle] = useState<any>(null);

  const handleClose = () => {
    setSelectedVehicle(null);
  };

  return [
    {
      accessorKey: "name",
      header: t('client.pages.office.delivery.vehicles.myVehicles.table.name'),
      cell: ({ row }) => <span>{row.original.name}</span>,
    },
    {
      accessorKey: "matricule",
      header: t('client.pages.office.delivery.vehicles.myVehicles.table.matricule'),
      cell: ({ row }) => <span>{row.original.matricule}</span>,
    },
    {
      accessorKey: "co2",
      header: t('client.pages.office.delivery.vehicles.myVehicles.table.co2'),
      cell: ({ row }) => <span>{row.original.co2}</span>,
    },
    {
      accessorKey: "allow",
      header: t('client.pages.office.delivery.vehicles.myVehicles.table.allow'),
      cell: ({ row }) => <span>{row.original.allow ? "Oui" : "Non"}</span>,
    },
    {
      id: "actions",
      header: t('client.pages.office.delivery.vehicles.myVehicles.table.actions'),
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="link"
              className="w-fit px-0 text-left text-foreground"
            >
              {t('client.pages.office.delivery.vehicles.myVehicles.table.details')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="flex flex-col items-center text-center">
              <img src={row.original?.image} alt={row.original?.name} className="w-32 h-32 mb-2 object-cover rounded" />
              <DialogTitle className="text-lg font-semibold">
                {row.original?.name}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                {t('client.pages.office.delivery.vehicles.myVehicles.table.matricule')}: {row.original?.matricule}
              </DialogDescription>
            </DialogHeader>
            <p className="text-sm text-center text-gray-600">{t('client.pages.office.delivery.vehicles.myVehicles.table.co2')}: {row.original?.co2}</p>
            <p className="text-sm text-center text-gray-600">{t('client.pages.office.delivery.vehicles.myVehicles.table.allow')}: {row.original?.allow ? "Oui" : "Non"}</p>
            <div className="mt-4">
              <a href={row.original?.justification_file} download>
                <Button className="w-full">
                  {t('client.pages.office.delivery.vehicles.myVehicles.table.downloadJustification')}
                </Button>
              </a>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" onClick={handleClose}>
                  {t('client.pages.office.delivery.vehicles.myVehicles.table.close')}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
  ];
};

export function DataTable({ data: initialData }: { data: z.infer<typeof schema>[] }) {
  const { t } = useTranslation();
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    if (initialData && initialData.length > 0) {
      setData(initialData);
    }
  }, [initialData]);

  const columnLink = [
  { column_id: "name", text: t('client.pages.office.delivery.vehicles.myVehicles.table.name') },
  { column_id: "matricule", text: t('client.pages.office.delivery.vehicles.myVehicles.table.matricule') },
  { column_id: "co2", text: t('client.pages.office.delivery.vehicles.myVehicles.table.co2') },
  { column_id: "allow", text: t('client.pages.office.delivery.vehicles.myVehicles.table.allow') },
];

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns: columns(t),
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    getRowId: (row) => row.id,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex justify-end items-center gap-2 w-full my-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ColumnsIcon className="h-4 w-4 mr-2" />
                <span className="hidden lg:inline">{t('client.pages.office.delivery.vehicles.myVehicles.table.columns')}</span>
                <span className="lg:hidden">{t('client.pages.office.delivery.vehicles.myVehicles.table.columns')}</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  const columnLinkItem = columnLink.find(
                    (link) => link.column_id === column.id
                  );
                  const displayText = columnLinkItem
                    ? columnLinkItem.text
                    : column.id;

                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {displayText}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t('client.pages.office.delivery.reviews.table.noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
