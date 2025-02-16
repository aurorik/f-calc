const credit = require('./creditCalc');
const helpers = require('./helpers');

test('calcDailyOverpayment for CreditSum = 1000, InterestRate = 1.8%, CreditLength = 16 days', () => {
  let creditSum = 1000 * 100    // первоначальная сумма вклада
  let interestRate = 1.8        // процентная ставка в день
  let creditLength = 16         // на сколько дней берется кредит

  expect(helpers.roundNumber(credit.calcDailyOverpayment(creditSum, interestRate, creditLength))).toBe("288.00");
});

test('calcCreditMonthlyPayment for CreditSum = 1000, InterestRate = 21%, CreditLength = 12 months', () => {
  let creditSum = 1000 * 100    // первоначальная сумма вклада
  let interestRate = 0.21 / 12  // процентная ставка в месяц в долях
  let creditLength = 12         // на сколько месяцев берется кредит

  expect(helpers.roundNumber(credit.calcCreditMonthlyPayment(creditSum, interestRate, creditLength))).toBe("93.11");
});

test('calcCreditMonthlyOverpayment for CreditSum = 1000, InterestRate = 21%, CreditLength = 12 months', () => {
  let creditSum = 1000 * 100    // первоначальная сумма вклада
  let interestRate = 0.21 / 12  // процентная ставка в месяц в долях
  let creditLength = 12         // на сколько месяцев берется кредит

  let monthlyPayment = credit.calcCreditMonthlyPayment(creditSum, interestRate, creditLength)
  expect(helpers.roundNumber(credit.calcCreditMonthlyOverpayment(monthlyPayment, creditLength, creditSum))).toBe("117.37");
});