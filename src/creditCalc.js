/*
creditSum - сумма кредита
interestRate - процентная ставка в день
creditLength - на сколько дней берется кредит
*/
function calcDailyOverpayment(creditSum, interestRate, creditLength) {
    return creditSum * interestRate / 100 * creditLength
}

/*
creditSum - сумма кредита
interestRate - процентная ставка в месяц в долях
creditLength - на сколько месяцев берется кредит
*/
function calcCreditMonthlyPayment(creditSum, interestRate, creditLength) {
    return creditSum * (interestRate + interestRate / (Math.pow(1 + interestRate, creditLength) - 1))
}

/*
creditSum - сумма кредита
interestRate - процентная ставка в месяц в долях
creditLength - на сколько месяцев берется кредит
*/
function calcCreditMonthlyOverpayment(monthlyPayment, creditLength, creditSum){
    return monthlyPayment * creditLength - creditSum
}

module.exports = {
    calcDailyOverpayment: calcDailyOverpayment,
    calcCreditMonthlyPayment: calcCreditMonthlyPayment,
    calcCreditMonthlyOverpayment: calcCreditMonthlyOverpayment
}
