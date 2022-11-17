import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ErrorAlert from "../layout/ErrorAlert";
import styles from "../style/styleSheet.module.css";

function NewTable() {
    const [formData, setFormData] = useState();
    const [err, setErr] = useState();
    const history = useHistory();
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

    function handleChange({ target }) {
        setFormData({
            ...formData,
            [target.name]: target.value
        })
    }

    async function handleNewTable(e) {
        e.preventDefault();
        const controller = new AbortController();
        const { table_name, capacity } = formData;
        try {
            await axios.post(`${API_BASE_URL}/tables`, {
                data: {
                    table_name: table_name,
                    capacity: Number(capacity)
                }
            }, { signal: controller.signal })
            history.push("/dashboard")
        } catch (error) {
            if (error.name !== "CanceledError") setErr(error);
        }
        return () => {
            controller.abort();
        }
    }

    return (
        <div>
            { err && <ErrorAlert error={err} />}

            <h1 className={styles.dashboardHeader}>
                Create a New Table
            </h1>

            <form onSubmit={handleNewTable} className={styles.dashboardHeader}>
                <label>
                    Table Name: 
                    <input
                        name="table_name"
                        type="text"
                        id="table_name"
                        placeholder="Table Name"
                        minLength={2}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </label>
                <br />
                <label>
                    Table Capacity: 
                    <input
                        name="capacity"
                        type="number"
                        id="capacity"
                        placeholder="Max number of seats"
                        min={1}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </label>
                <br />
                <button type="button" className="btn btn-secondary" style={{"marginRight": 5}} onClick={() => {
                    history.goBack();
                }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

        </div>
    )
}

export default NewTable;