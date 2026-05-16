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
import { IOrder } from "./types";

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

const previewCard = new PreviewCard(
      cloneTemplate<HTMLElement>("#card-preview"),
      events,
);

function updateBasketView() {
      const items = basketModel.getItems();

      const basketItems = items.map((item, index) => {
            const card = new BasketCard(
                  cloneTemplate<HTMLElement>("#card-basket"),
                  events,
            );

            return card.render({
                  title: item.title,
                  price: item.price ?? null,
                  index: index + 1,
                  id: item.id,
            });
      });

      basketView.render({
            items: basketItems,
            total: basketModel.getPrice(),
            disabled: items.length === 0,
      });

      header.render({
            counter: basketModel.getCountProduct(),
      });
}

function updateOrderForm() {
      const errors = buyerModel.validate();

      orderForm.render({
            payment: buyerModel.getBuyerData().payment || undefined,
            address: buyerModel.getBuyerData().address,
            valid: !errors.address && !errors.payment,
            errors: [errors.address, errors.payment].filter(Boolean).join(", "),
      });
}

function updateContactsForm() {
      const errors = buyerModel.validate();

      contactsForm.render({
            email: buyerModel.getBuyerData().email,
            phone: buyerModel.getBuyerData().phone,
            valid: !errors.email && !errors.phone,
            errors: [errors.email, errors.phone].filter(Boolean).join(", "),
      });
}

updateBasketView();

events.on("products:changed", () => {
      const products = productsModel.getItems();

      const cards = products.map((item) => {
            const card = new CatalogCard(
                  cloneTemplate<HTMLElement>("#card-catalog"),
                  events,
            );

            return card.render({
                  title: item.title,
                  price: item.price ?? null,
                  image: CDN_URL + item.image,
                  category: item.category,
                  id: item.id,
            });
      });

      gallery.render({
            catalog: cards,
      });
});

events.on("product:select", (data: { id: string }) => {
      const product = productsModel.getItemById(data.id);

      if (!product) return;

      productsModel.setPreview(product);
});

events.on("preview:changed", () => {
      const product = productsModel.getPreview();

      if (!product) return;

      const inBasket = basketModel.inBasket(product.id);

      const isPriceUnavailable =
            product.price === null || product.price === undefined;

      modal.render({
            content: previewCard.render({
                  title: product.title,
                  price: product.price ?? null,
                  image: CDN_URL + product.image,
                  category: product.category,
                  description: product.description,
                  buttonText: isPriceUnavailable
                        ? "Недоступно"
                        : inBasket
                          ? "Удалить из корзины"
                          : "В корзину",
                  buttonDisabled: isPriceUnavailable,
            }),
      });
});

events.on("preview:button-click", () => {
      const product = productsModel.getPreview();

      if (!product) return;

      if (basketModel.inBasket(product.id)) {
            basketModel.delete(product.id);
      } else if (product.price !== null) {
            basketModel.addItem(product);
      }
      modal.close();
});

events.on("basket:item-remove", (data: { id: string }) => {
      basketModel.delete(data.id);
});

events.on("basket:changed", () => {
      updateBasketView();
});

events.on("basket:open", () => {
      modal.render({
            content: basketView.render(),
      });
});

events.on("order:start", () => {
      buyerModel.clear();
      modal.render({
            content: orderForm.element,
      });
});

events.on("order.address:change", (data: { value: string }) => {
      buyerModel.setAddress(data.value);
});

events.on("order.payment:change", (data: { value: string }) => {
      buyerModel.setPayment(data.value as "card" | "cash");
});

events.on("buyer:changed", () => {
      updateOrderForm();
      updateContactsForm();
});

events.on("order:submit", () => {
      modal.render({
            content: contactsForm.render({}),
      });
});

events.on("contacts.email:change", (data: { value: string }) => {
      buyerModel.setEmail(data.value);
});

events.on("contacts.phone:change", (data: { value: string }) => {
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

            modal.render({
                  content: successView.render({
                        total: result.total,
                  }),
            });
      } catch (err) {
            contactsForm.render({
                  errors: "Не удалось оформить заказ. Попробуйте позже.",
            });
      }
});

api.getProducts()
      .then((response) => {
            productsModel.setItems(response.items);
      })
      .catch((err) => {
            console.warn("Ошибка загрузки:", err);
      });
