export interface User {
    login: string;
    password: string;
}

export class ShopItem {

    id: number;
    title: string;
    image: string;
    price: number;

    constructor(id: number, title: string, image: string, price: number) {
        this.id = id;
        this.title = title;
        this.image = image;
        this.price = price;
    }

}

interface Cart {
    login: string;
    list: number[];
}

// Класс для работы с сервером
class DataService {

    private static DB_URL = "http://localhost:4000";

    public currentUser: User | null;

    constructor() {
        this.currentUser = null;
    }

    /**
     * Авторизован ли пользователь?
     */
    public isUserAuthorized() {
        return this.currentUser != null;
    }

    /**
     * Авторизация
     * @param userLogin логин
     * @param password пароль
     */
    public async login(userLogin: string, password: string) {
        let userResponsePromise: Promise<Response> = fetch(`${DataService.DB_URL}/user`);

        let response: Response = await userResponsePromise;

        let jsonPromise: Promise<User[]> = (response).json();

        let users: User[] = await jsonPromise;

        let foundUsers = users.filter(value => {
            return value.login === userLogin;
        });

        if (foundUsers.length === 0) {
            this.currentUser = null;
            return;
        }

        let foundUser = foundUsers[0];

        if (foundUser.password === password) {
            this.currentUser = foundUser;
            return;
        }
        this.currentUser = null;
    }

    /**
     * Получить все ShopItem'ы пользователя
     */
    public async getShopItems(filter: string = ".*"): Promise<ShopItem[]> {
        // if (this.currentUser == null) {
        //     return Promise.reject("User is not authorized");
        // }

        let todoResponsePromise: Promise<Response> = fetch(`${DataService.DB_URL}/shopItem?title_like=${filter}`);

        let response: Response = await todoResponsePromise;

        let jsonPromise: Promise<ShopItem[]> = (response).json();

        return await jsonPromise;
    }


    public async getCart(): Promise<ShopItem[]> {
        let cartResponsePromise: Promise<Response> = fetch(`${DataService.DB_URL}/cart?login=admin`);

        let response: Response = await cartResponsePromise;

        let jsonPromise: Promise<Cart[]> = (response).json();
        let cart: Cart = (await jsonPromise)[0];

        let shopItems = [];

        for (let shopItemId of cart.list) {
            let tmp: ShopItem[] = await ((await fetch(`${DataService.DB_URL}/shopItem?id=${shopItemId}`)).json());
            let shopItem = tmp[0];
            shopItems.push(shopItem);
        }

        return shopItems;
    }

    /**
     * Добавить новый TodoItem на сервер
     * @param newItem новый TodoItem
     */
    // public async saveItem(newItem: TodoItem): Promise<TodoItem> {
    //     if (this.currentUser == null) {
    //         return Promise.reject("User is not authorized");
    //     }
    //
    //     delete newItem.id;
    //     let postPromise = fetch(`${DataService.DB_URL}/todo`, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         method: "POST",
    //         body: JSON.stringify(newItem)
    //     });
    //     return await (await postPromise).json();
    // }

    /**
     * Удалить TodoItem
     * @param id идентификатор item'a
     * @returns true, если получилось удалить
     */
    public async deleteItem(id: number): Promise<boolean> {
        if (this.currentUser == null) {
            return Promise.reject("User is not authorized");
        }

        let deletePromise = fetch(`${DataService.DB_URL}/todo/${id}`, {
            method: "DELETE"
        });

        return (await deletePromise).ok;
    }

}

let dataService = new DataService();
export default dataService;