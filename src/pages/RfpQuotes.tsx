import api from "@/api/api";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  createColumnHelper,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Quotes = {
  vendor_id: number;
  name: string;
  item_price: number;
  total_cost: number;
  email: string;
};
const columnHelper = createColumnHelper<Quotes>();
const RfpQuotes = () => {
  const navigate = useNavigate();
  const { rfp_id } = useParams();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data, isLoading} = useQuery({
    queryKey: ["vendors", rfp_id],
    queryFn: async () => {
      const res = await api.get(`/rfp/quotes/${rfp_id}`);
      console.log(res);
      return {
        response: res.data,
        data: res.data.quotes,
        total: res.data.quotes.length,
      };
    },
    retry: 0,
    enabled: !!rfp_id,
    placeholderData: keepPreviousData,
  });

  console.log(data);
  const RfpQuotesColumns = useMemo(
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
        id: "Title",
        header: "Title",
      }),
      columnHelper.accessor("item_price", {
        id: "Item Price",
        header: "Item Price",
      }),
      columnHelper.accessor("total_cost", {
        id: "Total Cost",
        header: "Total Cost",
      }),
      columnHelper.accessor("email", {
        id: "Vendor Email",
        header: "Vendor Email",
      }),
    ],
    [],
  );
  if (isLoading) return <div>Loading RFP Quotes...</div>;
  console.log(data?.response);
  return (
    <div>
      <div className="p-6">
        <div className="flex justify-between">
          <h1 className="text-xl font-semibold mb-4">RFP Quotes</h1>
          <Button onClick={()=>navigate(-1)}>Back</Button>
        </div>
        {data?.response.response === undefined ? (
          <div className=" text-xl text-center mt-20 font-bold">No Quotes Available for this RFP</div>
        ) : (
          <DataTable<Quotes>
            columns={RfpQuotesColumns}
            data={data?.data || []}
            state={{ pagination, sorting }}
            onPaginationChange={setPagination}
            onSortingChange={setSorting}
          />
        )}
      </div>
    </div>
  );
};

export default RfpQuotes;
