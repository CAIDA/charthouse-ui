import React from "react";
import EventsList from "./events_list";
import {BrowserRouter, Redirect, Route, Switch, withRouter} from 'react-router-dom';
import EventDetails from "./event_details";
import PfxEventDetails from "./pfx_event_details";

class HijacksRouter extends React.Component {
    render() {
        return <Switch>
            {/* page routes */}
            <Route path='/feeds/hijacks/events/:eventType/:eventId/:pfxEventId' component={PfxEventDetails}/>
            <Route path='/feeds/hijacks/events/:eventType/:eventId' component={EventDetails}/>
            <Route path='/feeds/hijacks/events' component={EventsList}/>
        </Switch>;
    }
}

class HijacksApp extends React.Component {

    render() {
        return <BrowserRouter>
            <HijacksRouter/>
        </BrowserRouter>;
    }
}

export default withRouter(HijacksApp);
