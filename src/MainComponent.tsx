import * as React from "react";
import {ReactNode} from "react";
import dataService, {ShopItem} from "./DataService";
import "./home.scss";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {ShopItemComponent} from "./ShopItemComponent";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";


interface MainComponentState {

    items: ShopItem[];

    searchBarValue: string;

}

export class Main extends React.Component<{}, MainComponentState> {


    constructor(props: Readonly<{}>) {
        super(props);
        this.state = {
            items: [],
            searchBarValue: ""
        };


        dataService.getShopItems().then(value => {
            this.setState({
                ...this.state,
                items: value
            });
        });

    }


    private arraySplit<T>(array: T[], splitSize: number = 4): T[][] {
        let items: T[][] = [];

        let currentItems: T[] = [];
        items.push(currentItems);

        for (let i = 0; i < array.length; i++) {
            if (i > (splitSize - 1) && i % splitSize === 0) {
                currentItems = [];
                items.push(currentItems);
            }

            currentItems.push(array[i]);
        }
        return items;
    }

    componentDidMount(): void {
        let items: ShopItem[] = [];


        for (let i = 0; i < 20; i++) {
            items.push(new ShopItem(0, `House ${i}`, "https://specials-images.forbesimg.com/imageserve/1026205392/960x0.jpg?fit=scale", 10));
        }

        // this.setState({
        //     items: this.arraySplit(items)
        // });

    }

    changeHandler(newValue: string) {
        this.setState({
            ...this.state,
            searchBarValue: newValue
        });
    }

    clickHandler() {
        dataService.getShopItems(this.state.searchBarValue).then(value => {
            this.setState({
                searchBarValue: "",
                items: value
            });
        });
    }

    render(): ReactNode {
        return (
            <div>
                <InputGroup className="mb-3">
                    <FormControl aria-describedby="basic-addon1"
                                 value={this.state.searchBarValue}
                                 onKeyPress={
                                     (event: any) => {
                                         if (event.key === "Enter") {
                                             this.clickHandler();
                                         }
                                     }
                                 }
                                 onChange={(event: any) => this.changeHandler((event.target as any).value)}/>
                    <InputGroup.Append>
                        <Button variant="outline-secondary" onClick={() => this.clickHandler()}>Найти</Button>
                    </InputGroup.Append>
                </InputGroup>

                <Container>
                    {
                        this.arraySplit(this.state.items).map(line => {
                            return (
                                <Row className="mb-2">
                                    {
                                        line.map(shopItem => {
                                            return (<Col md="3" xs="12">
                                                    <ShopItemComponent item={shopItem}/>
                                                </Col>
                                            )
                                        })
                                    }
                                </Row>
                            )
                        })
                    }
                </Container>
            </div>
        );
    }
}

export default Main;