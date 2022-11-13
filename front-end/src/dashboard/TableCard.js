import React from "react";

function TableCard({ table }) {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{table.table_name} {table.table_id}</h5>
                <p data-table-id-status={table.table_id} className="card-test">{table.reservation_id ? "Occupied" : "Free"}</p>
            </div>
        </div>
    )
}

export default TableCard;