import React, { useEffect, useState } from 'react';
import columnSchema from '../Schema';
import { SortAsc, SortDesc } from 'lucide-react';

export default function DataTable() {
  const [table, setTable] = useState({
    columns: columnSchema,
    data: [],
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: '' });

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setTable((prevState) => ({ ...prevState, data })))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSort = (column) => {
    if (!column.sorting) return;

    const direction = sortConfig.key === column.Title && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: column.Title, direction });
  };

  const sortedData = [...table.data];
  if (sortConfig.key) {
    sortedData.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const changeValue = (value) => {
    let content = value;
    let styleContent = "";

    if (typeof value === "number") {
      if (value === -3) {
        content = "W";
        styleContent = "bg-red-500 font-medium";
      } else if (value === 1) {
        content = "SW";
        styleContent = "bg-orange-500 font-medium";
      } else if (value === 3) {
        content = "S";
        styleContent = "bg-green-500 font-medium";
      }
    }

    return { content, styleContent };
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-xl shadow-slate-400 rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              {table.columns.map((column, index) => (
                <th
                  key={index}
                  scope="col"
                  className={`px-6 py-3 text-gray-800 align-bottom whitespace-nowrap cursor-pointer ${column.rotate ? 'rotate' : 'border-l border-[#9ca3af]'}`}
                  onClick={() => handleSort(column)}
                  style={{ height: "250px" }}
                >
                  {column.rotate && <div className="header-background" />}
                  <div className="header-content flex items-center justify-between">
                    {column.rotate && sortConfig.key === column.Title && (
                      <>
                        {sortConfig.direction === 'asc' ? (
                          <SortAsc className="inline text-slate-500 ml-2" size={16} />
                        ) : (
                          <SortDesc className="inline text-slate-500 ml-2" size={16} />
                        )}
                      </>
                    )}
                    <span>{column.Title}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* <tbody className="bg-white">
            {sortedData.map((row, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 odd:bg-gray-100 transition-colors"
              >
                {table.columns.map((column, columnIndex) => (
                  <td
                    key={columnIndex}
                    className="px-6 py-4  text-gray-900 "
                  >
                    {row[column.Title]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody> */}
          <tbody className="bg-white">
            {sortedData.map((row, index) => (
              <tr key={index} className="border-b border-gray-200 odd:bg-gray-100 transition-colors">
                {table.columns.map((column, columnIndex) => {
                  const { content, styleContent } = changeValue(row[column.Title]);

                  return (
                    <td
                      key={columnIndex}
                      className={`px-6 py-4 text-gray-900 ${styleContent}`} // Apply the conditional styling here
                    >
                      {content || ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </>
  );
}
