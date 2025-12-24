import { useState, useMemo, useCallback } from 'react';
import Spreadsheet from 'react-spreadsheet';

const LeadsTable = ({ headers, leads }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [colWidths, setColWidths] = useState(headers.map(() => 120));
  const [selectedCells, setSelectedCells] = useState([]);
  const leadsPerPage = 10;

  const totalPages = Math.ceil(leads.length / leadsPerPage);

  const handleMouseDown = useCallback(
    (index, e) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = colWidths[index];

      const onMouseMove = (moveEvent) => {
        const delta = moveEvent.clientX - startX;
        setColWidths((prev) => prev.map((w, i) => (i === index ? Math.max(60, startWidth + delta) : w)));
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [colWidths]
  );

  // Slice leads for current page
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * leadsPerPage;
    return leads.slice(start, start + leadsPerPage);
  }, [currentPage, leads]);

  const sheetData = useMemo(() => {
    const headerRow = headers.map((h) => ({
      value: h[1],
      readOnly: true,
      className: 'header-cell',
    }));

    const rows = paginatedLeads.map((lead, rowIndex) =>
      headers.map((h) => ({
        value: lead.data?.[h[0]] ?? lead[h[0]] ?? '',
        readOnly: true,
        className: `data-cell ${rowIndex % 2 === 0 ? 'even-row' : 'odd-row'}`,
      }))
    );

    return [headerRow, ...rows];
  }, [headers, paginatedLeads]);

  // Generate visible page numbers with ellipsis
  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = maxVisiblePages;
    } else if (currentPage >= totalPages - 2) {
      startPage = totalPages - maxVisiblePages + 1;
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="w-full           dark:bg-gray-800 dark:border-gray-700 py-10">
      {/* Table Header with Stats */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Leads</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(currentPage - 1) * leadsPerPage + 1} to {Math.min(currentPage * leadsPerPage, leads.length)} of{' '}
            {leads.length} entries
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
        </div>
      </div>

      {/* Spreadsheet Container */}
      <div className="overflow-auto max-h-125 relative">
        <div className="inline-block min-w-full">
          <Spreadsheet
            data={sheetData}
            className="enhanced-spreadsheet"
            hideRowIndicators
            hideColumnIndicators
            onSelect={setSelectedCells}
          />
          {/* Resize handles */}
          <div className="absolute top-0 left-0 h-full flex pointer-events-none">
            {colWidths.map((w, idx) => (
              <div key={idx} className="relative h-full" style={{ width: w }}>
                <div
                  onMouseDown={(e) => handleMouseDown(idx, e)}
                  className="absolute right-0 top-0 h-full w-2 cursor-col-resize bg-transparent hover:bg-blue-500 z-10 pointer-events-auto transition-colors duration-200"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>
        </div>

        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) =>
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  page === currentPage
                    ? 'bg-blue-600 text-white  '
                    : 'text-gray-700 dark:text-gray-300 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </button>
        </div>
      </div>

      {/* Enhanced Styling */}
      <style jsx global>{`
        .enhanced-spreadsheet {
          font-size: 0.75rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .enhanced-spreadsheet .Spreadsheet__cell {
          padding: 6px 8px !important;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          border-right: 1px solid #e5e7eb;
          border-bottom: 1px solid #e5e7eb;
          transition: background-color 0.15s ease;
        }

        .enhanced-spreadsheet .Spreadsheet__cell:hover {
          background-color: #ffffff;
        }

        .enhanced-spreadsheet .Spreadsheet__header {
          display: none;
        }

        /* Header row styling */
        .enhanced-spreadsheet .Spreadsheet__row:first-child .Spreadsheet__cell {
          font-weight: 700;
          background-color: #ffffff;
          color: #000000;
          position: sticky;
          top: 0;
          z-index: 5;
          border-bottom: 2px solid #e5e7eb;
        }

        /* Alternating row colors */
        .enhanced-spreadsheet .even-row {
          background-color: #ffffff;
        }

        .enhanced-spreadsheet .odd-row {
          background-color: #ffffff;
        }

        /* Selected cell styling */
        .enhanced-spreadsheet .Spreadsheet__cell--selected {
          background-color: #ffffff !important;
          border: 2px solid #3b82f6 !important;
        }

        /* Focus state */
        .enhanced-spreadsheet .Spreadsheet__cell:focus {
          outline: none;
          box-shadow: inset 0 0 0 2px #3b82f6;
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
          .enhanced-spreadsheet .Spreadsheet__cell {
            border-color: #374151;
            color: #000000;
          }

          .enhanced-spreadsheet .Spreadsheet__cell:hover {
            background-color: #ffffff;
          }

          .enhanced-spreadsheet .Spreadsheet__row:first-child .Spreadsheet__cell {
            background-color: #ffffff;
            color: #000000;
            border-color: #374151;
          }

          .enhanced-spreadsheet .even-row {
            background-color: #ffffff;
          }

          .enhanced-spreadsheet .odd-row {
            background-color: #ffffff;
          }

          .enhanced-spreadsheet .Spreadsheet__cell--selected {
            background-color: #000000 !important;
            border-color: #60a5fa !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LeadsTable;
