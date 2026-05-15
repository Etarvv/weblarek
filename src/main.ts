import "./scss/styles.scss";
import { BasketData } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { Products } from "./components/models/Product";
import { WebLarekAPI } from "./components/WebLarekAPI";
import { EventEmitter } from "./components/base/Events";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { BasketView } from "./components/view/BasketView";
import { CardView } from "./components/view/CardView";
import { Contacts } from "./components/view/ContactView";
import { Modal } from "./components/view/Modal";
import { Order } from "./components/view/Order";
import { Gallery } from "./components/view/Gallery";
import { SuccesInfo } from "./components/view/Success";
import { Header } from "./components/view/Header";
import { IProduct, IOrder } from "./types";

//Инициализация базовых инструментов

const events = new EventEmitter();
const api = new WebLarekAPI(API_URL);

const productsModel = new Products(events);
const basketModel = new BasketData(events);
const buyerModel = new Buyer(events);

const modalContainer = ensureElement<HTMLElement>("#modal-container");
const galleryContainer = ensureElement<HTMLElement>(".gallery");
const headerContainer = ensureElement<HTMLElement>(".header");

const modal = new Modal(modalContainer, events);
const gallery = new Gallery(galleryContainer);
const header = new Header(headerContainer, events);

const basketContainer = cloneTemplate<HTMLElement>("#basket");
const basketView = new BasketView(basketContainer, events);

let orderForm: Order | null = null;
let contactsForm: Contacts | null = null;
let successView: SuccesInfo | null = null;

//Обработчики событий

//Загрузка и отображение каталога
events.on("products:changed", () => {
      const products = productsModel.getItems();
      const cardItems = products.map((product) => {
            const cardTemplate = cloneTemplate<HTMLElement>("#card-catalog");
            const card = new CardView(cardTemplate, {
                  type: "catalog",
                  onClick: () => events.emit("product:select", product),
            });
            card.title = product.title;
            card.price = product.price ?? null;
            card.image = CDN_URL + (product.image ?? "");
            card.category = product.category;
            return card.render();
      });
      gallery.catalog = cardItems;
});

//Открытие карточки в модалке
events.on("product:select", (product: IProduct) => {
      const cardTemplate = cloneTemplate<HTMLElement>("#card-preview");
      const card = new CardView(cardTemplate, {
            type: "preview",
            onClick: () => {
                  if (product.price !== null && product.price !== undefined) {
                        basketModel.addItem(product);
                        events.emit("basket:changed");
                        modal.close();
                  }
            },
      });
      card.title = product.title;
      card.price = product.price ?? null;
      card.image = CDN_URL + (product.image ?? "");
      card.category = product.category;
      card.text = product.description ?? "";
      modal.render({ content: card.render() });
});

//Обновление отображения корзины
events.on("basket:changed", () => {
      const items = basketModel.getItems();
      const total = basketModel.getPrice();
      const count = basketModel.getCountProduct();
      header.counter = count;

      const basketItems = items.map((item, index) => {
            const template = cloneTemplate<HTMLElement>("#card-basket");
            const card = new CardView(template, {
                  type: "basket",
                  onRemove: () => basketModel.delete(item.id),
            });
            card.title = item.title;
            card.price = item.price ?? null;
            card.index = index + 1;
            return card.render();
      });

      basketView.items = basketItems;
      basketView.total = total;
      basketView.disabled = items.length === 0;
});

//Открытие корзины
events.on("basket:open", () => {
      modal.render({ content: basketView.render() });
});

//Начало оформления заказа
events.on("order:start", () => {
      if (basketModel.getCountProduct() === 0) return;
      buyerModel.clear();
      const orderElement = cloneTemplate<HTMLFormElement>("#order");
      orderForm = new Order(orderElement, events);
      modal.render({ content: orderForm.render({}) });
});

//Изменение полей заказа
events.on("order.address:change", (data: { field: string; value: string }) => {
      buyerModel.setAddress(data.value);
      const errors = buyerModel.validate();
      if (orderForm) {
            orderForm.valid = !errors.address && !errors.payment;
            orderForm.errors = errors.address || errors.payment || "";
      }
});

events.on("order.payment:change", (data: { field: string; value: string }) => {
      buyerModel.setPayment(data.value as any);
      const errors = buyerModel.validate();
      if (orderForm) {
            orderForm.payment = data.value;
            orderForm.valid = !errors.address && !errors.payment;
            orderForm.errors = errors.address || errors.payment || "";
      }
});

//Отправка формы заказа, переход к контактам
events.on("order:submit", () => {
      const errors = buyerModel.validate();
      if (errors.address || errors.payment) {
            if (orderForm) {
                  orderForm.errors = errors.address || errors.payment || "";
                  orderForm.valid = false;
            }
            return;
      }
      const contactsElement = cloneTemplate<HTMLFormElement>("#contacts");
      contactsForm = new Contacts(contactsElement, events, "contacts");
      const buyer = buyerModel.getBuyerData();
      contactsForm.email = buyer.email || "";
      contactsForm.phone = buyer.phone || "";
      modal.render({ content: contactsForm.render({}) });
});

//Изменение полей контактов
events.on("contacts.email:change", (data: { field: string; value: string }) => {
      buyerModel.setEmail(data.value);
      const errors = buyerModel.validate();
      if (contactsForm) {
            contactsForm.valid = !errors.email && !errors.phone;
            contactsForm.errors = errors.email || errors.phone || "";
      }
});

events.on("contacts.phone:change", (data: { field: string; value: string }) => {
      buyerModel.setPhone(data.value);
      const errors = buyerModel.validate();
      if (contactsForm) {
            contactsForm.valid = !errors.email && !errors.phone;
            contactsForm.errors = errors.email || errors.phone || "";
      }
});

//Финальное подтверждение заказа
events.on("contacts:submit", async () => {
      const errors = buyerModel.validate();
      if (errors.email || errors.phone) {
            if (contactsForm)
                  contactsForm.errors = errors.email || errors.phone || "";
            return;
      }

      const buyer = buyerModel.getBuyerData();
      const order: IOrder = {
            payment: buyer.payment!,
            email: buyer.email,
            phone: buyer.phone,
            address: buyer.address,
            total: basketModel.getPrice(),
            items: basketModel.getItems().map((item) => item.id),
      };

      try {
            const result = await api.orderProducts(order);
            basketModel.clear();
            buyerModel.clear();

            const successElement = cloneTemplate<HTMLElement>("#success");
            successView = new SuccesInfo(successElement, {
                  onClick: () => modal.close(),
            });
            successView.total = result.total;
            modal.render({ content: successView.render() });
      } catch (err) {
            console.error("Ошибка оформления заказа:", err);
      }
});

//Закрытие модалки
events.on("modal:close", () => {});

//Загрузка данных с сервера

api.getProducts()
      .then((response) => {
            productsModel.setItems(response.items);
      })
      .catch((err) => {
            console.warn("Ошибка загрузки, используем mock:", err);
            import("./utils/data").then(({ apiProducts }) => {
                  productsModel.setItems(apiProducts.items as IProduct[]);
            });
      });
