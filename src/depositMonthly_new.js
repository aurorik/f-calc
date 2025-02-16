//сколько дней в текущем году
function getCurrentYearDaysCount() {  
    let date = new Date()
    if ((date.getFullYear() % 4 == 0) && (date.getFullYear() % 100 != 0)) {
        return 366   
    }
    return 365
}

//сколько дней в определенном году
function getYearDaysCount(year) {
    if ((year % 4 == 0) && (year % 100 != 0)) {
        return 366   
    }
    return 365
}

//кол-во дней между датами
function getDaysDiff(startDate, endDate) {        
    return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))  //посмотреть почему
}

//удалить
function getDaysCount(monthsCount) {
    let startDate = new Date()
    let startDateCopy = new Date(startDate)
    let endDate = new Date(startDate.setMonth(startDate.getMonth() + monthsCount))
    return getDaysDiff(startDateCopy, endDate)
}

//прибавляет заданное кол-во месяцев к дате
function getEndDateByMonth(startDate, monthsCount) {
    let startDateCopy = new Date(startDate)  //создание копии параметра startDate
    startDateCopy.setMonth(startDateCopy.getMonth() + monthsCount)
    return startDateCopy
}

//перевод из копеек в рубли, округление до двух знаков после запятой
function roundNumber(n) {
    return (n / 100).toFixed(2)
}

//расчет доходности вклада с выплатой процентов в конце срока (без капитализации)  проверено
function calcDeposit(depositSum, interestRate, startDate, endDate, includeFirstDay) {
    let daysCount = getDaysDiff(startDate, endDate)
    if (includeFirstDay) {
        daysCount = daysCount + 1
    }
    return depositSum * interestRate * daysCount / getYearDaysCount(endDate.getFullYear())
}

//расчет доходности вклада с ежемесячной капитализацией, срок вклада в месяцах
function calcDepositWithCapMonthly(depositSum, interestRate, depositLength) {
    return depositSum * Math.pow((1 + interestRate / 12), depositLength)  //поменять формулу
}

//расчет доходности вклада с ежедневной капитализацией, срок вклада в месяцах   проверено
function calcDepositWithCapDailyByMonth(depositSum, interestRate, startDate, endDate, includeFirstDay) {
    let daysCount = getDaysDiff(startDate, endDate)
    if (includeFirstDay) {
        daysCount = daysCount + 1 //прибавляем один день, надо учесть 1 янв
    }
    return depositSum * Math.pow((1 + interestRate / getYearDaysCount(endDate.getFullYear())), daysCount)
}

//расчет доходности вклада с ежедневной капитализацией, срок вклада в днях
function calcDepositWithCapDailyByDay(depositSum, interestRate, depositLength) {
    return depositSum * Math.pow((1 + interestRate / getCurrentYearDaysCount()), depositLength) 
}

let DepositSum = 100000 * 100      //первоначальная сумма вклада
let InterestRate = 0.21        //годовая процентная ставка в долях
let DepositLength = 12           //срок вклада в месяцах или днях
let startDate = new Date()
let endDate = getEndDateByMonth(startDate, DepositLength)

//calcDeposit проверено
let accInterest = 0  //накопленная сумма
if (startDate.getFullYear() != endDate.getFullYear()) {
    let isFirstChunk = true
    while (startDate.getFullYear() != endDate.getFullYear() && startDate.getMonth() != endDate.getMonth()) {
        if (startDate.getMonth() == 11) {   // December
            let endDateCurrentYear = new Date(startDate.getFullYear(), 11, 31)

            if (isFirstChunk) {  //первый день первого chunk не считается
                accInterest = calcDeposit(DepositSum, InterestRate, startDate, endDateCurrentYear, false)
                isFirstChunk = false  //больше не заходим в этот if
            }

            startDate = new Date(startDate.getFullYear() + 1, 0, 1)
        }
        else
        {
            if (isFirstChunk) {  //первый день первого chunk не считается
                accInterest = calcDeposit(DepositSum, InterestRate, startDate, endDateCurrentYear, false)
                isFirstChunk = false  //больше не заходим в этот if
            }
            else {
                accInterest = accInterest + calcDeposit(DepositSum, InterestRate, startDate, endDateCurrentYear, true) //у каждого года (кроме первого) плюс один день
            }
        }
        startDate = new Date(startDate.getFullYear() + 1, 0, 1)
    }
    accInterest = accInterest + calcDeposit(DepositSum, InterestRate, startDate, endDate, true)
}
else {
    DepositSum = calcDeposit(DepositSum, InterestRate, startDate, endDate, false)
}
//console.log(roundNumber(DepositSum + accInterest))

//calcDepositWithCapMonthly
DepositSum = 100000 * 100      //первоначальная сумма вклада
InterestRate = 0.21        //годовая процентная ставка в долях
DepositLength = 12           //срок вклада в месяцах или днях
startDate = new Date()
endDate = getEndDateByMonth(startDate, DepositLength)

accInterest = 0  //накопленная сумма                доделать!!!
if (startDate.getFullYear() != endDate.getFullYear()) {
    let isFirstPart = true
    while (startDate.getFullYear() != endDate.getFullYear()) {
        while (startDate.getMonth() != 11) {

        }
        let endDateCurrentYear = new Date(startDate.getFullYear(), 11, 31)
        if (isFirstPart) {  //первый день вклада не считается
            accInterest = calcDeposit(DepositSum, InterestRate, startDate, endDateCurrentYear, false)
            isFirstPart = false  //больше не заходим в этот if
        }
        else {
            accInterest = accInterest + calcDeposit(DepositSum, InterestRate, startDate, endDateCurrentYear, true) //у каждого года (кроме первого) плюс один день
        }
        startDate = new Date(startDate.getFullYear() + 1, 0, 1)
    }
    accInterest = accInterest + calcDeposit(DepositSum, InterestRate, startDate, endDate, true)
}
else {
    DepositSum = calcDeposit(DepositSum, InterestRate, startDate, endDate, false)
}

//DepositWithCapMonthly = calcDepositWithCapMonthly(DepositSum, InterestRate, DepositLength)
DepositWithCapMonthly = calcDeposit(DepositSum, InterestRate, startDate, endDate, false)
//console.log(roundNumber(DepositWithCapMonthly + DepositSum))

//calcDepositWithCapDailyByDay
DepositSum = 100000 * 100      //первоначальная сумма вклада
InterestRate = 0.21        //годовая процентная ставка в долях
DepositLength = 122           //срок вклада в месяцах или днях
startDate = new Date()
endDate = getEndDateByMonth(startDate, DepositLength)

DepositWithCapDaily = calcDepositWithCapDailyByDay(DepositSum, InterestRate, DepositLength)
console.log(roundNumber(DepositWithCapDaily))

//calcDepositWithCapDailyByMonth проверено
if (startDate.getFullYear() != endDate.getFullYear()) {
    let isFirstPart = true
    while (startDate.getFullYear() != endDate.getFullYear()) {
        let endDateCurrentYear = new Date(startDate.getFullYear(), 11, 31)
        if (isFirstPart) {  //первый день вклада не считается
            DepositSum = calcDepositWithCapDailyByMonth(DepositSum, InterestRate, startDate, endDateCurrentYear, false)
            isFirstPart = false  //больше не заходим в этот if
        }
        else {
            DepositSum = calcDepositWithCapDailyByMonth(DepositSum, InterestRate, startDate, endDateCurrentYear, true) //у каждого года (кроме первого) плюс один день
        }
        startDate = new Date(startDate.getFullYear() + 1, 0, 1)
    }
    DepositSum = calcDepositWithCapDailyByMonth(DepositSum, InterestRate, startDate, endDate, true)
}
else {
    DepositSum = calcDepositWithCapDailyByMonth(DepositSum, InterestRate, startDate, endDate, false)
}


//console.log(roundNumber(DepositSum))
//console.log(getYearDaysCount(2024))
