import { TPayment, IBuyer } from "../../types/index.ts";
import { TBuyerErrors } from "../../types/index.ts";

export class Buyer {
    private email: string = '';
    private phone: string = '';
    private address: string = '';
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
            payment: this.payment
        };
    }

    clear(): void {
        this.email = '';
        this.phone = '';
        this.address = '';
        this.payment = null;
    }

    validateAddress(): boolean {
        return this.address.trim().length > 0;
    }

    validatePayment(): boolean {
        return this.payment !== null;
    }

    validateEmail(): boolean {
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return emailRegex.test(this.email);
    }

    validatePhone(): boolean {
        return this.phone.trim().length > 0 && /\d/.test(this.phone);
    }

    validateBuyerData(): TBuyerErrors {
        const errors: TBuyerErrors = {};
        if (!this.payment) {
            errors.payment = "Не выбран вид оплаты";
        }
        if (!this.address) {
            errors.address = "Укажите адрес";
        }
        if (!this.phone) {
            errors.phone = "Необходимо указать телефон";
        }
        if (!this.email) {
            errors.email = "Необходимо указать email";
        }
        return errors;
    }
}