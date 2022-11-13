import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

function ReservationSeat() {
    const [tables, setTables] = useState();
    const { reservation_id } = useParams();
    const history = useHistory();
    useEffect(loadTables, [tables])

    const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

    async function loadTables() {
        axios.get(`${API_BASE_URL}/tables`) //GET request should be to tables route tho
            .then(res => setTables(res.data.data))
    }

    const mappedOptions = tables.map(table => {
        return (
            <option id={table.table_id} >{table.table_name} - {table.capacity}</option>
        )
    })

    async function handleSubmit() {

    }
    
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Table number:
                    <select 
                        name="table_id"
                        required
                    >
                        {mappedOptions}
                    </select>
                </label>
                <br />
                {JSON.stringify(tables)}
                <br />
                <button type="button" className="btn btn-secondary" onClick={() => history.goBack()}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default ReservationSeat;