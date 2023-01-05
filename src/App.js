import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./components/style.css";
import { Table } from "./components/Table";
import { columns } from "./components/Columns";

export default function App() {
  const [tableData, setTableData] = useState();
  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://run.mocky.io/v3/a2fbc23e-069e-4ba5-954c-cd910986f40f"
      );
      const data = await response.json();
      setTableData(data.result.auditLog);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {tableData && (
            <Route
              path="/"
              element={<Table rows={tableData} columns={columns} />}
            ></Route>
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}
