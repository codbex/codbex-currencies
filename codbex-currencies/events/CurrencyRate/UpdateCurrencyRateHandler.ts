import { CurrencyRepository } from "../../gen/codbex-currencies/dao/Settings/CurrencyRepository";

export const trigger = (event) => {
    const CurrencyDao = new CurrencyRepository();
    const operation = event.operation;
    const currencyRate = event.entity;
    if (operation === "create") {
        const currency = CurrencyDao.findById(currencyRate.Currency);
        currency.Rate = currencyRate.Rate;
        CurrencyDao.update(currency);
    }
}

export const validate = () => {
}