import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { Route, Switch } from "react-router-dom";
import New from "./New";
import ReservationsDisplay from "./ReservationsDisplay";
import { today, previous, next } from "../utils/date-time";

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

  useEffect(loadDashboard, [date, dateToDisplay]);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
  useEffect(() => {
    async function getRequestReservations() {
      await fetch(`${API_BASE_URL}/reservations`)
        .then(res => res.json())
        .then(console.log) //DEBUG
      //console.log(reservations)
    }
    console.log("DASHBOARD PAGE REACHED", Date())
    getRequestReservations();
    
  }, [])

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    console.log("about to listReservations...")
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

  const handleDateChange = (id) => { //Need to check if handler can accept event and id parameters
    switch (id) {
      case "prev":
        setDateToDisplay(previous(dateToDisplay));
        break;
      case "today":
        setDateToDisplay(todaysDate);
        break;
      case "next":
        setDateToDisplay(next(dateToDisplay));
        break;
      default:
        console.log("Everything is terrible and something awful has happened with the date");
    }
  }

  return (
    <main>
      <Switch>
        <Route exact={true} path="/dashboard">
          <h1>Dashboard</h1>
          <div className="d-md-flex mb-3">
            <h4 className="mb-0">Reservations for {Date()}</h4>
          </div>
          <button id="prev" type="button" className="btn btn-primary" onClick={() => {
              e.preventDefault();
              handleDateChange(this.id);
            }}>Previous</button>
          <button id="today" type="button" className="btn btn-primary" onClick={() => {
              e.preventDefault();
              handleDateChange(this.id);
            }}>Today</button>
          <button id="next" type="button" className="btn btn-primary" onClick={() => {
              e.preventDefault();
              handleDateChange(this.id);
            }}>Next</button>
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
