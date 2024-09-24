import React, { useState, useEffect } from 'react';
import { FaLayerGroup, FaSortAmountUp, FaSortAmountDown, FaChevronDown, FaChevronRight, FaFilter } from 'react-icons/fa';


const ShelterTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('');
  const [groupBy, setGroupBy] = useState(null);
  const [sortedBy, setSortedBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({}); 

  useEffect(() => {
    fetch('/data.json')
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (filter) {
      const filtered = data.filter((item) => item.CRISIS.includes(filter));
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [filter, data]);

  const groupByColumn = (items, column) => {
    const grouped = {};
    items.forEach((item) => {
      const key = item[column];
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });
    return grouped;
  };

  const groupedData = groupBy ? groupByColumn(filteredData, groupBy) : null;

  const getHeaders = (data) => {
    if (data.length > 0) {
      const allKeys = Object.keys(data[0]);
      const startFromCrisis = allKeys.slice(allKeys.indexOf('CRISIS')).filter(key => !['url', 'TITLE', 'IMAGE', 'KEYWORDS', 'DESCRIPTION', 'Column1'].includes(key));
      return startFromCrisis;
    }
    return [];
  };

  const headers = getHeaders(filteredData);

  const BodyValue = (value, index) => {
    if (index >= 5) {
      if (typeof value === 'number') {
        if (value < 0) {
          return { displayValue: 'W', className: 'bg-red-500 font-medium' };
        } else if (value >= 1 && value < 3) {
          return { displayValue: 'SW', className: 'bg-orange-500 font-medium' };
        } else if (value >= 3) {
          return { displayValue: 'S', className: 'bg-green-500 font-medium' };
        }
      }
    }
    return { displayValue: value, className: '' };
  };

  const handleSort = (header, order) => {
    setSortedBy(header);
    setSortOrder(order);

    const sortedData = [...filteredData].sort((a, b) => {
      if (a[header] === 0 && b[header] !== 0) return 1;
      if (a[header] !== 0 && b[header] === 0) return -1;
      if (order === 'asc') {
        if (a[header] < b[header]) return -1;
        if (a[header] > b[header]) return 1;
        return 0;
      } else {
        if (a[header] > b[header]) return -1;
        if (a[header] < b[header]) return 1;
        return 0;
      }
    });

    setFilteredData(sortedData);
  };

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const countGroupedItems = (group) => {
    return groupedData[group].length;
  };

  return (
    <div className="container mx-auto p-3">
      <div className="flex items-center mb-4">
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

      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className={`border-2 p-2 whitespace-nowrap align-middle text-left`}>
                <div className={`flex items-center flex-col md:flex-row gap-5 justify-items-center`}>
                  {header}
                  {index < 5 && (
                    <FaLayerGroup
                      className={`text-lg  cursor-pointer`}
                      onClick={() => setGroupBy(groupBy === header ? null : header)}
                    />
                  )}
                  <FaSortAmountUp
                    className={`text-lg cursor-pointer ${sortedBy === header && sortOrder === 'asc' ? 'text-blue-500' : ''}`}
                    onClick={() => handleSort(header, 'asc')}
                  />
                  <FaSortAmountDown
                    className={`text-lg cursor-pointer ${sortedBy === header && sortOrder === 'desc' ? 'text-blue-500' : ''}`}
                    onClick={() => handleSort(header, 'desc')}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {groupBy ? (
            Object.keys(groupedData).map((group, index) => (
              <React.Fragment key={index}>
                <tr className="odd:bg-gray-100 even:bg-gray-50">
                  <td
                    colSpan={headers.length}
                    className="p-2 font-bold flex items-center cursor-pointer"
                    onClick={() => toggleGroup(group)}
                  >
                    {expandedGroups[group] ? <FaChevronDown className="mr-2" /> : <FaChevronRight className="mr-2" />}
                    {group} ({countGroupedItems(group)})
                  </td>
                </tr>
                {expandedGroups[group] && groupedData[group].map((item, subIndex) => (
                  <tr key={subIndex} className="hover:bg-gray-100">
                    {headers.map((header, idx) => {
                      const { displayValue, className } = BodyValue(item[header] || '', idx);
                      return (
                        <td key={idx} className={`border p-2 ${className}`}>
                          {groupBy === header ? '' : displayValue}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))
          ) : (
            filteredData.map((item, index) => (
              <tr key={index} className="odd:bg-gray-200 even:bg-gray-100">
                {headers.map((header, idx) => {
                  const { displayValue, className } = BodyValue(item[header] || '', idx);
                  return (
                    <td key={idx} className={`border text-left p-2 ${className}`}>
                      {displayValue}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ShelterTable;
