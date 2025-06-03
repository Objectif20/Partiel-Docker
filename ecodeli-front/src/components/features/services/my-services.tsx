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
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
import { Badge } from "@/components/ui/badge";

export const schema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  type: z.string(),
  city: z.string().nullable(),
  price: z.string(),
  duration: z.number(),
  available: z.boolean(),
  status: z.string(),
  validated: z.boolean(),
});

export function DataTable({ data: initialData }: { data: z.infer<typeof schema>[] }) {
  const { t } = useTranslation();
  const [data, setData] = React.useState(initialData);

  React.useEffect(() => {
    if (initialData && initialData.length > 0) {
      setData(initialData);
    }
  }, [initialData]);

  const columnLink = [
    { column_id: "name", text: t("client.pages.office.services.provider.services-list.columns.name") },
    { column_id: "type", text: t("client.pages.office.services.provider.services-list.columns.type") },
    { column_id: "city", text: t("client.pages.office.services.provider.services-list.columns.city") },
    { column_id: "price", text: t("client.pages.office.services.provider.services-list.columns.price") },
    { column_id: "duration", text: t("client.pages.office.services.provider.services-list.columns.duration") },
    { column_id: "status", text: t("client.pages.office.services.provider.services-list.columns.status") },
  ];

  const columns = (): ColumnDef<z.infer<typeof schema>>[] => {
    const navigate = useNavigate();

    return [
      {
        accessorKey: "name",
        header: t("client.pages.office.services.provider.services-list.columns.name"),
        cell: ({ row }) => <span>{row.original.name}</span>,
      },
      {
        accessorKey: "description",
        header: t("client.pages.office.services.provider.services-list.columns.description"),
        cell: ({ row }) => (
          <span>
            {row.original.description.length > 30
              ? `${row.original.description.substring(0, 30)}...`
              : row.original.description}
          </span>
        ),
      },
      { accessorKey: "type", header: t("client.pages.office.services.provider.services-list.columns.type"), cell: ({ row }) => row.original.type },
      { accessorKey: "city", header: t("client.pages.office.services.provider.services-list.columns.city"), cell: ({ row }) => row.original.city || "N/A" },
      { accessorKey: "price", header: t("client.pages.office.services.provider.services-list.columns.price"), cell: ({ row }) => row.original.price },
      { accessorKey: "duration", header: t("client.pages.office.services.provider.services-list.columns.duration"), cell: ({ row }) => row.original.duration },
      { accessorKey: "status", header: t("client.pages.office.services.provider.services-list.columns.status"), cell: ({ row }) =>
        (
          <Badge
            variant={row.original.status === "active" ? "default" : "destructive"}
            className="capitalize"
          >
            {row.original.status === "active" ? t("client.pages.office.services.provider.services-list.status.active") : t("client.pages.office.services.provider.services-list.status.inactive")}
          </Badge>
        )
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <Button
            variant="link"
            className="w-fit px-0 text-left text-foreground"
            onClick={() => navigate(`/office/services/${row.original.id}`)}
          >
            {t("client.pages.office.services.provider.services-list.actions.details")}
          </Button>
        ),
      },
    ];
  };

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
                <span className="hidden lg:inline">{t("client.pages.office.services.provider.services-list.columns.columns")}</span>
                <span className="lg:hidden">{t("client.pages.office.services.provider.services-list.columns.columns")}</span>
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
                  {t("client.pages.office.services.provider.services-list.no-results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
