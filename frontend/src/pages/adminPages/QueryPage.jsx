import React, { useState } from "react";
import axios from "axios";

const QueryPage = () => {
  const [queryId, setQueryId] = useState("");
  const [result, setResult] = useState([]);
  const [view, setView] = useState("table"); // table | json

  const queries = [
    "List artworks sold above ₹1 lakh",
    "Find artists whose works were unsold",
    "Show bidders who won multiple auctions",
    "Calculate average bid per artwork",
    "Retrieve artworks bid on by 5+ users",
    "Highest bid artwork in each category",
    "Auctions where no bids were placed",
    "Artists featured in multiple auctions",
    "Top 3 bidders by total spend",
    "Categories with the most artworks"
  ];

  const runQuery = async () => {
    if (!queryId) return alert("Please select a query first!");
    const { data } = await axios.post(
      "http://localhost:5000/api/queries/run",
      { queryId }
    );
    setResult(data);
  };

  /* =========================
       TABLE GENERATOR
     ========================= */
  const renderTable = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return <p className="text-gray-400">No data to display</p>;
    }

    const columns = Object.keys(data[0]);

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-700">
          <thead className="bg-gray-700">
            <tr>
              {columns.map((col) => (
                <th key={col} className="p-2 border border-gray-600">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="odd:bg-gray-800 even:bg-gray-900">
                {columns.map((col) => (
                  <td key={col} className="p-2 border border-gray-700">
                    {typeof row[col] === "object"
                      ? JSON.stringify(row[col])
                      : row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
      <h2 className="text-2xl font-bold mb-4">Analytics & Queries</h2>

      {/* Query Selector */}
      <div className="flex gap-4 items-center mb-4">
        <select
          className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600"
          value={queryId}
          onChange={(e) => setQueryId(Number(e.target.value))}
        >
          <option value="">Select Query</option>
          {queries.map((q, i) => (
            <option key={i} value={i + 1}>
              {i + 1}. {q}
            </option>
          ))}
        </select>

        <button
          onClick={runQuery}
          className="px-6 py-3 bg-amber-500 text-black font-semibold rounded-lg hover:bg-amber-600"
        >
          Run Query
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setView("table")}
          className={`px-4 py-2 rounded-lg ${
            view === "table"
              ? "bg-amber-500 text-black"
              : "bg-gray-700 text-white"
          }`}
        >
          Table View
        </button>

        <button
          onClick={() => setView("json")}
          className={`px-4 py-2 rounded-lg ${
            view === "json"
              ? "bg-amber-500 text-black"
              : "bg-gray-700 text-white"
          }`}
        >
          JSON View
        </button>
      </div>

      {/* Query Results */}
      <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
        {view === "table" && renderTable(result)}

        {view === "json" && (
          <pre className="text-gray-300 text-sm overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default QueryPage;
