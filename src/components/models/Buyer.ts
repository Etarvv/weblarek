import { TPayment, IBuyer } from "../../types/index.ts";
import { TBuyerErrors } from "../../types/index.ts";

export class Buyer {
  private email: string = "";
  private phone: string = "";
  private address: string = "";
  private payment: TPayment | null = null;

  setAddress(address: string): void {
    this.address = address;
  }

  setPayment(payment: TPayment): void {
    this.payment = payment;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPhone(phone: string): void {
    this.phone = phone;
  }

  getBuyerData(): IBuyer {
    return {
      email: this.email,
      phone: this.phone,
      address: this.address,
      payment: this.payment,
    };
  }

  clear(): void {
    this.email = "";
    this.phone = "";
    this.address = "";
    this.payment = null;
  }

  validate(): TBuyerErrors {
    const errors: TBuyerErrors = {};

    if (!this.email || this.email.trim() === "") {
      errors.email = "Необходимо указать email";
    }

    if (!this.phone || this.phone.trim() === "") {
      errors.phone = "Необходимо указать телефон";
    }

    if (!this.address || this.address.trim() === "") {
      errors.address = "Укажите адрес";
    }

    if (this.payment === null) {
      errors.payment = "Не выбран вид оплаты";
    }

    return errors;
  }
}