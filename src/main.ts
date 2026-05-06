import "./scss/styles.scss";
import { BasketData } from "./components/models/Basket.ts";
import { Buyer } from "./components/models/Buyer.ts";
import { Products } from "./components/models/Product.ts";
import { WebLarekAPI } from "./components/WebLarekAPI.ts";
import { API_URL } from "./utils/constants.ts";
import { apiProducts } from "./utils/data.ts";
import { Api } from "./components/base/Api.ts";

const api = new Api(API_URL);
const basketTest = new BasketData();
const buyerTest = new Buyer();
const productTest = new Products();
const wLarekApi = new WebLarekAPI(api);
const firstProduct = apiProducts.items[0];
const secondProduct = apiProducts.items[1];

// Тест Каталога

productTest.setItems(apiProducts.items);
console.log("Массив товаров из каталога: ", productTest.getItems());

productTest.setPreview(firstProduct);
console.log("Получение товара для отображения: ", productTest.getPreview());

console.log(
  "получение товара по его id: ",
  productTest.getItemById(apiProducts.items[0].id),
);

// Тест Корзины
basketTest.addItem(firstProduct);
basketTest.addItem(secondProduct);

console.log(
  "получение массива товаров, которые находятся в корзине: ",
  basketTest.getItems(),
);

console.log(
  "получение стоимости всех товаров в корзине: ",
  basketTest.getPrice(),
);

console.log(
  "получение количества товаров в корзине: ",
  basketTest.getCountProduct(),
);

console.log(
  "проверка наличия товара в корзине по его id (firstProduct.id): ",
  basketTest.inBasket(firstProduct.id),
);

console.log(
  "проверка наличия товара в корзине по несуществующему id: ",
  basketTest.inBasket("non-existent-id"),
);

basketTest.clear();
console.log("Массив после очистки корзины: ", basketTest.getItems());

// Тест "Покупателя"

buyerTest.setAddress("Казань, улица Мира");
buyerTest.setPayment("card");
console.log("После заполнения адреса и оплаты:", buyerTest.getBuyerData());

const partialErrors = buyerTest.validate();
console.log(
  "Валидация после заполнения адреса и оплаты (без email/phone):",
  partialErrors,
);
console.log("Адрес валиден?", !partialErrors.address);
console.log("Оплата валидна?", !partialErrors.payment);
console.log("Email валиден?", !partialErrors.email);
console.log("Телефон валиден?", !partialErrors.phone);

buyerTest.setEmail("123@email.com");
buyerTest.setPhone("+7777434343");
console.log("После добавления контактов:", buyerTest.getBuyerData());

const fullErrors = buyerTest.validate();
console.log("Финальная валидация перед очисткой:", fullErrors);
console.log("Все поля валидны?", Object.keys(fullErrors).length === 0);

buyerTest.clear();
console.log("После очистки:", buyerTest.getBuyerData());

// Тест API

const orderBuyer = new Buyer();
orderBuyer.setAddress("Казань, улица Мира");
orderBuyer.setPayment("card");
orderBuyer.setEmail("123@email.com");
orderBuyer.setPhone("+7777434343");

const orderErrors = orderBuyer.validate();
if (Object.keys(orderErrors).length > 0) {
  console.error("Заказ не прошёл валидацию:", orderErrors);
} else {
  (async () => {
    try {
      const productsResponse = await wLarekApi.getProducts();
      const serverProducts = productsResponse.items;
      productTest.setItems(serverProducts);
      console.log(
        "Товары с сервера загружены, количество:",
        productTest.getItems().length,
      );

      const orderBasket = new BasketData();
      if (serverProducts.length > 0) {
        orderBasket.addItem(serverProducts[0]);
      }
      if (serverProducts.length > 1) {
        orderBasket.addItem(serverProducts[1]);
      }

      const order = {
        ...orderBuyer.getBuyerData(),
        items: orderBasket.getItems().map((i) => i.id),
        total: orderBasket.getPrice(),
      };

      console.log("Отправляемый заказ:", order);

      const result = await wLarekApi.orderProducts(order);
      console.log("Заказ отправлен, ответ сервера:", result);
    } catch (err) {
      console.error("API ошибка:", err);
    }
  })();
}
