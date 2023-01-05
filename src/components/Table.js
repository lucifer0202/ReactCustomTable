import { useState, useMemo } from "react";
import { sortRows, filterRows, paginateRows } from "../components/helper";
import { Pagination } from "./Pagination";
import { useNavigate } from "react-router";

export const Table = ({ columns, rows }) => {
  const [activePage, setActivePage] = useState(1);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ order: "asc", orderBy: "logId" });
  const [date, setDate] = useState();
  const rowsPerPage = 10;
  const navigate = useNavigate();

  const filteredRows = useMemo(
    () => filterRows(rows, filters),
    [rows, filters]
  );

  const sortedRows = useMemo(
    () => sortRows(filteredRows, sort),
    [filteredRows, sort]
  );
  const calculatedRows = paginateRows(sortedRows, activePage, rowsPerPage);

  const count = filteredRows.length;
  const totalPages = Math.ceil(count / rowsPerPage);

  const handleSearch = (value, accessor) => {
    console.log("-----value", value, accessor);
    setActivePage(1);
    // if (accessor === "Timestamp") {
    //   setFilters((prevFilters) => ({
    //     ...prevFilters,
    //     [accessor]: date,
    //   }));
    //   navigate(`?${accessor}=${date}`);
    // }
    if (value) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [accessor]: value,
      }));
      navigate(`?${accessor}=${value}`);
    } else {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters };
        delete updatedFilters[accessor];
        navigate(``);

        return updatedFilters;
      });
    }
  };

  const handleSort = (accessor) => {
    setActivePage(1);
    setSort((prevSort) => ({
      order:
        prevSort.order === "asc" && prevSort.orderBy === accessor
          ? "desc"
          : "asc",
      orderBy: accessor,
    }));
  };
  const handleDateChange = (e) => {
    setDate(e.target.value);
    handleSearch(e.target.value, e.target.name);
  };
  return (
    <>
      <table className="filterTable">
        <tr>
          {columns
            .filter((item) => item.label !== "Timestamp")
            .map((column) => {
              return (
                <th>
                  <input
                    key={`${column.accessor}-search`}
                    type="search"
                    placeholder={`Search ${column.label}`}
                    value={filters[column.accessor]}
                    onChange={(event) =>
                      handleSearch(event.target.value, column.accessor)
                    }
                  />
                </th>
              );
            })}
          <th>
            <input
              type="date"
              id="Timestamp"
              name="Timestamp"
              onChange={handleDateChange}
            />
          </th>
        </tr>
      </table>
      <table className="listTable">
        <thead>
          <tr>
            {columns.map((column) => {
              const sortIcon = () => {
                if (column.accessor === sort.orderBy) {
                  if (sort.order === "asc") {
                    return "⬆️";
                  }
                  return "⬇️";
                } else {
                  return "️↕️";
                }
              };
              return (
                <th className="listheader" key={column.accessor}>
                  <span>{column.label}</span>
                  <button onClick={() => handleSort(column.accessor)}>
                    {sortIcon()}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {calculatedRows.map((row) => {
            return (
              <tr className="listrow" key={row.id}>
                {columns.map((column) => {
                  if (column.format) {
                    return (
                      <td className="listrow" key={column.accessor}>
                        {column.format(row[column.accessor])}
                      </td>
                    );
                  }
                  return (
                    <td className="listrow" key={column.accessor}>
                      {row[column.accessor]}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {count > 0 ? (
        <Pagination
          activePage={activePage}
          count={count}
          rowsPerPage={rowsPerPage}
          totalPages={totalPages}
          setActivePage={setActivePage}
        />
      ) : (
        <p>No data found</p>
      )}
    </>
  );
};
