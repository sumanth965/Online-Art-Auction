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
         PROFESSIONAL TABLE
       ========================= */
    const renderTable = (data) => {
        if (!Array.isArray(data) || data.length === 0) {
            return (
                <div className="text-center py-10 text-gray-400">
                    No data available for this query
                </div>
            );
        }

        const columns = Object.keys(data[0]);

        return (
            <div className="relative overflow-x-auto rounded-xl border border-gray-700 shadow-lg">
                <table className="w-full text-sm text-left text-gray-300">
                    {/* Header */}
                    <thead className="bg-gray-800 sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3 border-b border-gray-700 text-gray-400 font-semibold">
                                #
                            </th>
                            {columns.map((col) => (
                                <th
                                    key={col}
                                    className="px-4 py-3 border-b border-gray-700 text-gray-400 font-semibold capitalize"
                                >
                                    {col.replace(/_/g, " ")}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {data.map((row, index) => (
                            <tr
                                key={index}
                                className="bg-gray-900 hover:bg-gray-800 transition"
                            >
                                <td className="px-4 py-3 border-b border-gray-800 text-gray-500">
                                    {index + 1}
                                </td>

                                {columns.map((col) => (
                                    <td
                                        key={col}
                                        className="px-4 py-3 border-b border-gray-800"
                                    >
                                        {typeof row[col] === "object" && row[col] !== null ? (
                                            <span className="text-amber-400">
                                                {JSON.stringify(row[col])}
                                            </span>
                                        ) : (
                                            <span className="text-gray-200">
                                                {typeof row[col] === "number" &&
                                                    col.toLowerCase().includes("bid")
                                                    ? `₹${row[col]}`
                                                    : row[col]}
                                            </span>
                                        )}
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
            <h2 className="text-2xl font-bold mb-4 text-white">
                Analytics & Queries
            </h2>

            {/* Query Selector */}
            <div className="flex gap-4 items-center mb-6">
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
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setView("table")}
                    className={`px-4 py-2 rounded-lg ${view === "table"
                            ? "bg-amber-500 text-black"
                            : "bg-gray-700 text-white"
                        }`}
                >
                    Table View
                </button>

                <button
                    onClick={() => setView("json")}
                    className={`px-4 py-2 rounded-lg ${view === "json"
                            ? "bg-amber-500 text-black"
                            : "bg-gray-700 text-white"
                        }`}
                >
                    JSON View
                </button>
            </div>

            {/* Results */}
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-amber-400 mb-4">
                    Query Results
                </h3>

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
