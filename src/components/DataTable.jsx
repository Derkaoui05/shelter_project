import React, { useMemo, useState, useEffect, Fragment } from 'react';
import { useTable, useSortBy, useExpanded, useGroupBy, useGlobalFilter } from 'react-table';
import { ChevronDown, ChevronUp, Layers, AArrowDown, AArrowUp } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import SearchInput from './SearchInput';
import columnSchema from '../Schema';
import tableData from '../../data.json';

const generateHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

export default function DataTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const data = useMemo(() => tableData, []);

  const columns = useMemo(() => {
    return columnSchema.map((col) => ({
      Header: col.Title,
      accessor: col.Title,
      disableSortBy: !col.sorting,
      rotate: col.rotate,
      grouping: col.grouping,
      tooltip: col.tooltip,
      Cell: ({ value, row }) => {
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

        const tooltipId = col.tooltip ? `tooltip-${generateHash(`${row.id}-${col.Title}`)}` : '';
        const tooltipContent = col.tooltip ? `
         <div class="p-2">
         <h1 class="mb-6 text-lg font-semibold"> ${row.values['COUNTRY'] || 'notFound'} ${row.values['YEAR'] || 'notFound'} - ${row.values['CRISIS'] || 'notFound'}</h1>
            ${row.original.DESCRIPTION ? `<p class="mb-1 font-semibold whitespace-nowrap">Description: <span class="font-normal">${row.original.DESCRIPTION}</span></p>` : '<p>no descriprtion available</p>'}
            ${row.original.KEYWORDS ? `
              <p class="mb-1 font-semibold">Keywords: <span class='font-normal'>${row.original.KEYWORDS}</span></p>
            ` : 'no keywords available'}
          </div>
        ` : '';

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
      },
    }));
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
    toggleGroupBy,
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

  if (!data || data.length === 0) {
    return <div className="text-center text-red-600 font-bold p-4">NO DATA AVAILABLE😑</div>;
  }

  return (
    <div className="space-y-4">
      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search Here..."
      />
      <div className="relative mt-12 overflow-x-auto shadow-xl shadow-slate-400">
        <table {...getTableProps()} className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className={`px-6 py-2 text-gray-800 align-bottom whitespace-nowrap ${column.rotate ? 'rotate' : 'starter'}`}
                    style={{ height: '375px' }}
                  >
                    {column.rotate && <div className='header-background'></div>}
                    <div className="header-content flex items-end">
                      <span>{column.render('Header')}</span>
                      {column.canGroupBy && column.grouping && (
                        <div
                          onClick={() => handleGroupBy(column.id)}
                          className="cursor-pointer ml-2"
                        >
                          {column.isGrouped ? (
                            <Layers className="inline text-blue-600" size={16} />
                          ) : (
                            <Layers className="inline text-black opacity-60" size={16} />
                          )}
                        </div>
                      )}

                      {column.canSort && (
                        <div className="cursor-pointer sort ml-2" {...column.getSortByToggleProps()}>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? <AArrowDown className="inline text-blue-600" size={17} />
                              : <AArrowUp className="inline text-blue-600" size={17} />
                            : <AArrowUp className="inline text-black opacity-60" size={16} />}
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
                    <tr {...row.getRowProps()} className="border-b border-gray-200 odd:bg-gray-100 even:bg-gray-50">
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()} className="text-left">
                          {cell.render('Cell')}
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
              offset={5}
              className="z-10 max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg"
              classNameArrow="!border-t-gray-200"
            />
          );
        })
      ))}
    </div>
  );
}