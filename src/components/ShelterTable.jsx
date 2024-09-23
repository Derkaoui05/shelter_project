import React, { useState, useEffect } from 'react';
import { FaLayerGroup, FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa';

const ShelterTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('');
  const [groupBy, setGroupBy] = useState(null);
  const [sortedBy, setSortedBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

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

    // if (typeof value === 'object' && !Array.isArray(value)) {
    //   return { displayValue: Object.entries(value).map(([key, val]) => `${key}: ${val}`).join(', '), className: '' };
    // }

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

  return (
    <div className="container mx-auto p-3">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Filter by Crisis"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded mr-4"
        />
      </div>

      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className={`border-2 p-2 whitespace-nowrap align-middle text-left`}>
                <div className={`flex items-center flex-col md:flex-row  gap-5 justify-items-center`}>
                  {header}
                  <FaLayerGroup className={`text-lg cursor-pointer  ${index >= 5 ? 'hidden' : ''}`} onClick={() => (index < 5 ? setGroupBy(groupBy === header ? null : header) : null)} />
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
                  <td colSpan={headers.length} className="p-2 font-bold">{group}</td>
                </tr>
                {groupedData[group].map((item, subIndex) => (
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
                    <td key={idx} className={`border  p-2 ${className}`}>
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