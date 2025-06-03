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

import { z } from "zod";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";

export const schema = z.object({
  id: z.string(),
  clientName: z.string(),
  clientImage: z.string().nullable(),
  date: z.string(),
  time: z.string(),
  serviceName: z.string(),
  rating: z.number().nullable(),
});

export function DataTable({ data: initialData }: { data: z.infer<typeof schema>[] }) {
  const { t } = useTranslation();
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    if (initialData && initialData.length > 0) {
      setData(initialData);
    }
  }, [initialData]);

  const columns = (): ColumnDef<z.infer<typeof schema>>[] => {
    return [
      {
        accessorKey: "clientName",
        header: t("client.pages.office.services.provider.services-history.columns.client"),
        cell: ({ row }) => (
          <div className="flex items-center">
            <Avatar>
              <AvatarImage src={row.original.clientImage || ""} alt={row.original.clientName} />
              <AvatarFallback>{row.original.clientName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="ml-2">{row.original.clientName}</span>
          </div>
        ),
      },
      { accessorKey: "date", header: t("client.pages.office.services.provider.services-history.columns.date"), cell: ({ row }) => row.original.date },
      { accessorKey: "time", header: t("client.pages.office.services.provider.services-history.columns.time"), cell: ({ row }) => row.original.time },
      { accessorKey: "serviceName", header: t("client.pages.office.services.provider.services-history.columns.service"), cell: ({ row }) => row.original.serviceName },
      {
        accessorKey: "rating",
        header: t("client.pages.office.services.provider.services-history.columns.rating"),
        cell: ({ row }) => row.original.rating ? `${row.original.rating}/5` : "N/A",
      },
    ];
  };

  const columnLink = [
    { column_id: "clientName", text: t("client.pages.office.services.provider.services-history.columns.client") },
    { column_id: "date", text: t("client.pages.office.services.provider.services-history.columns.date") },
    { column_id: "time", text: t("client.pages.office.services.provider.services-history.columns.time") },
    { column_id: "serviceName", text: t("client.pages.office.services.provider.services-history.columns.service") },
    { column_id: "rating", text: t("client.pages.office.services.provider.services-history.columns.rating") },
  ];

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns: columns(),
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
                <span className="hidden lg:inline">{t("client.pages.office.services.provider.services-history.columns.columns")}</span>
                <span className="lg:hidden">{t("client.pages.office.services.provider.services-history.columns.columns")}</span>
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
                  {t("client.pages.office.services.provider.services-history.no-results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
