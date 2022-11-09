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
function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const todaysDate = today()
  const [date, setDate] = useState(todaysDate);
  const history = useHistory();
  useEffect(loadDashboard, [date]);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

  async function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    console.log("about to listReservations... date:", date)
    listReservations({ date }, abortController.signal)
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

  const handleDateChange = (e) => {
    e.preventDefault()
    console.log("Date change btn pressed...")
    const id = e.target.id;
    switch (id) {
      case "prev":
        console.log("Previous btn pressed...")
        setDate(previous(date));
        history.push(`?date=${previous(date)}`)
        break;
      case "today":
        console.log("Today btn pressed...")
        setDate(todaysDate);
        history.push("")
        break;
      case "next":
        console.log("Next btn pressed...")
        setDate(next(date));
        history.push(`?date=${next(date)}`)
        break;
      default:
        console.log("Everything is terrible and something awful has happened with the date");
    }
  }

  const updateDateAfterSubmit = (resDate) => {
    setDate(resDate);
  }

  const testAxios = async (e) => {
    console.log("testAxios button pressed!");
    console.log(`GET request to: ${API_BASE_URL}/reservations?date=${date}`)
    axios.get(`${API_BASE_URL}/reservations?date=${date}`)
      .then(res => console.log(res))
  }

  return (
    <main>
      <Switch>
        <Route exact={true} path="/dashboard">
          <h1>Dashboard</h1>
          <div className="d-md-flex mb-3">
            <h4 className="mb-0">Reservations for {date}</h4>
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
          <New setDate={updateDateAfterSubmit} />
        </Route>
      </Switch>
    </main>
  );
}

export default Dashboard;
