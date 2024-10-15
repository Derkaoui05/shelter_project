import { AArrowDown, AArrowUp, ChevronDown, ChevronUp, Layers, Eye, EyeOff } from 'lucide-react';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useExpanded, useGlobalFilter, useGroupBy, useSortBy, useTable } from 'react-table';
import { Tooltip } from 'react-tooltip';
import tableData from '../../data.json';
import columnSchema from '../Schema';
import { generateHash, generateTooltipContent, shelterAssistanceIcons, supportMethodIcons } from '../utils/data';
import SearchInput from './SearchInput';

export default function DataTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hiddenColumns, setHiddenColumns] = useState({});
  const data = useMemo(() => tableData, []);

  const columns = useMemo(() => {
    return columnSchema.map((col) => ({
      Header: col.Title,
      accessor: col.Title,
      disableSortBy: !col.sorting,
      rotate: col.rotate,
      grouping: col.grouping,
      tooltip: col.tooltip,
      visibility: col.visibility,
      Cell: ({ value, row, column }) => renderCellContent(value, row, column),
    }));
  }, []);

  const renderCellContent = (value, row, column) => {
    if (hiddenColumns[column.id]) {
      return null;
    }

    if (column.Header === 'SUPPORT METHODS' && typeof value === 'object') {
      return (
        <div className="px-6 py-4 flex items-center text-gray-900">
          {Object.entries(value).map(([method, isUsed]) =>
            isUsed ? (
              <span key={method} className="flex items-center mr-2">
                {supportMethodIcons[method]}
              </span>
            ) : null
          )}
        </div>
      );
    }
    if (column.Header === 'SHELTER ASSISTANCE TYPES' && typeof value === 'object') {
      return (
        <div className="px-6 py-4 flex items-center text-gray-900">
          {Object.entries(value).map(([type, isUsed]) =>
            isUsed ? (
              <span key={type} className="flex items-center mr-2">
                {shelterAssistanceIcons[type]}
              </span>
            ) : null
          )}
        </div>
      );
    }

    let content = value;
    let styleContent = '';

    if (typeof value === 'number') {
      if (value === -3) {
        content = 'W';
        styleContent = 'bg-[#d9d9d9] text-[#57595b] font-medium';
      } else if (value === 1) {
        content = 'SW';
        styleContent = 'bg-[#acacac] text-[#57595b] font-medium';
      } else if (value === 3) {
        content = 'S';
        styleContent = 'bg-[#57595b] text-white font-medium';
      }
    }

    const tooltipId = column.tooltip ? `tooltip-${generateHash(`${row.id}-${column.Header}`)}` : '';
    const tooltipContent = column.tooltip ? generateTooltipContent(row) : '';

    return (
      <div className={`px-6 py-4 text-gray-900 ${styleContent}`}>
        <span
          data-tooltip-id={tooltipId}
          data-tooltip-html={tooltipContent}
        >
          {content || ''}
        </span>
      </div>
    );
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    toggleGroupBy,
    allColumns,
    state: { groupBy },
  } = useTable(
    {
      columns,
      data,
      autoResetGroupBy: false,
    },
    useGlobalFilter,
    useGroupBy,
    useSortBy,
    useExpanded
  );

  useEffect(() => {
    setGlobalFilter(searchQuery || undefined);
  }, [searchQuery, setGlobalFilter]);

  const handleGroupBy = (columnId) => {
    if (groupBy.length === 0) {
      toggleGroupBy(columnId);
    } else if (groupBy.length === 1 && groupBy[0] !== columnId) {
      toggleGroupBy(columnId);
      toggleGroupBy(groupBy[0]);
    } else if (groupBy[0] === columnId) {
      toggleGroupBy(columnId);
    }
  };

  const toggleColumnVisibility = (columnId) => {
    setHiddenColumns(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  if (!data || data.length === 0) {
    return <div className="text-center text-red-600 font-bold p-4">NO DATA AVAILABLE😑</div>;
  }

  return (
    <div className="space-y-3 w-full overflow-x-visible">
      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search Here..."
      />
      <div className="relative overflow-x-auto shadow-xl shadow-slate-400">
        <div className="absolute left-4 top-10 mb-4">
          <h1 className='text-[#bdaa8d] text-3xl'>SHELTER PROJECTS</h1>
          <h1 className="text-7xl font-medium text-start text-[#640811] capitalize leading-[95px]">
            Strength/Weakness Case <br /> Study Analysis Tool
          </h1>
        </div>
        <table {...getTableProps()} className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    colSpan={1}
                    className={`px-6 py-2 text-gray-800 align-bottom whitespace-nowrap ${column.rotate ? 'rotate' : 'starter'} ${
                      hiddenColumns[column.id] ? ' w-12 bg-gray-200' : ''
                    }`}
                    style={{ height: '375px' }}
                  >
                    {column.rotate && <div className='header-background'></div>}
                    <div className="header-content flex items-end">
                      {!hiddenColumns[column.id] && <span>{column.render('Header')}</span>}
                      {column.canGroupBy && column.grouping && !hiddenColumns[column.id] && (
                        <div
                          onClick={() => handleGroupBy(column.id)}
                          className="cursor-pointer ml-2"
                        >
                          {column.isGrouped ? (
                            <Layers className="inline text-black font-bold" size={18} />
                          ) : (
                            <Layers className="inline text-black opacity-40" size={16} />
                          )}
                        </div>
                      )}
                      {column.canSort && !hiddenColumns[column.id] && (
                        <div className="cursor-pointer sort ml-2" {...column.getSortByToggleProps()}>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? <AArrowDown className="inline text-black font-bold" size={17} />
                              : <AArrowUp className="inline text-black font-bold" size={17} />
                            : <AArrowUp className="inline text-black opacity-40" size={16} />}
                        </div>
                      )}
                      {column.visibility && (
                        <div
                          onClick={() => toggleColumnVisibility(column.id)}
                          className="cursor-pointer ml-2"
                        >
                          {hiddenColumns[column.id] ? (
                            <EyeOff className="inline text-black font-bold" size={18} />
                          ) : (
                            <Eye className="inline text-black opacity-40" size={16} />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          
          <tbody {...getTableBodyProps()} className="bg-white">
            {rows.map((row) => {
              prepareRow(row);
              return (
                <Fragment key={row.id}>
                  {row.isGrouped ? (
                    <tr>
                      <td colSpan={columns.length} className="p-2 cursor-pointer font-semibold">
                        <span
                          {...row.getToggleRowExpandedProps()}
                          className="flex items-center"
                        >
                          {row.isExpanded ? (
                            <ChevronUp className="mr-2" />
                          ) : (
                            <ChevronDown className="mr-2" />
                          )}
                          {row.groupByVal} (x{row.subRows.length})
                        </span>
                      </td>
                    </tr>
                  ) : (
                    <tr {...row.getRowProps()} className="border-b border-gray-200 even:bg-gray-100">
                      {row.cells.map((cell) => (
                        <td 
                          {...cell.getCellProps()} 
                          className={`text-left ${hiddenColumns[cell.column.id] ? 'bg-gray-200 w-12' : ''}`}
                        >
                          {!hiddenColumns[cell.column.id] && cell.render('Cell')}
                        </td>
                      ))}
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {columns.filter(col => col.tooltip).map(col => (
        rows.map(row => {
          const tooltipId = `tooltip-${generateHash(`${row.id}-${col.Header}`)}`;
          return (
            <Tooltip
              key={tooltipId}
              id={tooltipId}
              place='top-end'
              offset={20}
              className="z-10 max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg"
              classNameArrow="!border-t-gray-200"
            />
          );
        })
      ))}
    </div>
  );
}