import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import New from "./New";
import ReservationsDisplay from "./ReservationsDisplay";
import { today, previous, next } from "../utils/date-time";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TablesDisplay from "./TablesDisplay";
const axios = require("axios").default; //Added "default" d/t changed module export syntax with post 1.0 version per Axios's issues page

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const dateQuery = new URLSearchParams(useLocation().search).get("date");
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const todaysDate = dateQuery ? dateQuery : today();
  const [date, setDate] = useState(todaysDate);
  const history = useHistory();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

  useEffect(() => {
    const abortControllerPromise = loadDashboard()
    return async () => {
      const abortController = await abortControllerPromise;
      console.log("aborted")
      abortController.abort()
    };
  }, [date]);

  async function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    await axios.get(`${API_BASE_URL}/reservations?date=${dateQuery ? dateQuery : date}`, { signal: abortController.signal })
      .then(res => {
        return res.data.data;
      })
      .then(res => {
        setReservations(res)
      })
      .catch(err => {
        setReservationsError(err)
      });
    
    await axios.get(`${API_BASE_URL}/tables`, { signal: abortController.signal })
        .then(res => setTables(res.data.data))
        .catch(error => setReservationsError(error));

    console.log("loadDashboard(); loaded!")
    return abortController;
  }

  const handleDateChange = (e) => {
    e.preventDefault()
    const id = e.target.id;
    switch (id) {
      case "prev":
        setDate(previous(date));
        history.push(`?date=${previous(date)}`)
        break;
      case "today":
        setDate(todaysDate);
        history.push("")
        break;
      case "next":
        setDate(next(date));
        history.push(`?date=${next(date)}`)
        break;
      default:
        setReservationsError({ error: { message: "Something has gone wrong with the date!"}});
    }
  }

  return (
    <main>
      <Switch>
        <Route exact={true} path="/dashboard">
          <h1>Yoo's Stews</h1>
          <div className="d-md-flex mb-3">
            <h4 className="mb-0">Reservations for {dateQuery ? dateQuery : date}</h4>
          </div>
          <button id="prev" type="button" className="btn btn-primary" onClick={handleDateChange}>Previous</button>
          <button id="today" type="button" className="btn btn-primary" onClick={handleDateChange}>Today</button>
          <button id="next" type="button" className="btn btn-primary" onClick={handleDateChange}>Next</button>
          <ErrorAlert error={reservationsError} />

          <Container>
            <Row>
              <Col><ReservationsDisplay reservations={reservations} loadDash={loadDashboard} /></Col>
              <Col><TablesDisplay tables={tables} setTables={setTables} setError={setReservationsError} reservations={reservations} setReservations={setReservations} loadDash={loadDashboard} /></Col>
              
            </Row>
          </Container>
        </Route>
        <Route exact={true} path="/reservations/new">
          <New />
        </Route>
      </Switch>
    </main>
  );
}

export default Dashboard;
