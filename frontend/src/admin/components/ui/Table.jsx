import React from 'react';
import './Table.css';

const Table = ({ headers, data, renderRow, loading }) => {
  return (
    <div className="table-container">
      <table className="admin-table">
        <thead>
          <tr>
            {headers.map((h, i) => <th key={i}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={headers.length} className="t-loading">Loading...</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={headers.length} className="t-empty">No data found</td></tr>
          ) : (
            data.map((item, index) => renderRow(item, index))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
