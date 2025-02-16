//import helpers from './helpers.js';
const helpers = require('./helpers');

/*
проверено
расчет доходности вклада с выплатой процентов в конце срока (без капитализации)
*/
/*
creditSum - сумма кредита
interestRate - процентная ставка в месяц в долях
creditLength - на сколько месяцев берется кредит
*/
function calcDeposit(depositSum, interestRate, startDate, endDate, skipFirstDay) {
    let daysCount = helpers.getDaysDiff(startDate, endDate)
    if (!skipFirstDay) {
        daysCount = daysCount + 1
    }
    return depositSum * interestRate * daysCount / helpers.getYearDaysCount(endDate.getFullYear())
}

/*
проверено
расчет доходности вклада с ежедневной капитализацией, срок вклада в месяцах
*/
/*
creditSum - сумма кредита
interestRate - процентная ставка в месяц в долях
creditLength - на сколько месяцев берется кредит
*/
function calcDepositWithCapDailyByMonth(depositSum, interestRate, startDate, endDate, skipFirstDay) {
    let daysCount = helpers.getDaysDiff(startDate, endDate)
    if (!skipFirstDay) {
        daysCount = daysCount + 1 //прибавляем один день, надо учесть 1 янв
    }
    return depositSum * Math.pow((1 + interestRate / helpers.getYearDaysCount(endDate.getFullYear())), daysCount)
}

//расчет доходности вклада с ежедневной капитализацией, срок вклада в днях
/*
creditSum - сумма кредита
interestRate - процентная ставка в месяц в долях
depositLength - на сколько дней берется кредит
*/
function calcDepositWithCapDailyByDay(depositSum, interestRate, depositLength) {
    return depositSum * Math.pow((1 + interestRate / helpers.getCurrentYearDaysCount()), depositLength) 
}

module.exports = {
    calcDeposit: calcDeposit,
    calcDepositWithCapDailyByMonth: calcDepositWithCapDailyByMonth,
    calcDepositWithCapDailyByDay: calcDepositWithCapDailyByDay
}
