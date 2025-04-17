import { CurrencyRepository } from "../../gen/codbex-currencies/dao/Settings/CurrencyRepository";

console.log("opp");

export const trigger = (event) => {
    console.log("hey");

    const CurrencyDao = new CurrencyRepository();

    console.log("dao");

    const operation = event.operation;
    const currencyRate = event.entity;

    console.log("oper");
    console.log(JSON.stringify(currencyRate));

    if (operation === "create") {

        console.log("if");

        const currency = CurrencyDao.findById(currencyRate.Currency);

        console.log(JSON.stringify(currency));

        currency.Rate = currencyRate.Rate;

        console.log(JSON.stringify(currency));


        CurrencyDao.update(currency);
    }

}