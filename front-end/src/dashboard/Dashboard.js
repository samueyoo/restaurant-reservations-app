import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { Route, Switch, Link, useHistory } from "react-router-dom";
import New from "./New";
import ReservationsDisplay from "./ReservationsDisplay";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";
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

  return (
    <main>
      <Switch>
        <Route exact={true} path="/dashboard">
          <h1>Dashboard</h1>
          <div className="d-md-flex mb-3">
            <h4 className="mb-0">Reservations for {Date()}</h4>
          </div>
          <button type="button" className="btn btn-primary">Previous</button>
          <button type="button" className="btn btn-primary">Today</button>
          <button type="button" className="btn btn-primary">Next</button>
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
