import React from "react";
import TableCard from "./TableCard";

function TablesDisplay({ tables, setTables, setError }) {
    //console.log("TablesDisplay; tables:", tables)
    let tableCards = "Loading..." //Keep state checks to avoid errors? May remove.
    if (Array.isArray(tables)) {
        tableCards = tables.map(table => {
            return (
                <TableCard key={table.table_id} table={table} setTables={setTables} setError={setError} />
            )
        })
    }

    return (
        <div>
            <h3>Tables</h3>
            {tableCards}
        </div>
    )
}

export default TablesDisplay;