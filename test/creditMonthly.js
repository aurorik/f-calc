let CreditSum = 1000 * 100      //сумма кредита
let InterestRate = 0.21 / 12        //процентная ставка в месяц в долях
let CreditLength = 12              //на сколько месяцев берется кредит

function calcCreditMonthlyPayment(creditSum, interestRate, creditLength) {
  return creditSum * (interestRate + interestRate / (Math.pow(1 + interestRate, creditLength) - 1))
}

function roundNumber(n) {
  return (n / 100).toFixed(2)
}

function calcCreditMonthlyOverpayment(monthlyPayment, creditLength, creditSum){
  return monthlyPayment * creditLength - creditSum
}

let MonthlyPayment = calcCreditMonthlyPayment(CreditSum, InterestRate, CreditLength)
let Overpayment = calcCreditMonthlyOverpayment(MonthlyPayment, CreditLength, CreditSum)

console.log(roundNumber(MonthlyPayment))
console.log(roundNumber(Overpayment))