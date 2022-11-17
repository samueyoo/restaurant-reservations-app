import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import validateCapacity from "../utils/validateCapacity";
import TableOptions from "./TableOptions";
import styles from "../style/styleSheet.module.css";

function ReservationSeat() {
    const [tables, setTables] = useState([]);
    const { reservation_id } = useParams();
    const [formData, setFormData] = useState();
    const [err, setErr] = useState();
    const history = useHistory();

    useEffect(() => {
        const controller = new AbortController();
        loadTables(controller);
        return () => {
            controller.abort();
        }
    }, [])

    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

    //Fetches an array of all the current tables; saves in tables state
    async function loadTables(controller) {
        try {
            const response = await axios.get(`${API_BASE_URL}/tables`, { signal: controller.signal });
            setTables(response.data.data)
        } catch (error) {
            console.log("ReservationSeat; loadTables; an error occurred!", error)
            if (error.name !== "CanceledError") setErr(err);
        }
    }

    //Create TableOptions components to display (which are just <option> tags to populate the drop-down menu)
    const mappedOptions = tables.map(table => {
        return <TableOptions key={table.table_id} table={table} />
    })

    async function handleSubmit(e) {
        e.preventDefault();
        const controller = new AbortController();

        //Pull table info from current list of tables saved under the tables state
        const tableCheck = tables.find(table => {
            console.log("formData & table.table_id:", formData, "vs", table.table_id)
            return formData == table.table_id;
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
        try {
            const response = await axios.put(`${API_BASE_URL}/tables/${formData}/seat`, {
                data: { reservation_id: reservation_id }
            }, { signal: controller.signal });
            history.push("/dashboard");
        } catch (error) {
            if (error.name !== "CanceledError") setErr(error);
        }
    }

    function handleChange({ target }) {
        console.log(target.value);
        setFormData(target.value);
    }
    
    return (
        <div>
            { err && <ErrorAlert error={err} />}
            <h1 className={styles.dashboardHeader}>
                Assign Reservation a Table
            </h1>
            <form onSubmit={handleSubmit} className={styles.dashboardHeader}>
                <label>
                    Table number:
                    <select 
                        name="table_id"
                        onChange={handleChange}
                        defaultValue="none"
                        required
                        className={styles.input}
                    >
                        <option value="none" disabled hidden>Select a Table</option>
                        {mappedOptions}
                    </select>
                </label>
                <br />
                <button type="button" className="btn btn-secondary" onClick={() => history.goBack()}>Cancel</button>
                {formData ? <button type="submit" className="btn btn-primary">Submit</button> : null}
            </form>
        </div>
    )
}

export default ReservationSeat;