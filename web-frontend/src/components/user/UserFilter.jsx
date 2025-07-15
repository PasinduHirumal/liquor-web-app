import React from 'react';

const UserFilter = ({ filter, onFilterChange, onClearFilters }) => {
    return (
        <div className="d-flex justify-content-center mb-4 gap-3 flex-wrap">
            <select
                name="isActive"
                value={filter.isActive}
                onChange={onFilterChange}
                className="form-select"
                style={{ maxWidth: 200 }}
                aria-label="Filter by Active Status"
            >
                <option value="">Filter by Active Status</option>
                <option value="true">Active ✅</option>
                <option value="false">Inactive ❌</option>
            </select>

            <select
                name="isAccountCompleted"
                value={filter.isAccountCompleted}
                onChange={onFilterChange}
                className="form-select"
                style={{ maxWidth: 250 }}
                aria-label="Filter by Account Completion"
            >
                <option value="">Filter by Account Completed</option>
                <option value="true">Completed ✅</option>
                <option value="false">Not Completed ❌</option>
            </select>

            {(filter.isActive || filter.isAccountCompleted) && (
                <button
                    className="btn btn-outline-secondary"
                    onClick={onClearFilters}
                    aria-label="Clear Filters"
                >
                    Clear Filters
                </button>
            )}
        </div>
    );
};

export default UserFilter;
