//import {roundNumber} from './helpers.mjs'
//import { roundNumber } from './helpers.js';

function roundNumber(n) {
    return (n / 100).toFixed(2)
}

let CreditSum = 1000 * 100      //сумма кредита
let InterestRate = 1.8        //процентная ставка в день
let CreditLength = 16              //на сколько дней берется кредит
let InterestFreeDays = 2          //бесплатные дни

function calcOverpayment(creditSum, interestRate, creditLength) {
    return creditSum * interestRate / 100 * creditLength
}

Overpayment = calcOverpayment(CreditSum, InterestRate, CreditLength - InterestFreeDays)
FinalPayment = Overpayment + CreditSum


console.log(roundNumber(Overpayment))
console.log(roundNumber(FinalPayment))