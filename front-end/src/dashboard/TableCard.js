import React, { useState } from "react";
import axios from "axios";

function TableCard({ table, setTables, setError, reservations, setReservations, loadDash }) {
    const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

    async function handleConfirm(e) {
        e.preventDefault();
        if (!window.confirm("Is this table ready to seat new guests? This cannot be undone.")) {
            return 
        }

        //Below delete request runs the unassign service, updating the table's FK to null
            //Returns a list of all reservations to setTables with
        await axios.delete(`${API_BASE_URL}/tables/${table.table_id}/seat`)
            .then(res => {
                return res.data.data;
            })
            .then(data => setTables(data))
            .catch(error => {
                setError(error);
            });
        loadDash();
    }

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{table.table_name} {table.table_id}</h5>
                <p data-table-id-status={table.table_id} className="card-test">{table.reservation_id ? "occupied" : "Free"}</p>
            </div>
            {table.reservation_id ? <button data-table-id-finish={table.table_id} className="btn btn-primary" onClick={handleConfirm}>Finish</button> : null}
        </div>
    )
}

export default TableCard;