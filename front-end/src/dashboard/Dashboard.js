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
import styles from "../style/styleSheet.module.css";
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
  const finalDate = dateQuery ? dateQuery : date;

  useEffect(() => {
    const controller = new AbortController();
    loadDashboard(controller);
    return () => {
      console.log("cleanup", finalDate);
      controller.abort();
    }
  }, [date]);

  async function loadDashboard(controller) {
    try {
      const response = await axios.get(`${API_BASE_URL}/reservations?date=${dateQuery ? dateQuery : date}`, { signal: controller.signal })
      setReservations(response.data.data)
    } catch (error) {
      if (error.name === "CanceledError") {
        console.log("Aborted", finalDate);
      } else {
        setReservationsError(error);
      }
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/tables`, { signal: controller.signal });
      setTables(response.data.data)
    } catch (error) {
      if (error.name !== "CanceledError") setReservationsError(error);
    }
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
    <main style={{ backgroundColor: "#B4D4EE"}}>
      <Switch>
        <Route exact={true} path="/dashboard">
          <Container>
            <Row>
              <Col>
                <div style={{ textAlign: "center", backgroundColor: "#8da9c0", color: "#ffffff", borderRadius: "15px", marginTop: "15px", padding: "10px" }}>
                  <h1>Yoo's Stews</h1>
                  <h4 className="mb-0">Reservations for {dateQuery ? dateQuery : date}</h4>
                  <button id="prev" type="button" className={styles.buttonsDash} onClick={handleDateChange}>Previous</button>
                  <button id="today" type="button" className={styles.buttonsDash} onClick={handleDateChange}>Today</button>
                  <button id="next" type="button" className={styles.buttonsDash} onClick={handleDateChange}>Next</button>
                  <ErrorAlert error={reservationsError} />
                </div>
              </Col>
            </Row>

          </Container>
          <Container>
            <Row>
              <Col><ReservationsDisplay reservations={reservations} loadDash={loadDashboard} setError={setReservationsError} /></Col>
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
