import * as React from "react";
import {ReactNode} from "react";
import dataService from "./DataService";
import {InputComponent} from "./InputComponent";
import {RouteComponentProps} from "react-router";

class TodoItem {
    id: number;
    author: string;
    text: string;
    date: Date;

    constructor(id: number, author: string, text: string, date: Date) {
        this.id = id;
        this.author = author;
        this.text = text;
        this.date = date;
    }
}


interface HomeState {

    items: TodoItem[];

}

export interface HomePageProps extends RouteComponentProps {

}
export class Home extends React.Component<HomePageProps, HomeState> {

    constructor(props: Readonly<HomePageProps>) {
        super(props);
        this.state = {
            items: []
        };
        dataService.getTodoItems().then(value => {
            this.setState({
                items: value
            });
        });
    }

    private async onNewTodoHandle(title: string) {
        let currentUser = dataService.currentUser;

        if (!dataService.isUserAuthorized() || currentUser == null) {
            this.props.history.push("/login");
            return
        }

        // @ts-ignore

        let todoItem = new TodoItem(-1, currentUser.login, title, new Date());

        // здесь надо сохранять новый item

        const {id} = await dataService.saveItem(todoItem);
        todoItem.id = id;
            this.setState({
                items: [...this.state.items, todoItem],});
    }

    // здесь надо удалять item
    private async onItemDelete(id: number) {
            await dataService.deleteItem(id);
            const items_list: TodoItem [] = this.state.items.filter((item) => item.id !== id);
            this.setState({
                items : items_list
            });
    }

    private async logout() {
        // здесь сделать разлогин
        await dataService.logout();
        const history = this.props.history;
        history.push("/login");
    }

    render(): ReactNode {
        return (
            <div className="App">

                <nav className="navbar navbar-expand-lg sticky-top navbar-dark bd-navbar">
                    <a className="navbar-brand" href="#">Заметки</a>
                    <div className="navbar-text">
                    {dataService.currentUser && dataService.currentUser.login}
                    </div>
                    <div id="navbarNavDropdown" className="navbar-collapse collapse">
                        <ul className="navbar-nav mr-auto">

                        </ul>
                        <ul className="navbar-nav">
                            <li className="nav-item text-nowrap">
                                <div className="btn btn-info" onClick={e => this.logout()}>Выход</div>
                            </li>
                        </ul>
                    </div>
                </nav>

                <main className="py-md-3 pl-md-5">

                    <div className="container">

                        <InputComponent onNewTodoCreated={title => this.onNewTodoHandle(title)}/>

                        <div id="items-container">
                            {this.state.items.map(todoItem => {
                                return (
                                    <div className="card" key={todoItem.id}>
                                        <div className="d-flex p-2 bd-highlight justify-content-between">
                                            <h5 className="mb-1">{todoItem.text}</h5>
                                            <div className="task-date">{todoItem.date.toLocaleString()}</div>
                                            <button className="btn btn-danger delete-button w-50" type="button"
                                                    onClick={() => {
                                                        this.onItemDelete(todoItem.id)
                                                    }}
                                            >Удалить
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                    </div>
                </main>

            </div>
        );
    }
}

export default Home;
