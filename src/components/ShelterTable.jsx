import React, { useState, useEffect, Fragment } from 'react';
import { FaLayerGroup, FaSortAmountUp, FaSortAmountDown, FaFilter } from 'react-icons/fa';

const columnSchema = [
  {
    Title: "CRISIS",
    sorting: true,
    grouping: true,
    rotate: false,
  },
  {
    Title: "EDITION",
    sorting: true,
    grouping: true,
    rotate: false,
  },
  {
    Title: "YEAR",
    sorting: true,
    grouping: true,
    rotate: false,
  },
  {
    Title: "COUNTRY",
    sorting: true,
    grouping: true,
    rotate: false,
  },
  {
    Title: "CASE STUDY",
    sorting: true,
    grouping: true,
    rotate: false,
  },
  {
    Title: "Accessibility / Disability Inclusion",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Adaptability (of shelter solutions)",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Advocacy",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Cash and Market-based approaches",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Community engagement",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Coordination and partnerships",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Cost effectiveness",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Coverage and scale",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Cultural appropriateness of shelter solutions",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Disaster Risk Reduction",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Durability of shelter solutions",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Environmental sustainability",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Flexibility of the organization / project",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "GBV risk mitigation",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Gender mainstreaming / Women’s empowerment",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Geographic Targeting (project locations)",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Habitability / Comfort",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Health",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Integrated programming / Multi-sectoral approaches",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Links with recovery / wider impacts / durable solutions",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Livelihoods / employment opportunities",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Local authority / Government engagement",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Local construction techniques / capacity / materials",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Local private sector engagement",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Location and settlement planning",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Market-based approaches",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Monitoring and Evaluation",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Occupants’ satisfaction",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Organizational capacity / Preparedness",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Procurement and logistics",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Project planning",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Protection mainstreaming / risk mitigation",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Security of Tenure / HLP",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Settlements approach",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Social Cohesion / Community stabilization / Resilience",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Socio-Technical Assistance quality",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Targeting of assistance (beneficiary selection)",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Team composition / Staffing",
    sorting: false,
    grouping: false,
    rotate: true,
  },
  {
    Title: "Timeliness of the assistance",
    sorting: false,
    grouping: false,
    rotate: true,
  },
]

const ShelterTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState('');
  const [groupBy, setGroupBy] = useState(null);
  const [sortedBy, setSortedBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [table, setTable] = useState({
    columns: columnSchema,
    data: [],
  });

  useEffect(() => {
    fetch('/data.json')
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
        setFilteredData(jsonData);
        setTable((prevTable) => ({
          ...prevTable,
          data: jsonData,
        }));
      })
      .catch((error) => console.error('Error fetching data:', error));
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
      const key = item[column] || 'Ungrouped';
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
    setSortedBy(header);
    setSortOrder(order);

    const sortedData = [...filteredData].sort((a, b) => {
      if (a[header] === null) return 1;
      if (b[header] === null) return -1;
      if (a[header] === b[header]) return 0;

      if (order === 'asc') {
        return a[header] > b[header] ? 1 : -1;
      } else {
        return a[header] < b[header] ? 1 : -1;
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
    <>
      <div className="container mx-auto">
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
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr>
              {table.columns.map((header, index) => (
                <th
                  key={index}
                  className={`text-left ${header.rotate ? 'rotate-header' : 'border-l border-l-[#9ca3af] bg-gray-200 '}`}
                  style={{ height: '250px' }}
                >
                  <div className={`flex items-end whitespace-nowrap justify-between h-full ${header.rotate ? 'rotate-text font-normal text-xs' : ''}`}>
                    {header.Title}
                    <div className="flex items-end gap-2">
                      {header.sorting && (
                        <div className="flex flex-col">
                          <FaSortAmountUp
                            title="asc"
                            className="ml-2 mb-2 cursor-pointer text-gray-400"
                            onClick={() => handleSort(header.Title, 'asc')}
                          />
                          <FaSortAmountDown
                            title="desc"
                            className="ml-2 cursor-pointer text-gray-400"
                            onClick={() => handleSort(header.Title, 'desc')}
                          />
                        </div>
                      )}
                      {header.grouping && (
                        <FaLayerGroup
                          className="mx-2 cursor-pointer text-gray-400"
                          onClick={() => handleGroupBy(header)}
                        />
                      )}
                    </div>
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
                {group !== 'Ungrouped' && (
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
                    <tr key={rowIndex} className="odd:bg-gray-100 even:bg-gray-50">
                      {table.columns.map((header, colIndex) => {
                        const { content, styleContent } = changeValue(item[header.Title]);
                        return (
                          <td key={colIndex} className={`border border-[#9ca3af] p-2 text-left ${styleContent}`}>
                            {content || ''}
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
};

export default ShelterTable;
