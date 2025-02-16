class DateChunk {
    constructor(startDate, endDate, skipFirstDay) {
        this.StartDate = startDate;
        this.EndDate = endDate;
        this.SkipFirstDay = skipFirstDay
    }
}

const DepositLen = Object.freeze({
	Days: Symbol("Days"),
	Months: Symbol("Months"),
	Years: Symbol("Years")
})

class DateChopper {
    constructor(startDate, depositLen) {
        this.startDate = startDate;
        this.startDay = startDate.getDate()
        this.endDate = dateAddMonths(startDate, depositLen)
    }

    // разбивает на отрезки времени по месяцам
    get_month_chunks() {
        let orgStartDate = new Date(this.startDate)
        let chunks = [];
        let once = true
    
        if (this.startDate.getFullYear() != this.endDate.getFullYear())
        {
            while (this.startDate < this.endDate) {
                if (this.startDate.getMonth() == 11) {   // December
                    let chunkStartDate = new Date(this.startDate)
                    let chunkEndDate = new Date(this.startDate.getFullYear(), 11, 31)        // last date of the current year

                    if (once) {
                        chunks.push(new DateChunk(chunkStartDate, chunkEndDate, false))        // chunk before the New Year
                        once = false
                    }
                    else {
                        chunks.push(new DateChunk(chunkStartDate, chunkEndDate, true))        // chunk before the New Year
                    }
    
                    if (this.startDay != 1) {
                        chunkStartDate = new Date(this.startDate.getFullYear() + 1, 0, 1)    // first date of the next year
                        chunkEndDate = dateAddMonths(this.startDate, 1)
                        if (+chunkStartDate != +chunkEndDate) {
                            chunks.push(new DateChunk(chunkStartDate, chunkEndDate, false))    // chunk right after the New Year
                        }
                    }
    
                    this.startDate = dateAddMonths(this.startDate, 1)
                }
                else {
                    if (once) {
                        chunks.push(this.get_month_chunk(false))
                        once = false
                    }
                    else {
                        chunks.push(this.get_month_chunk(true))
                    }
                }
            }
        }
        else {
            while (this.startDate.getMonth() != this.endDate.getMonth()) {
                if (once) {
                    chunks.push(this.get_month_chunk(false))
                    once = false
                }
                else {
                    chunks.push(this.get_month_chunk(true))
                }
            }
        }

        this.startDate = orgStartDate
        return chunks
    }
    
    get_month_chunk(skipFirstDay) {
        let chunkStartDate = new Date(this.startDate)
        let chunkEndDate = dateAddMonths(this.startDate, 1)
    
        if (chunkEndDate.getDate() != this.startDay)
        {
            if (+chunkEndDate == +getLastDayOfMonth(chunkEndDate)) {
                //copyDate(dateAddDays(chunkEndDate, 1), startDate)
                this.startDate = new Date(chunkEndDate)
            }
            else {
                if (chunkEndDate.getDate() == 1) {
                    chunkEndDate = dateAddDays(chunkEndDate, -1)
                    if (chunkEndDate.getDate() > this.startDay) {
                        chunkEndDate = new Date(chunkEndDate.getFullYear(), chunkEndDate.getMonth(), this.startDay)    
                    }
                }
                else {
                    chunkEndDate = new Date(chunkEndDate.getFullYear(), chunkEndDate.getMonth(), this.startDay)
                }
                //copyDate(dateAddDays(chunkEndDate, 1), startDate)
                this.startDate = new Date(chunkEndDate)
            }
        }
        else {
            //copyDate(dateAddMonths(startDate, 1), startDate)
            this.startDate = new Date(dateAddMonths(this.startDate, 1))
        }
    
        return new DateChunk(chunkStartDate, chunkEndDate, skipFirstDay)
    }

    //разбивает на отрезки времени по годам
    get_year_chunks() {
        let orgStartDate = new Date(this.startDate)
        let chunks = []
        let once = true

        if (this.startDate.getFullYear() != this.endDate.getFullYear()) {
            let chunkStartDate
            let chunkEndDate

            while (this.startDate.getFullYear() != this.endDate.getFullYear()) {
                chunkStartDate = this.startDate
                chunkEndDate = new Date(this.startDate.getFullYear(), 11, 31)

                this.startDate = new Date(this.startDate.getFullYear() + 1, 0, 1)
                if (once) {
                    chunks.push(new DateChunk(chunkStartDate, chunkEndDate, false))
                }
                else {
                    chunks.push(new DateChunk(chunkStartDate, chunkEndDate, true))
                }
            }
            
            chunks.push(new DateChunk(dateAddDays(chunkEndDate, 1), this.endDate, true))
        }
        else {
            chunks.push(new DateChunk(this.startDate, this.endDate, false))
        }

        this.startDate = orgStartDate
        return chunks
    }

    //разбивает на отрезки времени по дням
    get_day_chunks() {
        let chunks = [];
        let chunkStartDate
        let chunkEndDate
    
        while (this.startDate < this.endDate) {
            chunkStartDate = this.startDate
            chunkEndDate = dateAddDays(this.startDate, 1)
            chunks.push(new DateChunk(chunkStartDate, chunkEndDate, false))
    
            this.startDate = dateAddDays(this.startDate, 1)
        }
        return chunks
    }
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

//прибавляет заданное кол-во дней к дате
function dateAddDays(date, daysCount) {
    let dateCopy = new Date(date)  //создание копии параметра date
    dateCopy.setDate(dateCopy.getDate() + daysCount)
    return dateCopy
}

// копирует дату из одной переменной в другую
function copyDate(sourceDate, destDate) {
    destDate = new Date(sourceDate)
    //destDate.setFullYear(sourceDate.getFullYear())
    //destDate.setMonth(sourceDate.getMonth())
    //destDate.setDate(sourceDate.getDate())
}

//возвращает последний день месяца
function getLastDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

function get_month_chunks(startDate, endDate) {
    let chunks = new Array();
    let day = startDate.getDate()

    if (startDate.getFullYear() != endDate.getFullYear())
    {
        let chunkStartDate
        let chunkEndDate

        while (startDate < endDate) {
            if (startDate.getMonth() == 11) {   // December
                chunkStartDate = new Date(startDate)
                chunkEndDate = new Date(startDate.getFullYear(), 11, 31)        // last date of the current year
                chunks.push(new DateChunk(chunkStartDate, chunkEndDate))        // chunk before the New Year

                chunkStartDate = new Date(startDate.getFullYear() + 1, 0, 1)    // first date of the next year
                chunkEndDate = new Date(dateAddMonths(startDate, 1))
                if (+chunkStartDate != +chunkEndDate) {
                    chunks.push(new DateChunk(chunkStartDate, chunkEndDate))    // chunk right after the New Year
                }

                if (chunkEndDate.getDate() != day) {
                    chunkEndDate = getLastDayOfMonth(chunkStartDate)

                    if (chunkEndDate.getDate() > day) {
                        chunkEndDate = new Date(chunkEndDate.getFullYear(), chunkEndDate.getMonth(), day)
                        startDate = new Date(chunkEndDate.getFullYear(), chunkEndDate.getMonth(), day)
                    }
                    else {
                        startDate = dateAddDays(chunkEndDate, 1)
                    }
                    
                    chunks.push(new DateChunk(chunkStartDate, chunkEndDate))
                }
                else if (chunkEndDate.getDate() == 1) {
                    chunkEndDate = dateAddDays(chunkEndDate, -1)
                    startDate = new Date(dateAddMonths(startDate, 1))
                }
                else {
                    startDate = new Date(dateAddMonths(startDate, 1))
                }
            }
            else {
                chunkStartDate = new Date(startDate)
                if (+chunkStartDate == +chunkEndDate) {
                    chunkStartDate = dateAddDays(chunkStartDate, 1)
                }
                chunkEndDate = new Date(dateAddMonths(startDate, 1))

                if (chunkEndDate.getDate() != day)
                {
                    if (+chunkEndDate == +getLastDayOfMonth(chunkEndDate)) {
                        startDate = dateAddDays(chunkEndDate, 1)
                    }
                    else {
                        if (chunkEndDate.getDate() == 1) {
                            chunkEndDate = dateAddDays(chunkEndDate, -1)
                            if (chunkEndDate.getDate() > day) {
                                chunkEndDate = new Date(chunkEndDate.getFullYear(), chunkEndDate.getMonth(), day)    
                            }
                        }
                        else {
                            chunkEndDate = new Date(chunkEndDate.getFullYear(), chunkEndDate.getMonth(), day)
                        }
                        startDate = dateAddDays(chunkEndDate, 1)
                    }
                }
                else {
                    startDate = new Date(dateAddMonths(startDate, 1))
                }
                chunks.push(new DateChunk(chunkStartDate, chunkEndDate))
            }
        }
    }
    else {
        let chunkStartDate
        let chunkEndDate

        while (startDate.getMonth() != endDate.getMonth()) {
            chunkStartDate = new Date(startDate)
            if (+chunkStartDate == +chunkEndDate) {
                chunkStartDate = dateAddDays(chunkStartDate, 1)
            }
            chunkEndDate = new Date(dateAddMonths(startDate, 1))

            startDate = new Date(dateAddMonths(startDate, 1))
            chunks.push(new DateChunk(chunkStartDate, chunkEndDate))
        }
    }
    return chunks
}

function get_month_chunk(startDate, day) {
    let chunkStartDate = new Date(startDate)
    let chunkEndDate = dateAddMonths(startDate, 1)

    if (chunkEndDate.getDate() != day)
    {
        if (+chunkEndDate == +getLastDayOfMonth(chunkEndDate)) {
            //copyDate(dateAddDays(chunkEndDate, 1), startDate)
            copyDate(chunkEndDate, startDate)
            //copyDate(new Date(chunkEndDate.getFullYear(), chunkEndDate.getMonth(), day), startDate)
        }
        else {
            if (chunkEndDate.getDate() == 1) {
                chunkEndDate = dateAddDays(chunkEndDate, -1)
                if (chunkEndDate.getDate() > day) {
                    chunkEndDate = new Date(chunkEndDate.getFullYear(), chunkEndDate.getMonth(), day)    
                }
            }
            else {
                chunkEndDate = new Date(chunkEndDate.getFullYear(), chunkEndDate.getMonth(), day)
            }
            //copyDate(dateAddDays(chunkEndDate, 1), startDate)
            copyDate(chunkEndDate, startDate)
        }
    }
    else {
        copyDate(dateAddMonths(startDate, 1), startDate)
    }

    return new DateChunk(chunkStartDate, chunkEndDate)
}

function get_month_chunks2(startDate, endDate) {
    let chunks = new Array();
    let day = startDate.getDate()

    if (startDate.getFullYear() != endDate.getFullYear())
    {
        while (startDate < endDate) {
            if (startDate.getMonth() == 11) {   // December
                let chunkStartDate = new Date(startDate)
                let chunkEndDate = new Date(startDate.getFullYear(), 11, 31)        // last date of the current year
                chunks.push(new DateChunk(chunkStartDate, chunkEndDate))        // chunk before the New Year

                if (day != 1) {
                    chunkStartDate = new Date(startDate.getFullYear() + 1, 0, 1)    // first date of the next year
                    chunkEndDate = dateAddMonths(startDate, 1)
                    if (+chunkStartDate != +chunkEndDate) {
                        chunks.push(new DateChunk(chunkStartDate, chunkEndDate))    // chunk right after the New Year
                    }
                }

                startDate = dateAddMonths(startDate, 1)
            }
            else {
                chunks.push(get_month_chunk(startDate, day))
            }
        }
    }
    else {
        while (startDate.getMonth() != endDate.getMonth()) {
            chunks.push(get_month_chunk(startDate, day))
        }
    }
    return chunks
}

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

let DepositLength = 10
let startDate = new Date(2024, 1, 1)
//let startDate = new Date(2024, 11, 1)
//let startDate = new Date(2024, 8, 29)
//let startDate = new Date(2024, 9, 31)
//let startDate = new Date(2024, 10, 30)
let endDate = dateAddMonths(startDate, DepositLength)


//console.log(getLastDayOfMonth(startDate))
//console.log(dateAddMonths(startDate, 1))
//console.log(dateAddMonths(startDate, 1))

/*
let c = get_month_chunks2(startDate, endDate)
console.log('Chunks count: %d', c.length)
for (let i = 0; i < c.length; i++) {
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    console.log('Start date: %d %s %d End date: %d %s %d', c[i].StartDate.getFullYear(), month[c[i].StartDate.getMonth()], c[i].StartDate.getDate(), c[i].EndDate.getFullYear(), month[c[i].EndDate.getMonth()], c[i].EndDate.getDate())
}
*/

let dc = new DateChopper(startDate, 10)
let c = dc.get_month_chunks()

console.log('Chunks count: %d', c.length)
for (let i = 0; i < c.length; i++) {
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    console.log('SkipFirstDay: %s Start date: %d %s %d End date: %d %s %d', c[i].SkipFirstDay, c[i].StartDate.getFullYear(), month[c[i].StartDate.getMonth()], c[i].StartDate.getDate(), c[i].EndDate.getFullYear(), month[c[i].EndDate.getMonth()], c[i].EndDate.getDate())
}

c = dc.get_year_chunks()

console.log('Chunks count: %d', c.length)
for (let i = 0; i < c.length; i++) {
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    console.log('SkipFirstDay: %s Start date: %d %s %d End date: %d %s %d', c[i].SkipFirstDay, c[i].StartDate.getFullYear(), month[c[i].StartDate.getMonth()], c[i].StartDate.getDate(), c[i].EndDate.getFullYear(), month[c[i].EndDate.getMonth()], c[i].EndDate.getDate())
}

//console.log(new Date(2025, 0, 29))
//console.log(dateAddMonths(new Date(2025, 0, 29), 1))

//расчет доходности вклада с выплатой процентов в конце срока (без капитализации)  проверено
function calcDeposit(depositSum, interestRate, startDate, endDate, includeFirstDay) {
    let daysCount = getDaysDiff(startDate, endDate)
    if (includeFirstDay) {
        daysCount = daysCount + 1
    }
    return depositSum * interestRate * daysCount / getYearDaysCount(endDate.getFullYear())
}

/*
DepositSum = 100000 * 100      //первоначальная сумма вклада
InterestRate = 0.21        //годовая процентная ставка в долях
DepositLength = 121           //срок вклада в месяцах или днях
startDate = new Date()
endDate = dateAddDays(startDate, DepositLength)

let c = get_year_chunks(startDate, endDate)
console.log('Chunks count: %d', c.length)
for (let i = 0; i < c.length; i++) {
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    console.log('Start date: %d %s %d End date: %d %s %d', c[i].StartDate.getFullYear(), month[c[i].StartDate.getMonth()], c[i].StartDate.getDate(), c[i].EndDate.getFullYear(), month[c[i].EndDate.getMonth()], c[i].EndDate.getDate())
}
    */

