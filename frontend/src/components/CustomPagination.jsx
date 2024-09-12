import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fetchTotalCount } from '../Features/contacts/contactsSlice';
import { useDispatch } from 'react-redux';
import { setTotalPages } from '../Features/contacts/contactsSlice';
const CustomPagination = ({ totalPages, currentPage, handlePageChange, pageSize }) => {

    const dispatch = useDispatch()

    useEffect(() => {

        const fetchCount = async () => {
            const count = await dispatch(fetchTotalCount())
            const totalContacts = count.payload
            const totalCount = Math.ceil(totalContacts / pageSize);
            console.log(totalPages)
            dispatch(setTotalPages(totalCount))
        }

        fetchCount();
    }, [])

    // Handler for moving to the previous page
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    // Handler for moving to the next page
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    };

    // Handler for selecting a specific page
    const handlePageClick = (page) => {
        if (page !== currentPage) {
            handlePageChange(page);
        }
    };

    return (
        <div className="pagination-container">
            <button
                className="pagination-button"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
            >
                Previous
            </button>
            <div className="pagination-pages">
                {/* Generate page buttons */}
                {/* {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={`pagination-page-button ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => {
                            handlePageClick(index + 1)
                        }}
                    >
                        {index + 1}
                    </button>
                ))} */}

                <p>Page {currentPage} of {totalPages}</p>
            </div>
            <button
                className="pagination-button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

CustomPagination.propTypes = {
    totalPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    handlePageChange: PropTypes.func.isRequired,
};

export default CustomPagination;
