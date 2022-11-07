import React, { useState } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import New from "../dashboard/New";
import { today, previous, next } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const todaysDate = today()
  const [dateToDisplay, setDateToDisplay] = useState(todaysDate);

  const handleDateChange = (e, id) => {
    e.preventDefault(); //Need this? If state stays after refresh can remove? Need to trigger refresh then?
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
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={dateToDisplay} handleDateChange={handleDateChange} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <New />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
