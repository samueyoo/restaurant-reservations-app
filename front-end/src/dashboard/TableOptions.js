import React from "react";

function TableOptions({ table }) {
    return (
        <option id={table.table_id} value={table.table_id} key={table.table_id}>{table.table_name} - {table.capacity}</option>
    )
}

export default TableOptions;