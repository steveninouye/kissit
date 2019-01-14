import React from 'react';
import { Switch, Route } from 'react-router-dom';

const Router = () => {
  return (
    <>
      <Switch>
        {/* <Route exact path="/" component={LandingPage} />
        <Route path="/plans/:planId" component={PlanShowContainer} />
        <Route path="/city-not-found" component={NoResultFound} />

        <Route path="/schedule" component={ItinerarySchedule} />
        <Route path="/map/:planId" component={PlanMapContainer} />
        <AuthRoute path="/plans" component={PlansIndex} /> */}
      </Switch>
    </>
  );
};
export default Router;
