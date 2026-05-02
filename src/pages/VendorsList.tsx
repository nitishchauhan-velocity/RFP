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

export type Vendor = {
  user_id: number;
  name: string;
  email: string;
  mobile: string;
  status: string;
};
type UpdateVendorPayload = {
  user_id: number;
  status: "Approved" | "Pending" | "Rejected";
};
const columnHelper = createColumnHelper<Vendor>();

const VendorsList = () => {
  const [loadingId,setLoadingId] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data, isLoading } = useQuery({
    queryKey: ["vendors"],
    queryFn: async () => {
      const res = await api.get("/vendorlist");
      return {
        data: res.data.vendors,
        total: res.data.vendors.length || 0,
      };
    },
    placeholderData: keepPreviousData,
  });
  const updateVendor = useMutation({
    mutationFn: async (data: UpdateVendorPayload) => {
      await api.post(`/approveVendor`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      toast.success("Vendor Approve successfully");
    },
    onError: (error) => {
      toast.error("Failed to Approve user");
      console.error(error);
    },
  });

  const VendorColumns = useMemo(
    () => [
      columnHelper.display({
        id: "sno",
        header: "S.No",
        cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          return pageIndex * pageSize + row.index + 1;
        },
      }),
      columnHelper.accessor("name", {
        id: "Name",
        header: "Name",
      }),
      columnHelper.accessor("email", {
        id: "email",
        header: "Email",
      }),
      columnHelper.accessor("status", {
        header: "Vendor Status",
        cell: ({ getValue }) => {
          const status = getValue<string>();
          const color =
            status === "Approved"
              ? "bg-green-300 text-green-800"
              : status === "Pending"
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
          const vendor = row.original;
          const status = vendor.status;
          return (
            <>
              {status === "Approved" ? (
                <></>
              ) : (
                <Button
                  className=" cursor-pointer bg-transparent text-lg text-green-500 "
                  onClick={() =>{
                    setLoadingId(vendor.user_id);
                    updateVendor.mutate({
                      user_id: vendor.user_id,
                      status: "Approved",
                    },{
                  onSettled: () => setLoadingId(null),

                })
                  }}
                >
                  {updateVendor.isPending &&loadingId===vendor.user_id
                    ? "Approving..."
                    : "Approve"}
                </Button>
              )}
            </>
          );
        },
      }),
    ],
    [updateVendor.isPending],
  );
  if (isLoading) return <div>Loading vendors...</div>;
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Vendor List</h1>
      
      <DataTable<Vendor>
        columns={VendorColumns}
        data={data?.data || []}
        state={{ pagination, sorting }}
        onPaginationChange={setPagination}
        onSortingChange={setSorting}
      />
    </div>
  );
};

export default VendorsList;
