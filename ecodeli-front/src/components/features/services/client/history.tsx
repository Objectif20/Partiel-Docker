"use client";

import * as React from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  flexRender,
} from "@tanstack/react-table";

import { z } from "zod";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ColumnsIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FeedbackDialog from "../../utils/feedback-dialog";
import { useState } from "react";
import { useTranslation } from 'react-i18next';

// Schema for validation
export const schema = z.object({
  id: z.string(),
  id_service: z.string(),
  price: z.number(),
  provider: z.object({
    id: z.string(),
    name: z.string(),
    photo: z.string(),
  }),
  date: z.string(),
  service_name: z.string(),
  rate: z.number().nullable(),
  review: z.string().nullable(),
});

export const columnLink = (t: (key: string) => string) => [
  { column_id: "provider.name", text: t('client.pages.office.services.client.history.table.columnLinks.provider') },
  { column_id: "service_name", text: t('client.pages.office.services.client.history.table.columnLinks.service_name') },
  { column_id: "rate", text: t('client.pages.office.services.client.history.table.columnLinks.rate') },
  { column_id: "price", text: t('client.pages.office.services.client.history.table.columnLinks.price') },
  { column_id: "date", text: t('client.pages.office.services.client.history.table.columnLinks.date') },
];

export const columns = (t: (key: string) => string, navigate: any): ColumnDef<z.infer<typeof schema>>[] => {
  return [
    {
      id: "provider",
      accessorKey: "provider.name",
      header: t('client.pages.office.services.client.history.table.columns.provider'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={row.original.provider.photo} />
            <AvatarFallback>{row.original.provider.name[0]}</AvatarFallback>
          </Avatar>
          <span>{row.original.provider.name}</span>
        </div>
      ),
      enableHiding: false,
    },
    { accessorKey: "service_name", header: t('client.pages.office.services.client.history.table.columns.service_name') },
    { accessorKey: "rate", header: t('client.pages.office.services.client.history.table.columns.rate') },
    {
      accessorKey: "price",
      header: t('client.pages.office.services.client.history.table.columns.price'),
      cell: ({ row }) => `${row.original.price.toFixed(2)} €`,
    },
    {
      accessorKey: "date",
      header: t('client.pages.office.services.client.history.table.columns.date'),
      cell: ({ row }) => {
        const date = new Date(row.original.date);
        return date.toLocaleDateString("fr-FR");
      },
    },
    {
      id: "feedback",
      header: t('client.pages.office.services.client.history.table.columns.feedback'),
      cell: ({ row }) => {
        const { rate, review, id } = row.original
        const [hasFeedback, setHasFeedback] = useState(
          rate !== 0 && review !== null && review.trim() !== ""
        );

        return hasFeedback ? (
          <span className="text-muted-foreground text-sm">
            {t('client.pages.office.services.client.history.table.columns.alreadyGiven')}
          </span>
        ) : (
          <FeedbackDialog
            maxNote={5}
            id={id}
            onFeedbackSent={() => setHasFeedback(true)}
            serviceName="service"
          />
        );
      },
    },
    {
      id: "actions",
      header: t('client.pages.office.services.client.history.table.columns.actions'),
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/office/service/${row.original.id_service}`)}
        >
          {t('client.pages.office.services.client.history.table.columns.view')}
        </Button>
      ),
    },
  ];
};

export function DataTable({ data: initialData }: { data: z.infer<typeof schema>[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    if (initialData && initialData.length > 0) {
      setData(initialData);
    }
  }, [initialData]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns: columns(t, navigate),
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
                <span className="hidden lg:inline">
                  {t('client.pages.office.services.client.history.dropdown.columns')}
                </span>
                <span className="lg:hidden">
                  {t('client.pages.office.services.client.history.dropdown.columns')}
                </span>
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
                  const columnLinkItem = columnLink(t).find(
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
                  colSpan={columns(t, navigate).length}
                  className="h-24 text-center"
                >
                  {t('client.pages.office.services.client.history.table.noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
