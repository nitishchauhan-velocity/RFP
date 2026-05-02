import api from "@/api/api";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createColumnHelper,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

type Rfp = {
  rfp_id: number;
  item_name: string;
  last_date: string;
  minimum_price: number;
  maximum_price: number;
  status: string;
};
const columnHelper = createColumnHelper<Rfp>();
const RfpList = () => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const queryClient = useQueryClient();
  const closeRfp = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.get(`/rfp/closerfp/${id}`);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.response == "success") {
        toast.success("RFP closed Successfully");
        queryClient.invalidateQueries({ queryKey: ["rfps"] });
        queryClient.invalidateQueries({ queryKey: ["Rfpforquotes"] });
        navigate("/rfp-list");
      } else {
        toast.error(`${data.error}`);
      }
    },
    onError: (err) => {
      console.error("RFP didn't close:", err.message);
      toast.error(`${err.message}`);
    },
  });
  const { data, isLoading } = useQuery<{
    data: Rfp[];
    total: number;
  }>({
    queryKey: ["rfps"],
    queryFn: async () => {
      const res = await api.get("/rfp/all");
      return {
        data: res.data.rfps,
        total: res.data.rfps.length,
      };
    },
    placeholderData: keepPreviousData,
  });
  const RfpColumns = useMemo(
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
        id: "Title",
        header: "Title",
      }),
      columnHelper.accessor("last_date", {
        id: "Last Date",
        header: "Last Date",
      }),
      columnHelper.accessor("minimum_price", {
        id: "Minimum Price",
        header: "Minimum Price",
      }),
      columnHelper.accessor("maximum_price", {
        id: "Maximum Price",
        header: "Maximum Price",
      }),
      columnHelper.accessor("status", {
        header: "Vendor Status",
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
          const status = rfp.status;
          return (
            <>
              {status === "closed" ? (
                <Button className=" cursor-pointer bg-transparent text-green-500">
                  <Link to={`/rfp-list/rfp-quotes/${rfp.rfp_id}`}>Quotes</Link>
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button
                    className=" cursor-pointer bg-transparent text-red-500"
                    onClick={() => {
                      const id: number = rfp?.rfp_id;
                      closeRfp.mutate(id);
                    }}
                  >
                    Close RFP
                  </Button>
                  <Button className="cursor-pointer bg-transparent text-green-500">
                    <Link to={`/rfp-list/rfp-quotes/${rfp.rfp_id}`}>
                      Quotes
                    </Link>
                  </Button>
                </div>
              )}
             
            </>
          );
        },
      }),
    ],
    [],
  );
  if (isLoading) return <div>Loading RFPs...</div>;
  return (
    <div className="p-6">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold mb-4">RFP List</h1>
        <Button
          className="bg-green-500 cursor-pointer"
          onClick={() => navigate("/rfpselectcategory")}
        >
          +Add RFP
        </Button>
      </div>
      <DataTable<Rfp>
        columns={RfpColumns}
        data={data?.data || []}
        state={{ pagination, sorting }}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
      />
    </div>
  );
};

export default RfpList;
