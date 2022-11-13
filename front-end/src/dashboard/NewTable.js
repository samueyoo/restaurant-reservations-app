import React from "react";
import { useHistory } from "react-router-dom";
//const axios = require("axios").default;

function NewTable() {
    const history = useHistory();

    function handleChange() {

    }

    function handleNewTable(e) {
        e.preventDefault();
        history.push('/dashboard');
    }

    return (
        <div>
            <h1>
                Create a New Table
            </h1>

            <form onSubmit={handleNewTable}>
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