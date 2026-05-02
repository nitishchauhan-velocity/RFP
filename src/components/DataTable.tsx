import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";

type DataTableProps<T> = {
  columns: ColumnDef<T,any>[];
  data: T[];
  state: {
    pagination: PaginationState;
    sorting: SortingState;
  };
  onPaginationChange: OnChangeFn<PaginationState>;
  onSortingChange: OnChangeFn<SortingState>;
};

const DataTable = <T,>({
  columns,
  data,
  state,
  onPaginationChange,
  onSortingChange,
}: DataTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    state,
    onPaginationChange,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <div>
      <div className="flex flex-col justify-center mt-10">
        <table className="border-collapse border-b-2">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    className="px-3 text-center  bg-black text-white border-b-2"
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,

                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getPaginationRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-10 py-3 text-center border-b-2">
                    {flexRender(
                      cell.column.columnDef.cell,

                      cell.getContext(),
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-center gap-14 mt-3">
          <button onClick={() => table.previousPage()}>Prev</button>
          <button onClick={() => table.nextPage()}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
