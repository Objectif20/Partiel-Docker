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
import {
  Button
} from "@/components/ui/button";
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
import { useTranslation } from 'react-i18next';

interface ShipmentRequest {
  id: string;
  name: string;
  departureCity: string;
  arrivalCity: string;
  urgent: boolean;
  nbColis: number;
  nbLivraisons: number;
}

export const columns = (t: any): ColumnDef<ShipmentRequest>[] => {
  const navigate = useNavigate();

  return [
    {
      accessorKey: "name",
      header: t('client.pages.office.shipment.shipmentHistory.table.name'),
      cell: ({ row }) => row.original.name,
    },
    {
      accessorKey: "departureCity",
      header: t('client.pages.office.shipment.shipmentHistory.table.departureCity'),
      cell: ({ row }) => row.original.departureCity,
    },
    {
      accessorKey: "arrivalCity",
      header: t('client.pages.office.shipment.shipmentHistory.table.arrivalCity'),
      cell: ({ row }) => row.original.arrivalCity,
    },
    {
      accessorKey: "urgent",
      header: t('client.pages.office.shipment.shipmentHistory.table.urgent'),
      cell: ({ row }) => (row.original.urgent ? t('client.pages.office.shipment.shipmentHistory.table.yes') : t('client.pages.office.shipment.shipmentHistory.table.no')),
    },
    {
      accessorKey: "nbColis",
      header: t('client.pages.office.shipment.shipmentHistory.table.nbColis'),
      cell: ({ row }) => row.original.nbColis,
    },
    {
      accessorKey: "nbLivraisons",
      header: t('client.pages.office.shipment.shipmentHistory.table.nbLivraisons'),
      cell: ({ row }) => row.original.nbLivraisons,
    },
    {
      id: "actions",
      header: t('client.pages.office.shipment.shipmentHistory.table.actions'),
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/office/shipments/${row.original.id}`)}
        >
          {t('client.pages.office.shipment.shipmentHistory.table.viewDetails')}
        </Button>
      ),
    },
  ];
};

export function DataTable({ data: initialData }: { data: ShipmentRequest[] }) {
  const { t } = useTranslation();
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
                <span className="hidden lg:inline">
                  {t('client.pages.office.shipment.shipmentHistory.table.columns')}
                </span>
                <span className="lg:hidden">
                  {t('client.pages.office.shipment.shipmentHistory.table.columns')}
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
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="sticky top-0 bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
