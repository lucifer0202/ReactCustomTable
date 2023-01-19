import { useState, useMemo } from "react";
import { sortRows, filterRows, paginateRows } from "../components/helper";
import { Pagination } from "./Pagination";
import { useNavigate } from "react-router";

export const Table = ({ columns, rows, setTableData }) => {
  const [activePage, setActivePage] = useState(1);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ order: "asc", orderBy: "logId" });
  const [startDate, setStartDate] = useState("")
  const [ setEndDate] = useState("")
  const rowsPerPage = 10;
  const navigate = useNavigate();


  const filteredRows = useMemo(

    () => filterRows(rows, filters),
    [rows, filters]
  );
  console.log("-------------", filters)

  const sortedRows = useMemo(
    () => sortRows(filteredRows, sort),
    [filteredRows, sort]
  );
  const calculatedRows = paginateRows(sortedRows, activePage, rowsPerPage);

  const count = filteredRows.length;
  const totalPages = Math.ceil(count / rowsPerPage);

  const handleSearch = (value, accessor) => {
    setActivePage(1);
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
  const handleDateSearch = (startDate, endDate, dateArr) => {
    console.log("-----end", endDate)
    const filterDate = rows.filter(item => {
      if (item.creationTimestamp >= startDate && item.creationTimestamp <= endDate) {
        return item.creationTimestamp
      }
      return  item.creationTimestamp
    });

    let accessor = "creationTimestamp";
    setTableData(filterDate)
    navigate(`?${accessor}=${startDate}to${endDate}`);
  }
  const handleFromDateChange = (e) => {
    setStartDate(e.target.value)
    // let accessor = "creationTimestamp";
    // let value = e.target.value
    // handleSearch(value, accessor)
  };
  const handleToDateChange = (e) => {
    handleDateSearch(startDate, e.target.value);
    setEndDate(e.target.value);
    // getDatesBetween(startDate, e.target.value)
  };
  // const getDatesBetween = (startDate, endDate) => {

  //   let startDate1 = new Date(startDate);
  //   let endDate1 = new Date(endDate);
  //   let dates = [];
  //   let tempDate = new Date(startDate1);
  //   while (tempDate <= endDate1) {
  //     dates.push(new Date(tempDate));
  //     tempDate.setDate(tempDate.getDate() + 1);
  //   }
  //   const dateArr = [];
  //   dates.map((date) => {
  //     var day = date.getUTCDate();
  //     var month = date.getUTCMonth() + 1; //months from 1-12
  //     var year = date.getUTCFullYear();

  //     var newdate = year + "-" + month + "-" + day;
  //     dateArr.push(newdate)
  //   })
  //   let newAcc = "creationTimestamp";
  //   handleDateSearch(startDate, endDate, dateArr, newAcc);

  // };

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
              id="creationTimestamp"
              name="creationTimestamp"
              onChange={handleFromDateChange}
            />
          </th>
          <th>
            <input
              type="date"
              id="Timestamp"
              name="Timestamp"
              onChange={handleToDateChange}
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
