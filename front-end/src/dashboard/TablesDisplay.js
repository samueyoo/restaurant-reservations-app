import React from "react";
import TableCard from "./TableCard";
import styles from "../style/styleSheet.module.css";

function TablesDisplay({ tables, setTables, setError, reservations, setReservations, loadDash }) {
    //console.log("TablesDisplay; tables:", tables)
    let tableCards = "Loading..." //Keep state checks to avoid errors? May remove.
    if (Array.isArray(tables)) {
        tableCards = tables.map(table => {
            return (
                <TableCard key={table.table_id} table={table} setTables={setTables} setError={setError} reservations={reservations} setReservations={setReservations} loadDash={loadDash} />
            )
        })
    }

    return (
        <div className={styles.tablesDisplay}>
            <h3 style={{padding: "5px"}}>Tables</h3>
            {tableCards}
        </div>
    )
}

export default TablesDisplay;