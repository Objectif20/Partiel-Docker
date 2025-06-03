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
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

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

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { DeliveriesAPI } from "@/api/deliveries.api";

export const schema = z.object({
  id: z.string(),
  content: z.string(),
  author: z.object({
    id: z.string(),
    name: z.string(),
    photo: z.string(),
  }),
  reply: z.boolean(),
  reply_content: z.string().nullable(),
  delivery_name: z.string(),
  rate: z.number(),
});

export const columns = (
  setData: React.Dispatch<React.SetStateAction<z.infer<typeof schema>[]>>
): ColumnDef<z.infer<typeof schema>>[] => {
  const { t } = useTranslation();
  const [selectedReview, setSelectedReview] = React.useState<z.infer<typeof schema> | null>(null);
  const [open, setOpen] = React.useState(false);
  const replyMessageRef = React.useRef<HTMLTextAreaElement>(null);

  const handleReplySubmit = async () => {
    const replyMessage = replyMessageRef.current?.value;

    if (!replyMessage || !selectedReview) return;

    try {
      await DeliveriesAPI.replyToReview(selectedReview.id, replyMessage);

      setData((prev) =>
        prev.map((review) =>
          review.id === selectedReview.id
            ? { ...review, reply: true, reply_content: replyMessage }
            : review
        )
      );

      setOpen(false);
      setSelectedReview(null);
      if (replyMessageRef.current) replyMessageRef.current.value = "";
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  return [
    {
      id: "author",
      accessorKey: "author.name",
      header: t("client.pages.office.delivery.deliveryman.reviews.author"),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={row.original.author.photo} />
            <AvatarFallback>{row.original.author.name[0]}</AvatarFallback>
          </Avatar>
          <span>{row.original.author.name}</span>
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "content",
      header: t("client.pages.office.delivery.deliveryman.reviews.message"),
      cell: ({ row }) => (
        <span>
          {row.original.content.length > 30
            ? `${row.original.content.substring(0, 30)}...`
            : row.original.content}
        </span>
      ),
    },
    {
      accessorKey: "delivery_name",
      header: t("client.pages.office.delivery.deliveryman.reviews.delivery"),
      cell: ({ row }) => (
        <Link to={`/office/deliveries/${row.original.id}`}>
          {t("client.pages.office.delivery.deliveryman.reviews.viewDelivery")}
        </Link>
      ),
    },
    {
      accessorKey: "rate",
      header: t("client.pages.office.delivery.deliveryman.reviews.rate"),
      cell: ({ row }) => row.original.rate,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <>
          <Button
            variant="link"
            className="w-fit px-0 text-left text-foreground"
            onClick={() => {
              setSelectedReview(row.original);
              setOpen(true);
              if (replyMessageRef.current) replyMessageRef.current.value = "";
            }}
          >
            {t("client.pages.office.delivery.deliveryman.reviews.details")}
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
              {selectedReview && (
                <>
                  <DialogHeader className="flex flex-col items-center text-center">
                    <Avatar className="w-16 h-16 mb-2">
                      <AvatarImage src={selectedReview.author.photo} />
                      <AvatarFallback>
                        {selectedReview.author.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <DialogTitle className="text-lg font-semibold">
                      {selectedReview.author.name}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-center">
                      {selectedReview.content}
                    </DialogDescription>
                  </DialogHeader>

                  {!selectedReview.reply ? (
                    <div className="mt-4">
                      <Textarea
                        ref={replyMessageRef}
                        placeholder={t(
                          "client.pages.office.delivery.deliveryman.reviews.replyPlaceholder"
                        )}
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-4">
                      {t(
                        "client.pages.office.delivery.deliveryman.reviews.alreadyReplied"
                      )}
                    </p>
                  )}

                  {!selectedReview.reply && (
                    <DialogFooter>
                      <Button
                        className="mt-2 w-full"
                        onClick={handleReplySubmit}
                      >
                        {t("client.pages.office.delivery.deliveryman.reviews.send")}
                      </Button>
                    </DialogFooter>
                  )}
                </>
              )}
            </DialogContent>
          </Dialog>
        </>
      ),
    },
  ];
};


export function DataTable({ data: initialData }: { data: z.infer<typeof schema>[] }) {
  const { t } = useTranslation();
  const [data, setData] = React.useState(initialData);

  const columnLink = [
    { column_id: "author.name", text: t('client.pages.office.delivery.deliveryman.reviews.author') },
    { column_id: "delivery_name", text: t('client.pages.office.delivery.deliveryman.reviews.deliveryName') },
    { column_id: "rate", text: t('client.pages.office.delivery.deliveryman.reviews.rate') },
    { column_id: "date", text: t('client.pages.office.delivery.deliveryman.reviews.date') },
  ];

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
    columns: columns(setData),
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
                <span className="hidden lg:inline">{t('client.pages.office.delivery.deliveryman.reviews.columns')}</span>
                <span className="lg:hidden">{t('client.pages.office.delivery.deliveryman.reviews.columns')}</span>
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
                  {t('client.pages.office.delivery.deliveryman.reviews.noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
