import React from "react";
import TableCard from "./TableCard";

function TablesDisplay({ tables }) {
    
    const tableCards = tables.map(table => {
        return (
            <TableCard key={table.table_id} table={table} />
        )
    })

    return (
        <div>
            <h3>Tables</h3>
            {tableCards}
        </div>
    )
}

export default TablesDisplay;