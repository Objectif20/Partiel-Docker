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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

export const schema = z.object({
  id: z.string(),
  content: z.string(),
  provider: z.object({
    id: z.string(),
    name: z.string(),
    photo: z.string(),
  }),
  date: z.string(),
  service_name: z.string(),
  rate: z.number(),
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
    { column_id: "provider.name", text: t("client.pages.office.services.client.services-reviews.columns.provider") },
    { column_id: "service_name", text: t("client.pages.office.services.client.services-reviews.columns.service") },
    { column_id: "rate", text: t("client.pages.office.services.client.services-reviews.columns.rate") },
    { column_id: "date", text: t("client.pages.office.services.client.services-reviews.columns.date") },
  ];

  const columns = (): ColumnDef<z.infer<typeof schema>>[] => {
    return [
      {
        id: "provider",
        accessorKey: "provider.name",
        header: t("client.pages.office.services.client.services-reviews.columns.provider"),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={row.original.provider.photo} />
              <AvatarFallback>{row.original.provider.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <span>{row.original.provider.name}</span>
            </div>
          </div>
        ),
        enableHiding: false,
      },
      {
        accessorKey: "content",
        header: t("client.pages.office.services.client.services-reviews.columns.message"),
        cell: ({ row }) => (
          <Dialog>
            <DialogTrigger asChild>
              <span className="text-blue-500 cursor-pointer">
                {row.original.content.length > 30
                  ? `${row.original.content.substring(0, 30)}...`
                  : row.original.content}
              </span>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("client.pages.office.services.client.services-reviews.full-message")}</DialogTitle>
                <DialogDescription>
                  {row.original.content}
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        ),
      },
      { accessorKey: "service_name", header: t("client.pages.office.services.client.services-reviews.columns.service"), cell: ({ row }) => row.original.service_name },
      { accessorKey: "rate", header: t("client.pages.office.services.client.services-reviews.columns.rate"), cell: ({ row }) => row.original.rate },
      {
        accessorKey: "date",
        header: t("client.pages.office.services.client.services-reviews.columns.date"),
        cell: ({ row }) => {
          const date = new Date(row.original.date);
          return date.toLocaleDateString("fr-FR");
        },
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
                <span className="hidden lg:inline">{t("client.pages.office.services.client.services-reviews.columns.columns")}</span>
                <span className="lg:hidden">{t("client.pages.office.services.client.services-reviews.columns.columns")}</span>
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
                  {t("client.pages.office.services.client.services-reviews.no-results")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
