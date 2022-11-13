import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import validateCapacity from "../utils/validateCapacity";
import TableOptions from "./TableOptions";

function ReservationSeat() {
    const [tables, setTables] = useState([]);
    const { reservation_id } = useParams();
    const [formData, setFormData] = useState();
    const [err, setErr] = useState();
    const history = useHistory();
    useEffect(loadTables, [])

    const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

    async function loadTables() {
        await axios.get(`${API_BASE_URL}/tables`)
            .then(res => setTables(res.data.data))
    }

    const mappedOptions = tables.map(table => {
        return <TableOptions key={table.table_id} table={table} />
    })

    async function handleSubmit(e) {
        e.preventDefault();

        //Pull table info from current list of tables saved under the tables state
        const tableCheck = tables.find(table => {
            console.log("formData & table.table_id:", formData, "vs", table.table_id)
            return formData.toString() === table.table_id.toString();
        })
        //Check if table already is assigned to a reservation
        if (tableCheck.reservation_id) {
            //console.log("table occupado")
            setErr({ message: "Table is already occupied" })
            return null;
        }
        //Check if the capacity is exceeded by the party size
        const checkCapacity = await validateCapacity(API_BASE_URL, reservation_id, tableCheck.capacity);
        if (checkCapacity.message) {
            //console.log("checkCapacity:", checkCapacity.message)
            setErr(checkCapacity)
            return null;
        }
        //Update the table to the existing reservation
        await axios.put(`${API_BASE_URL}/tables/${formData}/seat`, {
            data: {
                    reservation_id: reservation_id,
                    table_id: formData,
                }
        })
            .then(res => {
                if (res.error) throw new Error(res.error);
                return res;
            })
            .then(() => history.push("/dashboard"))
            .catch(error => {
                console.error(error);
                setErr(error);
            })
    }

    function handleChange({ target }) {
        console.log(target.value);
        setFormData(target.value);
    }
    
    return (
        <div>
            { err && <ErrorAlert error={err} />}

            <form onSubmit={handleSubmit}>
                <label>
                    Table number:
                    <select 
                        name="table_id"
                        onChange={handleChange}
                        required
                    >
                        {mappedOptions}
                    </select>
                </label>
                <br />
                <button type="button" className="btn btn-secondary" onClick={() => history.goBack()}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default ReservationSeat;