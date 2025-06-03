import React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface PaginationControlsProps {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  onPageIndexChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  pageIndex,
  pageSize,
  totalItems,
  onPageIndexChange,
  onPageSizeChange,
}) => {
  const { t } = useTranslation();
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="flex items-center justify-between px-4 mt-6">
      <div className="hidden flex-1 text-sm lg:flex">
       {totalItems > 1
         ? t("client.components.pagination.totalRowsWithS", { count: totalItems })
         : t("client.components.pagination.totalRowsWithoutS", { count: totalItems })}
        
      </div>
      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            {t("client.components.pagination.rowsPerPage")}
          </Label>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              onPageSizeChange(Number(value));
            }}
          >
            <SelectTrigger className="w-20" id="rows-per-page">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              {[1, 10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          {t("client.components.pagination.pageCount", { current: pageIndex + 1, total: totalPages })}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageIndexChange(0)}
            disabled={pageIndex === 0}
          >
            <span className="sr-only">{t("client.components.pagination.firstPage")}</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => onPageIndexChange(pageIndex - 1)}
            disabled={pageIndex === 0}
          >
            <span className="sr-only">{t("client.components.pagination.previousPage")}</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => onPageIndexChange(pageIndex + 1)}
            disabled={pageIndex >= totalPages - 1}
          >
            <span className="sr-only">{t("client.components.pagination.nextPage")}</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => onPageIndexChange(totalPages - 1)}
            disabled={pageIndex >= totalPages - 1}
          >
            <span className="sr-only">{t("client.components.paginationlastPage")}</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
