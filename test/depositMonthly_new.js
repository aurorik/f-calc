//разбивает на отрезки времени по годам
function get_year_chunks(startDate, endDate) {
    let chunks = new Array();

    if (startDate.getFullYear() != endDate.getFullYear()) {
        let chunkStartDate
        let chunkEndDate

        while (startDate.getFullYear() != endDate.getFullYear()) {
            chunkStartDate = startDate
            chunkEndDate = new Date(startDate.getFullYear(), 11, 31)

            startDate = new Date(startDate.getFullYear() + 1, 0, 1)
            chunks.push(new DateChunk(chunkStartDate, chunkEndDate))
        }
        
        chunks.push(new DateChunk(dateAddDays(chunkEndDate, 1), endDate))
    }
    else {
        chunks.push(new DateChunk(startDate, endDate))
    }
    return chunks
}

//разбивает на отрезки времени по дням
function get_day_chunks(startDate, endDate) {
    let chunks = new Array();
    let chunkStartDate
    let chunkEndDate

    while (startDate < endDate) {
        chunkStartDate = startDate
        chunkEndDate = dateAddDays(startDate, 1)
        chunks.push(new DateChunk(chunkStartDate, chunkEndDate))

        startDate = dateAddDays(startDate, 1)
    }
    return chunks
}

//класс для хранения диапазона дат
class DateChunk {
    constructor(startDate, endDate) {
        this.StartDate = startDate;
        this.EndDate = endDate;
    }
} 

//прибавляет заданное кол-во дней к дате
function dateAddDays(date, daysCount) {
    let dateCopy = new Date(date)  //создание копии параметра date
    dateCopy.setDate(dateCopy.getDate() + daysCount)
    return dateCopy
}

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

//прибавляет заданное кол-во месяцев к дате
function dateAddMonths(date, monthsCount) {
    let dateCopy = new Date(date)
    dateCopy.setMonth(dateCopy.getMonth() + monthsCount)
    if (dateCopy.getDate() != date.getDate()) {
        dateCopy.setDate(0)
    }
    return dateCopy
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

//расчет доходности вклада с ежедневной капитализацией, срок вклада любой   проверено
function calcDepositWithCapDaily(depositSum, interestRate, startDate, endDate, includeFirstDay) {
    let daysCount = getDaysDiff(startDate, endDate)
    if (includeFirstDay) {
        daysCount = daysCount + 1 //прибавляем один день, надо учесть 1 янв
    }
    return depositSum * Math.pow((1 + interestRate / getYearDaysCount(endDate.getFullYear())), daysCount)
}

let DepositSum = 100000 * 100      //первоначальная сумма вклада
let InterestRate = 0.21        //годовая процентная ставка в долях
let DepositLength = 12           //срок вклада в месяцах или днях
let startDate = new Date()
let endDate = dateAddMonths(startDate, DepositLength)

//calcDeposit проверено
DepositSum = 100000 * 100      //первоначальная сумма вклада
InterestRate = 0.21        //годовая процентная ставка в долях
DepositLength = 23           //срок вклада в месяцах
startDate = new Date()
endDate = dateAddMonths(startDate, DepositLength)

let accInterest = 0  //накопленная сумма
let chunks = get_year_chunks(startDate, endDate)
for (let i = 0; i < chunks.length; i++) {
    accInterest = accInterest + calcDeposit(DepositSum, InterestRate, chunks[i].StartDate, chunks[i].EndDate, i > 0)
}
console.log(roundNumber(DepositSum + accInterest))

/*
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
*/

//calcDepositWithCapMonthly проверено, но есть погрешность
DepositSum = 100000 * 100      //первоначальная сумма вклада
InterestRate = 0.21        //годовая процентная ставка в долях
DepositLength = 12           //срок вклада в месяцах или днях
startDate = new Date()
endDate = dateAddMonths(startDate, DepositLength)
DepositWithCapMonthly = calcDepositWithCapMonthly(DepositSum, InterestRate, DepositLength)  
//console.log(roundNumber(DepositWithCapMonthly))

//calcDepositWithCapDailyByMonth проверено
DepositSum = 100000 * 100      //первоначальная сумма вклада
InterestRate = 0.21        //годовая процентная ставка в долях
DepositLength = 2           //срок вклада в месяцах
startDate = new Date()
endDate = dateAddMonths(startDate, DepositLength)

chunks = get_year_chunks(startDate, endDate)
for (let i = 0; i < chunks.length; i++) {
    DepositSum = calcDepositWithCapDaily(DepositSum, InterestRate, chunks[i].StartDate, chunks[i].EndDate, i == 0)
}
//console.log(roundNumber(DepositSum))
    

//calcDepositWithCapDailyByDay 
DepositSum = 100000 * 100      //первоначальная сумма вклада
InterestRate = 0.21        //годовая процентная ставка в долях
DepositLength = 12           //срок вклада в днях
startDate = new Date()
endDate = dateAddDays(startDate, DepositLength)
 
/*
//let c = get_year_chunks(startDate, endDate)
let c = get_day_chunks(startDate, endDate)
console.log('Chunks count: %d', c.length)
for (let i = 0; i < c.length; i++) {
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    console.log('Start date: %d %s %d End date: %d %s %d', c[i].StartDate.getFullYear(), month[c[i].StartDate.getMonth()], c[i].StartDate.getDate(), c[i].EndDate.getFullYear(), month[c[i].EndDate.getMonth()], c[i].EndDate.getDate())
}
*/   