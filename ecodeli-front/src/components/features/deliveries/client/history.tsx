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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { z } from "zod";
import FeedbackDialog from "../../utils/feedback-dialog";
import { useTranslation } from 'react-i18next';
import { useState } from "react";

interface Delivery {
  id: string;
  deliveryman: {
    id: string;
    name: string;
    photo: string;
  };
  departureDate: string;
  arrivalDate: string;
  departureCity: string;
  arrivalCity: string;
  announcementName: string;
  rate: number | null;
  comment: string | null;
}

export const schema = z.object({
  id: z.string(),
  deliveryman: z.object({
    id: z.string(),
    name: z.string(),
    photo: z.string(),
  }),
  departureDate: z.string(),
  arrivalDate: z.string(),
  departureCity: z.string(),
  arrivalCity: z.string(),
  announcementName: z.string(),
  rate: z.number().nullable(),
  comment: z.string().nullable(),
});

export const columns = (t: any): ColumnDef<z.infer<typeof schema>>[] => {
  const navigate = useNavigate();

  return [
    {
      id: "deliveryman",
      accessorKey: "deliveryman.name",
      header: t('client.pages.office.delivery.deliveryHistory.table.deliveryman'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={row.original.deliveryman.photo} />
            <AvatarFallback>{row.original.deliveryman.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <span>{row.original.deliveryman.name}</span>
          </div>
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "departureDate",
      header: t('client.pages.office.delivery.deliveryHistory.table.departureDate'),
      cell: ({ row }) => {
        const date = new Date(row.original.departureDate);
        return date.toLocaleDateString("fr-FR");
      },
    },
    {
      accessorKey: "arrivalDate",
      header: t('client.pages.office.delivery.deliveryHistory.table.arrivalDate'),
      cell: ({ row }) => {
        const date = new Date(row.original.arrivalDate);
        return date.toLocaleDateString("fr-FR");
      },
    },
    {
      accessorKey: "departureCity",
      header: t('client.pages.office.delivery.deliveryHistory.table.departureCity'),
      cell: ({ row }) => row.original.departureCity,
    },
    {
      accessorKey: "arrivalCity",
      header: t('client.pages.office.delivery.deliveryHistory.table.arrivalCity'),
      cell: ({ row }) => row.original.arrivalCity,
    },
    {
      accessorKey: "announcementName",
      header: t('client.pages.office.delivery.deliveryHistory.table.announcementName'),
      cell: ({ row }) => row.original.announcementName,
    },
    {
      id: "feedback",
      header: t('client.pages.office.delivery.deliveryHistory.table.feedback'),
      cell: ({ row }) => {
        const { rate, comment, id } = row.original;
        const [hasFeedback, setHasFeedback] = useState(
                 rate !== 0 && comment !== null && comment.trim() !== ""
               );

        return hasFeedback ? (
          <span className="text-muted-foreground text-sm">
            {t('client.pages.office.delivery.deliveryHistory.table.alreadyGiven')}
          </span>
        ) : (
          <FeedbackDialog maxNote={5} id={id} onFeedbackSent={() => setHasFeedback(true)} serviceName="delivery" />
        );
      },
    },
    {
      id: "actions",
      header: t('client.pages.office.delivery.deliveryHistory.table.actions'),
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/office/deliveries/public/${row.original.id}`)}
        >
          {t('client.pages.office.delivery.deliveryHistory.table.viewDetails')}
        </Button>
      ),
    },
  ];
};

export function DataTable({ data: initialData }: { data: Delivery[] }) {
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
                  {t('client.pages.office.delivery.deliveryHistory.table.columns')}
                </span>
                <span className="lg:hidden">
                  {t('client.pages.office.delivery.deliveryHistory.table.columns')}
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
