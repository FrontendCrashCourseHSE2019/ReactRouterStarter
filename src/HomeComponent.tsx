import * as React from "react";
import {ReactNode} from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "./home.scss";
import Button from "react-bootstrap/Button";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Link, RouteComponentProps, withRouter} from "react-router-dom";
import {renderRoutes, RouteConfig} from "react-router-config";


interface HomeComponentProps extends RouteComponentProps {
    route: RouteConfig
}

export class Home extends React.Component<HomeComponentProps, {}> {


    constructor(props: Readonly<HomeComponentProps>) {
        super(props);
        // сразу переходим на главную страницу
        this.props.history.push("/home/main")
    }


    private logout() {
    }

    componentDidMount(): void {

    }

    render(): ReactNode {
        return (
            <div className="App">

                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand className="brand">eShop</Navbar.Brand>
                    <Navbar.Collapse>
                        <Nav className="mr-auto"/>
                        <Nav>
                            <Nav.Item className="mr-2">
                                <Link to="/home/cart">
                                    <Button variant="outline-danger">
                                        <FontAwesomeIcon icon="shopping-cart"/>Cart
                                    </Button>
                                </Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Button variant="outline-primary" onClick={() => this.logout()}>Sign out</Button>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                <main className="py-md-3 px-md-5">

                    {renderRoutes(this.props.route.routes)}

                </main>

            </div>
        );
    }
}

// нужно для всех компонент, у которых должны быть пути
export default withRouter(Home);