import './scss/styles.scss';
import { BasketData } from './components/models/Basket.ts';
import { Buyer } from './components/models/Buyer.ts'
import { Products } from './components/models/Product.ts';
import { WebLarekAPI } from './components/WebLarekAPI.ts';
import { API_URL } from './utils/constants.ts';
import { apiProducts } from './utils/data.ts';
import { Api } from './components/base/Api.ts';

const api = new Api(API_URL)
const basketTest = new BasketData();
const buyerTest = new Buyer();
const productTest = new Products();
const wLarekApi = new WebLarekAPI(api)
const firstProduct = apiProducts.items[0];
const secondProduct = apiProducts.items[1];

//Тест Каталога

productTest.setItems(apiProducts.items);
console.log("Массив товаров из каталога: ", productTest.getItems());

productTest.setPreview(firstProduct);        
console.log("Получение товара для отображения: ", productTest.getPreview());

console.log("получение товара по его id: ", productTest.getItemById(apiProducts.items[0].id));

//Тест Корзины
basketTest.addItem(firstProduct);
basketTest.addItem(secondProduct);

console.log("получение массива товаров, которые находятся в корзине: ", basketTest.getItems());

console.log("получение стоимости всех товаров в корзине: ", basketTest.getPrice());

console.log("получение количества товаров в корзине: ", basketTest.getCountProduct());

console.log("проверка наличия товара в корзине по его id (firstProduct.id): ", basketTest.inBasket(firstProduct.id));

console.log("проверка наличия товара в корзине по несуществующему id: ", basketTest.inBasket("non-existent-id"));

basketTest.clear();
console.log("Массив после очистки корзины: ", basketTest.getItems());

//Тест "Покупателя"

buyerTest.setAddress("Казань, улица Мира");
buyerTest.setPayment("card");
console.log("После заполнения адреса и оплаты:", buyerTest.getBuyerData());

console.log("Валидация после заполнения:", {
    address: buyerTest.validateAddress(),
    payment: buyerTest.validatePayment(),
});

buyerTest.setEmail("123@email.com");
buyerTest.setPhone("+7777434343");
console.log("После добавления контактов:", buyerTest.getBuyerData());

console.log("Финальная валидация перед очисткой:", buyerTest.validateBuyerData());

buyerTest.clear();
console.log("После очистки:", buyerTest.getBuyerData());

// Тест API

(async () => {
    try {
        const serverProducts = await wLarekApi.getProducts();
        productTest.setItems(serverProducts);
        console.log("Товары с сервера загружены, количество:", productTest.getItems().length);
         const order = {
            ...buyerTest.getBuyerData(),
            items: basketTest.getItems().map(i => i.id),
            total: basketTest.getPrice()
        };
        
        const result = await wLarekApi.orderProducts(order);
        console.log("Заказ отправлен, ответ сервера:", result);
    } catch (err) {
        console.error("API ошибка:", err);
    }
})();