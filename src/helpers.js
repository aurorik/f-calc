// копирует дату из одной переменной в другую
function copyDate(sourceDate, destDate) {
    destDate.setDate(sourceDate.getDate())
    destDate.setMonth(sourceDate.getMonth())
    destDate.setFullYear(sourceDate.getFullYear())
}

// переводит сумму из копеек в рубли и округляет до двух знаков
function roundNumber(n) {
    return (n / 100).toFixed(2)
}

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

//возвращает последний день месяца
function getLastDayOfMonth(year, month) {
    return new Date(year, month + 1, 0).getDate()
}

//разбивает на отрезки времени по годам
function get_year_chunks(startDate, endDate) {
    let chunks = []
    let once = true

    if (startDate.getFullYear() !== endDate.getFullYear()) {
        let chunkStartDate
        let chunkEndDate

        while (startDate.getFullYear() !== endDate.getFullYear()) {
            chunkStartDate = startDate
            chunkEndDate = new Date(startDate.getFullYear(), 11, 31)

            startDate = new Date(startDate.getFullYear() + 1, 0, 1)
            if (once) {
                chunks.push(new DateChunk(chunkStartDate, chunkEndDate, false))
            }
            else {
                chunks.push(new DateChunk(chunkStartDate, chunkEndDate, true))
            }
        }
        
        chunks.push(new DateChunk(dateAddDays(chunkEndDate, 1), endDate, true))
    }
    else {
        chunks.push(new DateChunk(startDate, endDate, false))
    }
    return chunks
}

//разбивает на отрезки времени по дням
function get_day_chunks(startDate, endDate) {
    let chunks = [];
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

function get_month_chunks(startDate, endDate) {
    let chunks = [];
    let day = startDate.getDate()

    if (startDate.getFullYear() !== endDate.getFullYear())
    {
        while (startDate < endDate) {
            let chunkStartDate
            let chunkEndDate

            if (startDate.getMonth() === 11) {   // December
                chunkStartDate = new Date(startDate)
                chunkEndDate = new Date(startDate.getFullYear(), 11, 31)        // last date of the current year
                if (+chunkStartDate !== +chunkEndDate) {
                    chunks.push(new DateChunk(chunkStartDate, chunkEndDate))    // chunk before the New Year
                }

                if (day !== 1) {
                    chunkStartDate = new Date(startDate.getFullYear() + 1, 0, 1)    // first date of the next year
                    chunkEndDate = dateAddMonths(startDate, 1)
                    if (+chunkStartDate !== +chunkEndDate) {
                        chunks.push(new DateChunk(chunkStartDate, chunkEndDate))    // chunk right after the New Year
                    }
                }
                startDate = dateAddMonths(startDate, 1)
            }
            else {
                if (day <= 28) {
                    chunkStartDate = new Date(startDate)
                    chunkEndDate = dateAddMonths(startDate, 1)
    
                    chunks.push(new DateChunk(chunkStartDate, chunkEndDate))
                    startDate = dateAddMonths(startDate, 1)
                }
                else {
                    let nextMonthDaysCount = getDaysInMonth(startDate.getFullYear(), startDate.getMonth() + 1)

                    if (nextMonthDaysCount >= day) {
                        chunkStartDate = new Date(startDate)

                        if (day !== startDate.getDate()) {
                            chunkEndDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, day)
                        }
                        else {
                            chunkEndDate = dateAddMonths(startDate, 1)
                        }
        
                        chunks.push(new DateChunk(chunkStartDate, chunkEndDate))
                        startDate = new Date(chunkEndDate)
                    }
                    else {
                        let nextMonthLastDay = getLastDayOfMonth(startDate.getFullYear(), startDate.getMonth() + 1)

                        chunkStartDate = new Date(startDate)
                        chunkEndDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, nextMonthLastDay)

                        chunks.push(new DateChunk(chunkStartDate, chunkEndDate))
                        startDate = new Date(chunkEndDate)
                    }
                }
            }
        }
    }
    else {
        while (startDate.getMonth() !== endDate.getMonth()) {
            let chunkStartDate
            let chunkEndDate

            if (day <= 28) {
                chunkStartDate = new Date(startDate)
                chunkEndDate = dateAddMonths(startDate, 1)

                chunks.push(new DateChunk(chunkStartDate, chunkEndDate))
                startDate = dateAddMonths(startDate, 1)
            }
            else {
                let nextMonthDaysCount = getDaysInMonth(startDate.getFullYear(), startDate.getMonth() + 1)

                if (nextMonthDaysCount >= day) {
                    chunkStartDate = new Date(startDate)

                    if (day !== startDate.getDate()) {
                        chunkEndDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, day)
                    }
                    else {
                        chunkEndDate = dateAddMonths(startDate, 1)
                    }
    
                    chunks.push(new DateChunk(chunkStartDate, chunkEndDate))
                    startDate = new Date(chunkEndDate)
                }
                else {
                    let nextMonthLastDay = getLastDayOfMonth(startDate.getFullYear(), startDate.getMonth() + 1)

                    chunkStartDate = new Date(startDate)
                    chunkEndDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, nextMonthLastDay)

                    chunks.push(new DateChunk(chunkStartDate, chunkEndDate))
                    startDate = new Date(chunkEndDate)
                }
            }
        }
    }
    return chunks
}

class DateRangeChopper {
    constructor(startDate, endDate) {
        this.startDate = startDate;
        this.startDay = startDate.getDate()
        this.endDate = endDate
    }

    // разбивает на отрезки времени по месяцам
    get_month_chunks() {
        let orgStartDate = new Date(this.startDate)
        let chunks = [];
        let once = true
    
        if (this.startDate.getFullYear() !== this.endDate.getFullYear())
        {
            while (this.startDate < this.endDate) {
                if (this.startDate.getMonth() === 11) {   // December
                    let chunkStartDate = new Date(this.startDate)
                    let chunkEndDate = new Date(this.startDate.getFullYear(), 11, 31)        // last date of the current year

                    if (once) {
                        chunks.push(new DateChunk(chunkStartDate, chunkEndDate, false))        // chunk before the New Year
                        once = false
                    }
                    else {
                        chunks.push(new DateChunk(chunkStartDate, chunkEndDate, true))        // chunk before the New Year
                    }
    
                    if (this.startDay !== 1) {
                        chunkStartDate = new Date(this.startDate.getFullYear() + 1, 0, 1)    // first date of the next year
                        chunkEndDate = dateAddMonths(this.startDate, 1)
                        if (+chunkStartDate !== +chunkEndDate) {
                            chunks.push(new DateChunk(chunkStartDate, chunkEndDate, false))    // chunk right after the New Year
                        }
                    }
    
                    this.startDate = dateAddMonths(this.startDate, 1)
                }
                else {
                    if (once) {
                        chunks.push(this.get_month_chunk(true))
                        once = false
                    }
                    else {
                        chunks.push(this.get_month_chunk(true))
                    }
                }
            }
        }
        else {
            while (this.startDate.getMonth() !== this.endDate.getMonth()) {
                if (once) {
                    chunks.push(this.get_month_chunk(true))
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
    
        if (chunkEndDate.getDate() !== this.startDay)
        {
            if (+chunkEndDate === +getLastDayOfMonth(chunkEndDate)) {
                //copyDate(dateAddDays(chunkEndDate, 1), startDate)
                this.startDate = new Date(chunkEndDate)
            }
            else {
                if (chunkEndDate.getDate() === 1) {
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

        if (this.startDate.getFullYear() !== this.endDate.getFullYear()) {
            let chunkStartDate
            let chunkEndDate

            while (this.startDate.getFullYear() !== this.endDate.getFullYear()) {
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
            chunks.push(new DateChunk(this.startDate, this.endDate, true))
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

//класс для хранения диапазона дат
class DateChunk {
    constructor(startDate, endDate, skipFirstDay) {
        this.StartDate = startDate;
        this.EndDate = endDate;
        this.SkipFirstDay = skipFirstDay
    }
} 

function getDateRangeChopper(startDate, depositLen) {
    return new DateRangeChopper(startDate, depositLen)
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
    if ((date.getFullYear() % 4 === 0) && (date.getFullYear() % 100 !== 0)) {
        return 366   
    }
    return 365
}

//сколько дней в определенном году
function getYearDaysCount(year) {
    if ((year % 4 === 0) && (year % 100 !== 0)) {
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
    if (dateCopy.getDate() !== date.getDate()) {
        dateCopy.setDate(0)
    }
    return dateCopy
}

module.exports = {
    roundNumber: roundNumber,
    copyDate: copyDate,
    dateAddMonths: dateAddMonths,
    dateAddDays: dateAddDays,
    get_year_chunks: get_year_chunks,
    getDaysDiff: getDaysDiff,
    getYearDaysCount: getYearDaysCount,
    getDateRangeChopper: getDateRangeChopper,
    getCurrentYearDaysCount: getCurrentYearDaysCount
}