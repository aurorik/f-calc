import { copyDate } from './helpers.mjs';

class DateChunk {
    constructor(startDate, endDate) {
        this.StartDate = startDate;
        this.EndDate = endDate;
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

function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
}

//возвращает последний день месяца
function getLastDayOfMonth(year, month) {
    return new Date(year, month + 1, 0).getDate()
}

//возвращает последний день месяца
/*
function getLastDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}
*/

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
            copyDate(dateAddDays(chunkEndDate, 1), startDate)
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
            copyDate(dateAddDays(chunkEndDate, 1), startDate)
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

function get_month_chunk3(chunks, startDate, day) {
    let chunkStartDate = new Date(startDate)
    if (chunks.length > 0)
        chunkStartDate = dateAddDays(chunks[chunks.length - 1].EndDate, 1)
    let chunkEndDate = dateAddMonths(startDate, 1)

    if (chunkEndDate.getDate() != day)
    {
        if (+chunkEndDate == +getLastDayOfMonth(chunkEndDate)) {
            copyDate(dateAddDays(chunkEndDate, 1), startDate)
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
            copyDate(dateAddDays(chunkEndDate, 1), startDate)
        }
    }
    else {
        copyDate(dateAddMonths(startDate, 1), startDate)
    }

    return new DateChunk(chunkStartDate, chunkEndDate)
}

function get_month_chunks3(startDate, endDate) {
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
                chunks.push(get_month_chunk3(chunks, startDate, day))
            }
        }
    }
    else {
        while (startDate.getMonth() != endDate.getMonth()) {
            chunks.push(get_month_chunk3(chunks, startDate, day))
        }
    }
    return chunks
}

function get_month_chunks4(startDate, endDate) {
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
            }
            else {
                chunks.push(new DateChunk(startDate, startDate))
            }
            startDate = dateAddMonths(startDate, 1)
        }
    }
    else {
        while (startDate.getMonth() != endDate.getMonth()) {
            chunks.push(new DateChunk(startDate, startDate))
            startDate = dateAddMonths(startDate, 1)
        }
    }
    return chunks
}

function get_month_chunks5(startDate, endDate) {
    let chunks = new Array();
    let day = startDate.getDate()

    if (startDate.getFullYear() != endDate.getFullYear())
    {
        while (startDate < endDate) {
            let chunkStartDate
            let chunkEndDate

            if (startDate.getMonth() == 11) {   // December
                chunkStartDate = new Date(startDate)
                chunkEndDate = new Date(startDate.getFullYear(), 11, 31)        // last date of the current year
                if (+chunkStartDate != +chunkEndDate) {
                    chunks.push(new DateChunk(chunkStartDate, chunkEndDate))    // chunk before the New Year
                }

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

                        if (day != startDate.getDate()) {
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
        while (startDate.getMonth() != endDate.getMonth()) {
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

                    if (day != startDate.getDate()) {
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

let DepositLength = 13
//let startDate = new Date(2024, 1, 1)
//let startDate = new Date(2024, 11, 1)
//let startDate = new Date(2024, 8, 28)
//let startDate = new Date(2024, 9, 31)
let startDate = new Date(2024, 0, 31)
let endDate = dateAddMonths(startDate, DepositLength)


//console.log(getLastDayOfMonth(startDate))
//console.log(dateAddMonths(startDate, 1))
//console.log(dateAddMonths(startDate, 1))

let c = get_month_chunks5(startDate, endDate)
console.log('Chunks count: %d', c.length)
for (let i = 0; i < c.length; i++) {
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    console.log('Start date: %d %s %d End date: %d %s %d', c[i].StartDate.getFullYear(), month[c[i].StartDate.getMonth()], c[i].StartDate.getDate(), c[i].EndDate.getFullYear(), month[c[i].EndDate.getMonth()], c[i].EndDate.getDate())
}


const Seasons = Object.freeze({
	Summer: Symbol("summer"),
	Autumn: Symbol("autumn"),
	Winter: Symbol("winter"),
	Spring: Symbol("spring")
})

let a = Seasons.Autumn
//Seasons.Winter = "something else" // this won't change the `Seasons` object because its been frozen

//console.log(Seasons.Winter === a)

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