import React, { useState, useEffect, Fragment } from "react";
import { FaLayerGroup, FaFilter, FaSortUp, FaSortDown } from "react-icons/fa";
import columnSchema from '../Schema';
import '../rotate.css'


export default function ShelterTable() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("");
  const [groupBy, setGroupBy] = useState(null);
  const [sortedBy, setSortedBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [table, setTable] = useState({
    columns: columnSchema,
    data: [],
  });

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
        setFilteredData(jsonData);
        setTable((prevTable) => ({
          ...prevTable,
          data: jsonData,
        }));
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (filter) {
      const filtered = data.filter((item) => item.CRISIS.includes(filter));
      setFilteredData(filtered);
      setTable((prevTable) => ({
        ...prevTable,
        data: filtered,
      }));
    } else {
      setFilteredData(data);
      setTable((prevTable) => ({
        ...prevTable,
        data,
      }));
    }
  }, [filter, data]);

  const groupByColumn = (items, column) => {
    const grouped = {};
    items.forEach((item) => {
      const key = item[column] || "Ungrouped";
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });
    return grouped;
  };

  const handleGroupBy = (header) => {
    if (header.grouping) {
      setGroupBy(groupBy === header.Title ? null : header.Title);
    }
  };

  const groupedData = groupBy ? groupByColumn(filteredData, groupBy) : { Ungrouped: filteredData };

  const handleSort = (header, order) => {
    setSortedBy(header.Title);
    setSortOrder(order);

    const sortedData = [...filteredData].sort((a, b) => {
      const aValue = a[header.Title];
      const bValue = b[header.Title];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (
        header.rotate &&
        typeof aValue === "number" &&
        typeof bValue === "number"
      ) {
        if (order === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      }

      if (aValue === bValue) return 0;
      if (order === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredData(sortedData);
    setTable((prevTable) => ({
      ...prevTable,
      data: sortedData,
    }));
  };

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

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
      <div className="container mx-auto">
        <div className="flex items-center my-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter by Crisis"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 p-2 border caret-cyan-700 caret rounded"
            />
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <table className="table-auto mb-2 w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              {table.columns.map((header, index) => (
                <th
                  key={index}
                  className={`text-left ${header.rotate
                    ? "rotate-header"
                    : "border-l border-[#9ca3af]"
                    }`}
                  style={{ height: "250px" }}
                >
                  <div
                    className={`flex items-end whitespace-nowrap justify-between h-full ${header.rotate ? "rotate-text font-light text-xs" : ""
                      }`}
                  >
                    <div className="flex">
                      {header.sorting &&
                        (typeof filteredData[0]?.[header.Title] === "number" ||
                          !header.rotate) && (
                          <div className="flex items-center text-[13px] flex-col ">
                            <FaSortUp
                              title="asc"
                              className="cursor-pointer mb-[-3px] text-gray-400"
                              onClick={() => handleSort(header, "asc")}
                            />
                            <FaSortDown
                              title="desc"
                              className="cursor-pointer mt-[-3px]  text-gray-400"
                              onClick={() => handleSort(header, "desc")}
                            />
                          </div>
                        )}
                      {header.Title}
                    </div>
                    {header.grouping && (
                      <FaLayerGroup
                        className="mx-2 cursor-pointer text-gray-400"
                        onClick={() => handleGroupBy(header)}
                      />
                    )}
                  </div>
                  {header.rotate && (
                    <>
                      <span className="rotated-border"></span>
                      <span className="rotated-background"></span>
                    </>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Object.keys(groupedData).map((group, groupIndex) => (
              <Fragment key={groupIndex}>
                {group !== "Ungrouped" && (
                  <tr className="bg-gray-300">
                    <td
                      colSpan={table.columns.length}
                      className="p-2 cursor-pointer font-semibold"
                      onClick={() => toggleGroup(group)}
                    >
                      {group} ({groupedData[group].length})
                    </td>
                  </tr>
                )}
                {!expandedGroups[group] &&
                  groupedData[group].map((item, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="odd:bg-gray-100 even:bg-gray-50"
                    >
                      {table.columns.map((header, colIndex) => {
                        const { content, styleContent } = changeValue(
                          item[header.Title]
                        );
                        return (
                          <td
                            key={colIndex}
                            className={`border border-[#9ca3af] p-2 text-left ${styleContent}`}
                          >
                            {content || ""}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
