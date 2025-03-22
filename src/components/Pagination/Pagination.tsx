import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import React from "react";

interface CardFooterWithPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const CardFooterWithPagination: React.FC<CardFooterWithPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6">
      {/* Mobile view */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={handlePreviousPage}
          className="text-black text-sm font-medium"
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="h-5 w-5 inline-block mr-2" />
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="text-black text-sm font-medium"
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRightIcon className="h-5 w-5 inline-block ml-2" />
        </button>
      </div>

      {/* Desktop view */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <p className="text-sm text-gray-700 ">
          Page <span className="font-bold">{currentPage}</span> sur{" "}
          <span className="font-bold">{totalPages}</span>
        </p>
        <nav className="flex items-center gap-4 justify-center">
          {/* Previous Button */}
          <button
            onClick={handlePreviousPage}
            className="text-gray-700 text-sm font-medium px-4 py-2"
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-5 w-5 inline-block" />
            <span className="ml-1">Previous</span>
          </button>

          {/* Page Number Buttons */}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => onPageChange(index + 1)}
              className={`px-4 py-2 border text-sm font-medium transition-colors duration-200 ${
                currentPage === index + 1
                  ? "bg-yellow-600 text-white border-yellow-600"
                  : "bg-yellow-500 text-black hover:bg-yellow-600"
              }`}
            >
              {index + 1}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={handleNextPage}
            className="text-gray-700 text-sm font-medium px-4 py-2"
            disabled={currentPage === totalPages}
          >
            <span className="mr-1">Next</span>
            <ChevronRightIcon className="h-5 w-5 inline-block" />
          </button>
        </nav>
      </div>
    </div>
  );
};

export default CardFooterWithPagination;
