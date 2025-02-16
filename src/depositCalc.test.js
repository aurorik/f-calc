const deposit = require('./depositCalc');
const helpers = require('./helpers');

test('calcDeposit for CreditSum = 1000, InterestRate = 21%, DepositLength = 23 months', () => {
    let depositSum = 100000 * 100   //первоначальная сумма вклада
    let interestRate = 0.21         //годовая процентная ставка в долях
    let depositLength = 23          //срок вклада в месяцах
    let startDate = new Date()
    let endDate = helpers.dateAddMonths(startDate, depositLength)

    let accInterest = 0             //накопленная сумма
    //let chunks = helpers.get_year_chunks(startDate, endDate)
    let chunks = helpers.getDateRangeChopper(startDate, endDate).get_year_chunks()
    for (let i = 0; i < chunks.length; i++) {
        accInterest = accInterest + deposit.calcDeposit(depositSum, interestRate, chunks[i].StartDate, chunks[i].EndDate, chunks[i].SkipFirstDay)
    }
    expect(helpers.roundNumber(depositSum + accInterest)).toBe("140216.44");
});

test('calcDeposit for CreditSum = 1000, InterestRate = 21%, DepositLength = 1 months, StartDate = Jan 1', () => {
    let depositSum = 100000 * 100   //первоначальная сумма вклада
    let interestRate = 0.21         //годовая процентная ставка в долях
    let depositLength = 1           //срок вклада в месяцах
    let startDate = new Date(2025, 0, 1)
    let endDate = helpers.dateAddMonths(startDate, depositLength)

    let accInterest = 0             //накопленная сумма
    let chunks = helpers.getDateRangeChopper(startDate, endDate).get_year_chunks()
    for (let i = 0; i < chunks.length; i++) {
        accInterest = accInterest + deposit.calcDeposit(depositSum, interestRate, chunks[i].StartDate, chunks[i].EndDate, chunks[i].SkipFirstDay)
    }
    expect(helpers.roundNumber(depositSum + accInterest)).toBe("101783.56");
});
//https://calcus.ru/kalkulyator-vkladov
test('calcDeposit with Cap Monthly for CreditSum = 1000, InterestRate = 21%, DepositLength = 23 months', () => {
    let depositSum = 100000 * 100   //первоначальная сумма вклада
    let interestRate = 0.21         //годовая процентная ставка в долях
    let depositLength = 23          //срок вклада в месяцах
    let startDate = new Date()
    let endDate = helpers.dateAddMonths(startDate, depositLength)

    //let accInterest = 0             //накопленная сумма
    let chunks = helpers.getDateRangeChopper(startDate, endDate).get_month_chunks()
    for (let i = 0; i < chunks.length; i++) {
        depositSum = depositSum + deposit.calcDeposit(depositSum, interestRate, chunks[i].StartDate, chunks[i].EndDate, chunks[i].SkipFirstDay)
    }
    expect(helpers.roundNumber(depositSum)).toBe("140216.44");
});

test('calcDeposit with Cap Monthly for CreditSum = 1000, InterestRate = 21%, DepositLength = 10 months, StartDate = Jan 1', () => {
    let depositSum = 100000 * 100   //первоначальная сумма вклада
    let interestRate = 0.21         //годовая процентная ставка в долях
    let depositLength = 10          //срок вклада в месяцах
    let startDate = new Date(2025, 0, 1)
    let endDate = helpers.dateAddMonths(startDate, depositLength)

    let chunks = helpers.getDateRangeChopper(startDate, endDate).get_month_chunks()
    for (let i = 0; i < chunks.length; i++) {
        depositSum = depositSum + deposit.calcDeposit(depositSum, interestRate, chunks[i].StartDate, chunks[i].EndDate, chunks[i].SkipFirstDay)
    }
    expect(helpers.roundNumber(depositSum)).toBe("118933.08");
});

test('calcDepositWithCapDailyByMonth for CreditSum = 1000, InterestRate = 21%, DepositLength = 13 months', () => {
    let depositSum = 100000 * 100   //первоначальная сумма вклада
    let interestRate = 0.21         //годовая процентная ставка в долях
    let depositLength = 13          //срок вклада в месяцах
    let startDate = new Date()
    let endDate = helpers.dateAddMonths(startDate, depositLength)

    //chunks = helpers.get_year_chunks(startDate, endDate)
    let chunks = helpers.getDateRangeChopper(startDate, endDate).get_year_chunks()
    if (startDate.getFullYear() != endDate.getFullYear()) {
        for (let i = 0; i < chunks.length; i++) {
            depositSum = deposit.calcDepositWithCapDailyByMonth(depositSum, interestRate, chunks[i].StartDate, chunks[i].EndDate, chunks[i].SkipFirstDay)
        }
    }
    else {
        depositSum = deposit.calcDepositWithCapDailyByMonth(depositSum, interestRate, chunks[i].StartDate, chunks[i].EndDate, false)
    }
    expect(helpers.roundNumber(depositSum)).toBe("125579.66");
});

test('calcDepositWithCapDailyByMonth for CreditSum = 1000, InterestRate = 21%, DepositLength = 1 months, StartDate = Jan 1', () => {
    let depositSum = 100000 * 100   //первоначальная сумма вклада
    let interestRate = 0.21         //годовая процентная ставка в долях
    let depositLength = 1           //срок вклада в месяцах
    let startDate = new Date(2025, 0, 1)
    let endDate = helpers.dateAddMonths(startDate, depositLength)

    if (startDate.getFullYear() != endDate.getFullYear()) {
        let chunks = helpers.getDateRangeChopper(startDate, endDate).get_year_chunks()
        for (let i = 0; i < chunks.length; i++) {
            depositSum = deposit.calcDepositWithCapDailyByMonth(depositSum, interestRate, chunks[i].StartDate, chunks[i].EndDate, chunks[i].SkipFirstDay)
        }
    }
    else {
        depositSum = deposit.calcDepositWithCapDailyByMonth(depositSum, interestRate, startDate, endDate, true)
    }
    expect(helpers.roundNumber(depositSum)).toBe("101799.04");
});