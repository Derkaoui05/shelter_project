import { SortAsc, SortDesc, Layers, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import columnSchema from '../Schema';

export default function DataTable() {
  const [table, setTable] = useState({
    columns: columnSchema,
    data: [],
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: '' });
  const [groupConfig, setGroupConfig] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setTable((prevState) => ({ ...prevState, data })))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSort = (column) => {
    if (!column.sorting) return;

    const direction =
      sortConfig.key === column.Title && sortConfig.direction === 'asc'
        ? 'desc'
        : 'asc';
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


  const handleGroup = (column) => {
    if (!column.grouping) return;

    console.log("Grouping by:", column.Title)

    if (groupConfig === column.Title) {

      setGroupConfig(null);
      setExpandedGroups({});
    } else {

      setGroupConfig(column.Title);
      setExpandedGroups({});
    }
  };

  const toggleGroup = (groupKey) => {
    setExpandedGroups((prevState) => ({
      ...prevState,
      [groupKey]: !prevState[groupKey],
    }));
  };

  const groupedData = groupConfig
    ? sortedData.reduce((groups, item) => {
      const groupKey = item[groupConfig];
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {})
    : { all: sortedData };

  const changeValue = (value) => {
    let content = value;
    let styleContent = '';

    if (typeof value === 'number') {
      if (value === -3) {
        content = 'W';
        styleContent = 'bg-red-500 font-medium';
      } else if (value === 1) {
        content = 'SW';
        styleContent = 'bg-orange-500 font-medium';
      } else if (value === 3) {
        content = 'S';
        styleContent = 'bg-green-500 font-medium';
      }
    }

    return { content, styleContent };
  };

  return (
    <div className="relative overflow-x-auto shadow-xl shadow-slate-400 rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            {table.columns.map((column, colIndex) => (
              <th
                key={colIndex}
                scope="col"
                className={`px-6 py-3 text-gray-800 align-bottom whitespace-nowrap ${column.rotate ? 'rotate' : 'border-l border-[#9ca3af]'}`}
                style={{ height: '375px' }}  // Ensure this matches your CSS
              >
                {column.rotate && <div className="header-background" />}
                <div className="header-content flex items-end">
                  {column.rotate && (
                    <>

                      <div className="cursor-pointer mr-2" onClick={(e) => { e.stopPropagation(); handleSort(column); }}>
                        {sortConfig.key === column.Title ? (
                          sortConfig.direction === 'asc' ? (
                            <SortAsc className="inline text-black" size={16} />
                          ) : (
                            <SortDesc className="inline text-black" size={16} />
                          )
                        ) : (
                          <SortAsc className="inline text-black opacity-60" size={16} />
                        )}
                      </div>
                      <span className="rotate">{column.Title}</span>
                    </>
                  )}
                  {!column.rotate && (
                    <>
                      <span>{column.Title}</span>
                      {column.grouping && (
                        <div className="cursor-pointer ml-2" onClick={() => handleGroup(column)}>
                          <Layers className="inline text-slate-500" size={16} />
                        </div>
                      )}
                      {column.sorting && (
                        <div className="cursor-pointer ml-2" onClick={(e) => {
                          e.stopPropagation();
                          handleSort(column);
                        }}>
                          {sortConfig.key === column.Title ? (
                            sortConfig.direction === 'asc' ? (
                              <SortAsc className="inline text-black" size={16} />
                            ) : (
                              <SortDesc className="inline text-black" size={16} />
                            )
                          ) : (
                            <SortAsc className="inline text-black opacity-60" size={16} />
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white">
          {!groupConfig && sortedData.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-200 odd:bg-gray-200 even:bg-gray-100 transition-colors">
              {table.columns.map((column, columnIndex) => {
                const { content, styleContent } = changeValue(row[column.Title]);
                return (
                  <td
                    key={columnIndex}
                    className={`px-6 py-4 w-fit text-gray-900 ${styleContent}`}
                  >
                    {content || ''}
                  </td>
                );
              })}
            </tr>
          ))}

          {groupConfig && Object.keys(groupedData).map((groupKey, index) => (
            <React.Fragment key={index}>
              <tr
                className="bg-gray-100 cursor-pointer"
                onClick={() => toggleGroup(groupKey)}
              >
                <td colSpan={table.columns.length} className="px-6 py-4 w-fit font-medium text-gray-900">
                  <div className="flex justify-between">
                    <span>{groupKey} (x{groupedData[groupKey].length})</span>
                    {expandedGroups[groupKey] ? (
                      <ChevronUp className="text-slate-500" size={16} />
                    ) : (
                      <ChevronDown className="text-slate-500" size={16} />
                    )}
                  </div>
                </td>
              </tr>

              {expandedGroups[groupKey] &&
                groupedData[groupKey].map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-gray-200 odd:bg-gray-100 transition-colors">
                    {table.columns.map((column, columnIndex) => {
                      const { content, styleContent } = changeValue(row[column.Title]);
                      return (
                        <td
                          key={columnIndex}
                          className={`px-6 py-4 w-fit text-gray-900 ${styleContent}`}
                        >
                          {content || ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>

  );
}
