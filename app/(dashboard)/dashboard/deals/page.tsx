"use client";

import LoadingSpinner from "@/components/ui/spinner";
import { Deal } from "@prisma/client";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function Page() {
  const [data, setData] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo<ColumnDef<Deal>[]>(
    () => [
      {
        accessorKey: "title",
        header: () => <div className="text-left">名稱</div>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "contactName",
        header: () => <div className="text-left">聯絡人</div>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "contactNo",
        header: () => <div className="text-left">聯絡電話</div>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "state",
        header: () => <div className="text-left">狀態</div>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "dealAmount",
        header: () => <div className="text-left">價值</div>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "createdAt",
        cell: (value) => {
          return new Date(value.getValue() as string).toLocaleString();
        },
        header: () => <div className="text-left">創建時間</div>,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "id",
        cell: (value) => {
          return (
            <Link href={`/dashboard/deals/edit/${value.getValue()}`}>
              Edit
            </Link>
          );
        },
        enableColumnFilter: false,
        header: () => <div className="text-left">修改</div>,
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
      columnFilters,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: totalPages,
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: (pagination.pageIndex + 1).toString(),
        pageSize: pagination.pageSize.toString(),
        sortBy: sorting.length > 0 ? sorting[0].id : "",
        sortOrder: sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "",
        filters: JSON.stringify(
          columnFilters.reduce((acc, filter) => {
            acc[filter.id] = filter.value;
            return acc;
          }, {} as Record<string, any>)
        ),
      });

      const response = await fetch(`/api/deals?${queryParams}`);
      const result = await response.json();

      setIsLoading(false);
      setData(result.data);
      setTotalPages(result.totalPages);
      setTotalItems(result.totalItems);
    };

    fetchData();
  }, [pagination, sorting, columnFilters]);

  return (
    <div className="p-2">
      <div className="p-2 flex gap-4">
        <Link
          href={"/dashboard/deals/create"}
          className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg"
        >
            Create Deal
        </Link>
      </div>
      <div className="overflow-x-scroll">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      className="p-0"
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      <div>
                        <div
                          className={`flex bg-slate-100 p-2 border-b ${
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: " 🔼",
                            desc: " 🔽",
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {header.column.getCanFilter() ? (
                          <div className="p-2 border-b">
                            {header.column.id === "createdAt" ? (
                              <input
                                className="border w-full rounded px-2 py-1 font-normal"
                                type="date"
                                onChange={(e) =>
                                  header.column.setFilterValue(e.target.value)
                                }
                              />
                            ) : (
                              <input
                                className="border w-full rounded px-2 py-1 font-normal"
                                placeholder="Filter"
                                type="text"
                                onChange={(e) =>
                                  header.column.setFilterValue(e.target.value)
                                }
                              />
                            )}
                          </div>
                        ) : (
                          <div className="p-2 border-b h-[51px]"></div>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows && table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td className="p-2 border-b" key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : isLoading ? (
              <tr>
                <td className="py-2 border-b" colSpan={7}>
                  <LoadingSpinner />
                </td>
              </tr>
            ) : (
              <tr>
                <td
                  className="py-2 text-center font-bold text-xl border-b"
                  colSpan={7}
                >
                  沒有合適的欄
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="h-2" />
      <div>
        <div className="w-full flex justify-between gap-4">
          <button
            className="hover:bg-slate-50 w-full border rounded px-2 py-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="hover:bg-slate-50 w-full border rounded px-2 py-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            className="hover:bg-slate-50 w-full border rounded px-2 py-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            className="hover:bg-slate-50 w-full border rounded px-2 py-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
        </div>
        <div className="w-full flex items-center gap-2 mt-2">
          <span className="flex items-center gap-1">
            <div>頁面</div>
            <strong>
              {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | 前往頁面:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="border p-1 rounded w-16"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
            className="border py-1 px-2 rounded"
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                顯示 {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default Page;
