let DepositSum = 100000 * 100      //первоначальная сумма вклада
let InterestRate = 0.21        //годовая процентная ставка в долях
let DepositLength = 60           //срок вклада в месяцах или днях

function getCurrentYearDaysCount() {
    let date = new Date()
    if ((date.getFullYear() % 4 == 0) && (date.getFullYear() % 100 != 0)) {
        return 366   
    }
    return 365
}

function getDaysDiff(startDate, endDate) {        
    return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))
}

function getDaysCount(monthsCount) {
    let startDate = new Date()
    let startDateCopy = new Date(startDate)
    let endDate = new Date(startDate.setMonth(startDate.getMonth() + monthsCount))
    return getDaysDiff(startDateCopy, endDate)
}

function roundNumber(n) {
    return (n / 100).toFixed(2)
}

function calcDeposit(depositSum, interestRate, depositLength) {
    return depositSum * (1 + interestRate * depositLength / 12)
}

function calcDepositWithCapMonthly(depositSum, interestRate, depositLength) {
    return depositSum * Math.pow((1 + interestRate / 12), depositLength)
}

function calcDepositWithCapDailyByMonth(depositSum, interestRate, depositLength) {
    return depositSum * Math.pow((1 + interestRate / getCurrentYearDaysCount()), getDaysCount(depositLength))
}

function calcDepositWithCapDailyByDay(depositSum, interestRate, depositLength) {
    return depositSum * Math.pow((1 + interestRate / getCurrentYearDaysCount()), depositLength)
}

Deposit = calcDeposit(DepositSum, InterestRate, DepositLength)
DepositWithCapMonthly = calcDepositWithCapMonthly(DepositSum, InterestRate, DepositLength)
DepositWithCapDaily = calcDepositWithCapDailyByDay(DepositSum, InterestRate, DepositLength)
DepositWithCapDailyByMonth = calcDepositWithCapDailyByMonth(DepositSum, InterestRate, DepositLength)

console.log(roundNumber(DepositWithCapDaily))
