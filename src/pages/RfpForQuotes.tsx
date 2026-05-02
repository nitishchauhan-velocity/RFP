import api from "@/api/api";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export type RfpQuotes = {
  id: number;
  admin_id: number;
  item_name: string;
  item_description: string;
  rfp_no: string;
  quantity: number;
  last_date: string;
  minimum_price: number;
  maximum_price: number;
  rfp_id: number;
  rfp_status: string;
  applied_status: string;
};
const columnHelper = createColumnHelper<RfpQuotes>();
const RfpForQuotes = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data, isLoading } = useQuery<{
    data: RfpQuotes[];
    total: number;
  }>({
    queryKey: ["Rfpforquotes", user?.user_id],
    queryFn: async () => {
      const res = await api.get(`/rfp/getrfp/${user?.user_id}`);
      console.log(res);
      return {
        data: res.data.rfps,
        total: res.data.rfps.length || 0,
      };
    },
    enabled: !!user?.user_id,
    placeholderData: keepPreviousData,
  });
  const Applyhandler = (rfp_id: number) => {
    navigate(`/rfp-for-quotes/applyquotes/${rfp_id}`);
  };
  const Viewhandler = (rfp_id: number) => {
    navigate(`/rfp-for-quotes/rfp-quotes/${rfp_id}`);
  };
  

  const RfpForQuotesColumn = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          return pageIndex * pageSize + row.index + 1;
        },
      }),
      columnHelper.accessor("item_name", {
        id: "Item Name",
        header: "Item Name",
      }),
      columnHelper.accessor("last_date", {
        id: "Last Date",
        header: "Last Date",
      }),
      columnHelper.accessor("minimum_price", {
        id: "Min Price",
        header: "Min Price",
      }),
      columnHelper.accessor("maximum_price", {
        id: "Max Price",
        header: "Max Price",
      }),
      columnHelper.accessor("quantity", {
        id: "Quantity",
        header: "Quantity",
      }),
      columnHelper.accessor("rfp_status", {
        header: "RFP Status",
        cell: ({ getValue }) => {
          const status = getValue<string>();
          const color =
            status === "open"
              ? "bg-green-300 text-green-800"
              : status === "closed"
                ? "bg-red-300 text-red-800"
                : "bg-gray-200 text-gray-800";
          return (
            <span className={`px-2 py-1 rounded text-sm ${color}`}>
              {status}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "Action",
        header: "Action",
        cell: ({ row }) => {
          const rfp = row.original;
          const appliedstatus = rfp.applied_status;
          return (
            <>
              {appliedstatus === "applied" ? (
                <Button className="w-23" onClick={() => Viewhandler(rfp.rfp_id)}>
                  View Quote
                </Button>
              ) : (
                <Button className="w-23" onClick={() => Applyhandler(rfp.rfp_id)}>
                  Apply
                </Button>
              )}
            </>
          );
        },
      }),
    ],
    [],
  );

  if (isLoading) return <div>Loading RFP For Quotes...</div>;
  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold mb-4">RFP List</h1>
      </div>
      <DataTable<RfpQuotes>
        columns={RfpForQuotesColumn}
        data={data?.data || []}
        state={{ pagination, sorting }}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
      />
    </div>
  );
};

export default RfpForQuotes;
