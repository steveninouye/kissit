import React from 'react';
import { Switch, Route } from 'react-router-dom';

const Router = () => {
  return (
    <>
      <Switch>
        <Route path="/shop" component={Shop} />
        <Route path="/preview" component={Preview} />
        <Route path="/search" component={Search} />
        <Route path="/" exact component={Home} />
        <Route path="*" component={NotFound} />
      </Switch>
    </>
  );
};
export default Router;
