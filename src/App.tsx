import React from 'react';
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import LoginPage from "./LoginPage";
import dataService from "./DataService";
import Home from "./HomeComponent";
import {CartComponent} from "./CartComponent";
import Main from "./MainComponent";
import {renderRoutes} from "react-router-config";

const routes = [
    {
        path: "/login",
        component: LoginPage
    },
    {
        path: "/home",
        render: (params: any) => {
            return true ? (
                <Home {...params}/>
            ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: {from: params.location}
                    }}
                />
            );
        },
        // component: Home,
        routes: [{
            path: "/home/main",
            component: Main
        }, {
            path: "/home/cart",
            component: CartComponent
        }]
    },
    {
        path: "/",
        render: ({location}: { location: any }) => {
            return (
                <Redirect
                    to={{
                        pathname: "/home"
                    }}
                />)
        }
    }
];

export default function AuthExample() {
    return (
        <Router>
            <div>
                {renderRoutes(routes)}
            </div>
        </Router>
    );
}