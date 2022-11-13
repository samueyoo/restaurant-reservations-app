import React from "react";

function TableCard({ table }) {
    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{table.table_id}</h5>
                <p data-table-id-status={table.table_id} className="card-test">Free or Occupied -- pull from tables in db and check if linked id (reservation) exists?</p>
            </div>
        </div>
    )
}

export default TableCard;