// src/components/Pagination/Pagination.tsx
import ListManager from '@/utils/helpers/ListManager';
import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface PaginationProps {
    listManager: ListManager<any>;
    handleNext: () => void;
    handlePrevious: () => void;
}

function Pagination({ listManager, handleNext, handlePrevious }: PaginationProps) {
    // Calculate "from" and "to" based on the current page and limit
    const fromItem = (listManager.query.page - 1) * listManager.query.limit + 1;
    const toItem = Math.min(listManager.query.page * listManager.query.limit, listManager.total);

    return (
        <div className="flex w-full justify-end mt-2 p-2  rounded-lg  mx-auto">
            <div className="flex flex-row justify-between  w-full space-y-2">
                <div className="text-xs font-medium text-gray-600">
                    Showing {fromItem} to {toItem} of {listManager.total} entries
                </div>

                <div className="flex space-x-1">
                    <button
                        onClick={handlePrevious}
                        disabled={listManager.isFirstPage()}
                        className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center ${
                            listManager.isFirstPage()
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        } transition duration-150`}
                    >
                        <FaChevronLeft className="w-4 h-4" />
                    </button>

                    <span className="px-3 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-300">
                        Page {listManager.query.page}
                    </span>

                    <button
                        onClick={handleNext}
                        disabled={listManager.isLastPage(listManager.total)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center ${
                            listManager.isLastPage(listManager.total)
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        } transition duration-150`}
                    >
                        <FaChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Pagination;
