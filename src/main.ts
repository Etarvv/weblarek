import "./scss/styles.scss";
import { BasketData } from "./components/models/Basket";
import { Buyer } from "./components/models/Buyer";
import { Products } from "./components/models/Product";
import { WebLarekAPI } from "./components/WebLarekAPI";
import { EventEmitter } from "./components/base/Events";
import { Api } from "./components/base/Api";
import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { BasketView } from "./components/view/BasketView";
import {
      CatalogCard,
      PreviewCard,
      BasketCard,
} from "./components/view/CardView";
import { ContactsForm } from "./components/view/ContactView";
import { Modal } from "./components/view/Modal";
import { Order } from "./components/view/Order";
import { Gallery } from "./components/view/Gallery";
import { SuccessInfo } from "./components/view/Success";
import { Header } from "./components/view/Header";
import { IProduct, IOrder } from "./types";

const events = new EventEmitter();
const api = new WebLarekAPI(new Api(API_URL));

const productsModel = new Products(events);
const basketModel = new BasketData(events);
const buyerModel = new Buyer(events);

const modalContainer = ensureElement<HTMLElement>("#modal-container");
const galleryContainer = ensureElement<HTMLElement>(".gallery");
const headerContainer = ensureElement<HTMLElement>(".header");

const modal = new Modal(modalContainer);
const gallery = new Gallery(galleryContainer);
const header = new Header(headerContainer, events);
const basketView = new BasketView(
      cloneTemplate<HTMLElement>("#basket"),
      events,
);

const orderForm = new Order(cloneTemplate<HTMLFormElement>("#order"), events);
const contactsForm = new ContactsForm(
      cloneTemplate<HTMLFormElement>("#contacts"),
      events,
);
const successView = new SuccessInfo(cloneTemplate<HTMLElement>("#success"), {
      onClick: () => modal.close(),
});

function updateBasketView() {
      const items = basketModel.getItems();
      const total = basketModel.getPrice();
      header.counter = basketModel.getCountProduct();

      const basketItems = items.map((item, idx) => {
            const cardElement = cloneTemplate<HTMLElement>("#card-basket");
            const card = new BasketCard(cardElement, () =>
                  basketModel.delete(item.id),
            );
            card.title = item.title;
            card.price = item.price ?? null;
            card.index = idx + 1;
            return card.render();
      });

      basketView.items = basketItems;
      basketView.total = total;
      basketView.disabled = items.length === 0;
}

function updateOrderForm() {
      const errors = buyerModel.validate();
      const isValid = !errors.address && !errors.payment;
      const errorMessage = errors.address || errors.payment || "";
      orderForm.render({
            valid: isValid,
            errors: errorMessage,
            payment: buyerModel.getBuyerData().payment || undefined,
            address: buyerModel.getBuyerData().address,
      });
}

function updateContactsForm() {
      const errors = buyerModel.validate();
      const isValid = !errors.email && !errors.phone;
      const errorMessage = errors.email || errors.phone || "";
      contactsForm.render({
            valid: isValid,
            errors: errorMessage,
            email: buyerModel.getBuyerData().email,
            phone: buyerModel.getBuyerData().phone,
      });
}

updateBasketView();

events.on("products:changed", () => {
      const products = productsModel.getItems();
      const cardItems = products.map((product) => {
            const cardTemplate = cloneTemplate<HTMLElement>("#card-catalog");
            const card = new CatalogCard(cardTemplate, () =>
                  events.emit("product:select", product),
            );
            card.title = product.title;
            card.price = product.price ?? null;
            card.image = CDN_URL + (product.image ?? "");
            card.category = product.category;
            return card.render();
      });
      gallery.catalog = cardItems;
});

events.on("basket:changed", () => updateBasketView());
events.on("buyer:changed", () => {
      updateOrderForm();
      updateContactsForm();
});

events.on("basket:open", () => {
      modal.render({ content: basketView.render() });
});

events.on("order:start", () => {
    if (basketModel.getCountProduct() === 0) return;
    buyerModel.clear();
    modal.render({ content: orderForm.render({}) });
});

events.on("order.address:change", (data: { field: string; value: string }) => {
      buyerModel.setAddress(data.value);
});

events.on("order.payment:change", (data: { field: string; value: string }) => {
      buyerModel.setPayment(data.value as "card" | "cash");
});

events.on("order:submit", () => {
    modal.render({ content: contactsForm.render({}) });
});

events.on("contacts.email:change", (data: { field: string; value: string }) => {
      buyerModel.setEmail(data.value);
});

events.on("contacts.phone:change", (data: { field: string; value: string }) => {
      buyerModel.setPhone(data.value);
});

events.on("contacts:submit", async () => {
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
            successView.total = result.total;
            modal.render({ content: successView.render() });
      } catch (err) {
            console.error("Ошибка оформления заказа:", err);
            contactsForm.errors =
                  "Не удалось оформить заказ. Попробуйте позже.";
      }
});

events.on("product:select", (product: IProduct) => {
      const template = cloneTemplate<HTMLElement>("#card-preview");

      const onButtonClick = () => {
            if (basketModel.inBasket(product.id)) {
                  basketModel.delete(product.id);
            } else if (product.price !== null && product.price !== undefined) {
                  basketModel.addItem(product);
            }
            modal.close();
      };

      const previewCard = new PreviewCard(template, onButtonClick);
      const inBasket = basketModel.inBasket(product.id);
      const isPriceUnavailable = product.price === null;

      previewCard.title = product.title;
      previewCard.price = product.price ?? null;
      previewCard.image = CDN_URL + (product.image ?? "");
      previewCard.category = product.category;
      previewCard.description = product.description ?? "";

      if (isPriceUnavailable) {
            previewCard.buttonText = "Недоступно";
            previewCard.buttonDisabled = true;
      } else {
            previewCard.buttonText = inBasket
                  ? "Удалить из корзины"
                  : "В корзину";
            previewCard.buttonDisabled = false;
      }

      modal.render({ content: previewCard.render() });
});

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
