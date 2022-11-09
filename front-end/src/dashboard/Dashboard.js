import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { Route, Switch, useHistory } from "react-router-dom";
import New from "./New";
import ReservationsDisplay from "./ReservationsDisplay";
import { today, previous, next } from "../utils/date-time";
const axios = require("axios").default; //Added "default" d/t changed module export syntax with post 1.0 version per Axios's issues page

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const todaysDate = today()
  const [dateToDisplay, setDateToDisplay] = useState(todaysDate);
  const history = useHistory();
  useEffect(loadDashboard, [date, dateToDisplay]);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

  async function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    console.log("about to listReservations... dateToDisplay:", dateToDisplay)
    listReservations({ dateToDisplay }, abortController.signal)
      .then(res => {
        console.log("listReservations running...:", res); //DEBUG
        console.log(typeof res)
        return res;
      })
      .then(res => {
        setReservations(res)
      })
      .catch(err => {
        console.log("Error occurred with listReservations...:", err)
        setReservationsError(err)
      });

    return () => abortController.abort();
  }

  const handleDateChange = (e) => { //Need to check if handler can accept event and id parameters'
    e.preventDefault()
    console.log("Date change btn pressed...")
    const id = e.target.id;
    switch (id) {
      case "prev":
        console.log("Previous btn pressed...")
        setDateToDisplay(previous(dateToDisplay));
        history.push(`?date=${previous(dateToDisplay)}`)
        break;
      case "today":
        console.log("Today btn pressed...")
        setDateToDisplay(todaysDate);
        history.push("")
        break;
      case "next":
        console.log("Next btn pressed...")
        setDateToDisplay(next(dateToDisplay));
        history.push(`?date=${next(dateToDisplay)}`)
        break;
      default:
        console.log("Everything is terrible and something awful has happened with the date");
    }
  }

  const testAxios = async (e) => {
    console.log("testAxios button pressed!");
    console.log(`GET request to: ${API_BASE_URL}/reservations?date=${dateToDisplay}`)
    axios.get(`${API_BASE_URL}/reservations?date=${dateToDisplay}`)
      .then(res => console.log(res))
  }

  return (
    <main>
      <Switch>
        <Route exact={true} path="/dashboard">
          <h1>Dashboard</h1>
          <div className="d-md-flex mb-3">
            <h4 className="mb-0">Reservations for {dateToDisplay}</h4>
          </div>
          <button id="testAxios" type="button" className="btn btn-secondary" onClick={testAxios}>Test Axios GET Request</button>
          <button id="prev" type="button" className="btn btn-primary" onClick={handleDateChange}>Previous</button>
          <button id="today" type="button" className="btn btn-primary" onClick={handleDateChange}>Today</button>
          <button id="next" type="button" className="btn btn-primary" onClick={handleDateChange}>Next</button>
          <ErrorAlert error={reservationsError} />
          <ReservationsDisplay reservations={reservations} />
          {JSON.stringify(reservations)} {/* DEBUG */}
        </Route>
        <Route exact={true} path="/reservations/new">
          <New />
        </Route>
      </Switch>
    </main>
  );
}

export default Dashboard;
