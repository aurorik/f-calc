import { Suspense } from 'react';
import { useTranslation} from 'react-i18next';
import helpers from './helpers.js';
import deposit from './depositCalc.js';
import credit from './creditCalc.js';
import './App.css';

const locales = {
  en: { title: 'English' },
  rus: { title: 'Русский' },
  tat: { title: 'Татарча' },
};

function openTab(tabName) {
  let i, elements

  elements = document.getElementsByClassName('tabContent')
  for (i = 0; i < elements.length; i++) {
    if (elements[i].id === tabName) {
      // show the tab
      elements[i].style.display = 'block'
    }
    else {
      // hide the tab
      elements[i].style.display = 'none'
    }
  }
}

function DepositNoCap() {
  if (!document.getElementById('DepositNoCap.Sum').value || !document.getElementById('DepositNoCap.InterestRate').value || !document.getElementById('DepositNoCap.Length').value) {
    document.getElementById('DepositNoCap.EndValue').innerHTML = ''
    document.getElementById('DepositNoCap.Income').innerHTML = ''
    return;
  }

  // первоначальная сумма вклада
  let depositSum = parseInt(document.getElementById('DepositNoCap.Sum').value) * 100
  if (depositSum <= 0) {
    document.getElementById('DepositNoCap.EndValue').innerHTML = ''
    document.getElementById('DepositNoCap.Income').innerHTML = ''
    return;
  }
  // годовая процентная ставка в долях
  let interestRate = parseFloat(document.getElementById('DepositNoCap.InterestRate').value) / 100
  if (interestRate <= 0) {
    document.getElementById('DepositNoCap.EndValue').innerHTML = ''
    document.getElementById('DepositNoCap.Income').innerHTML = ''
    return;
  }
  // срок вклада
  let depositLength = parseInt(document.getElementById('DepositNoCap.Length').value)
  if (depositLength <= 0) {
    document.getElementById('DepositNoCap.EndValue').innerHTML = ''
    document.getElementById('DepositNoCap.Income').innerHTML = ''
    return;
  }

  let startDate = new Date()
  let endDate
  
  // срок вклада в месяцах или днях
  if (document.getElementById("DepositNoCap.DepositLengthType").value === 'months') {
    endDate = helpers.dateAddMonths(startDate, depositLength)
  }
  else {
    endDate = helpers.dateAddDays(startDate, depositLength)
  }

  // накопленная сумма
  let accInterest = 0
  let chunks = helpers.getDateRangeChopper(startDate, endDate).get_year_chunks()
  for (let i = 0; i < chunks.length; i++) {
      accInterest = accInterest + deposit.calcDeposit(depositSum, interestRate, chunks[i].StartDate, chunks[i].EndDate, chunks[i].SkipFirstDay)
  }

  document.getElementById('DepositNoCap.EndValue').innerHTML = helpers.roundNumber(depositSum + accInterest)
  document.getElementById('DepositNoCap.Income').innerHTML = helpers.roundNumber(accInterest)
}

function DepositCap() {
  if (!document.getElementById('DepositCap.Sum').value || !document.getElementById('DepositCap.InterestRate').value || !document.getElementById('DepositCap.Length').value) {
    document.getElementById('DepositCap.EndValue').innerHTML = ''
    document.getElementById('DepositCap.Income').innerHTML = ''
    return;
  }
  
  // первоначальная сумма вклада
  let depositSum = parseInt(document.getElementById('DepositCap.Sum').value) * 100
  if (depositSum <= 0) {
    document.getElementById('DepositCap.EndValue').innerHTML = ''
    document.getElementById('DepositCap.Income').innerHTML = ''
    return;
  }

  // годовая процентная ставка в долях
  let interestRate = parseFloat(document.getElementById('DepositCap.InterestRate').value) / 100
  if (interestRate <= 0) {
    document.getElementById('DepositCap.EndValue').innerHTML = ''
    document.getElementById('DepositCap.Income').innerHTML = ''
    return;
  }

  // срок вклада
  let depositLength = parseInt(document.getElementById('DepositCap.Length').value)
  if (depositLength <= 0) {
    document.getElementById('DepositCap.EndValue').innerHTML = ''
    document.getElementById('DepositCap.Income').innerHTML = ''
    return;
  }

  let startDate = new Date()
  let endDate
  
  // срок вклада в месяцах или днях
  if (document.getElementById("DepositCap.DepositLengthType").value === 'months') {
    console.log('DepositLengthType.months')
    endDate = helpers.dateAddMonths(startDate, depositLength)
  }
  else {
    console.log('DepositLengthType.days')
    endDate = helpers.dateAddDays(startDate, depositLength)
  }

  let depositSumInitial = depositSum
  // капитализация ежемесячно или ежедневно
  if (document.getElementById("DepositCap.CapType").value === 'months') {
    console.log('CapType.months')
    let chunks = helpers.getDateRangeChopper(startDate, endDate).get_month_chunks()
    for (let i = 0; i < chunks.length; i++) {
        depositSum = depositSum + deposit.calcDeposit(depositSum, interestRate, chunks[i].StartDate, chunks[i].EndDate, chunks[i].SkipFirstDay)
    }
  }
  else {
    console.log('CapType.days')
    if (startDate.getFullYear() !== endDate.getFullYear()) {
        let chunks = helpers.getDateRangeChopper(startDate, endDate).get_year_chunks()
        for (let i = 0; i < chunks.length; i++) {
            depositSum = deposit.calcDepositWithCapDailyByMonth(depositSum, interestRate, chunks[i].StartDate, chunks[i].EndDate, chunks[i].SkipFirstDay)
        }
    }
    else {
        depositSum = deposit.calcDepositWithCapDailyByMonth(depositSum, interestRate, startDate, endDate, true)
    }
  }

  document.getElementById('DepositCap.EndValue').innerHTML = helpers.roundNumber(depositSum)
  document.getElementById('DepositCap.Income').innerHTML = helpers.roundNumber(depositSum - depositSumInitial)
}

function Loan() {
  if (!document.getElementById('Loan.Sum').value || !document.getElementById('Loan.InterestRate').value || !document.getElementById('Loan.Length').value) {
    document.getElementById('Loan.MonthlyPayment').innerHTML = ''
    document.getElementById('Loan.Overpayment').innerHTML = ''
    document.getElementById('Loan.TotalPayment').innerHTML = ''
    return;
  }

  // первоначальная сумма кредита
  let creditSum = parseInt(document.getElementById('Loan.Sum').value) * 100
  if (creditSum <= 0) {
    document.getElementById('Loan.MonthlyPayment').innerHTML = ''
    document.getElementById('Loan.Overpayment').innerHTML = ''
    document.getElementById('Loan.TotalPayment').innerHTML = ''
    return;
  }
  // процентная ставка в месяц в долях
  let interestRate = parseFloat(document.getElementById('Loan.InterestRate').value) / (12 * 100)
  if (interestRate <= 0) {
    document.getElementById('Loan.MonthlyPayment').innerHTML = ''
    document.getElementById('Loan.Overpayment').innerHTML = ''
    document.getElementById('Loan.TotalPayment').innerHTML = ''
    return;
  }
  // срок кредита
  let creditLength = parseInt(document.getElementById('Loan.Length').value)
  if (creditLength <= 0) {
    document.getElementById('Loan.MonthlyPayment').innerHTML = ''
    document.getElementById('Loan.Overpayment').innerHTML = ''
    document.getElementById('Loan.TotalPayment').innerHTML = ''
    return;
  }

  let monthlyPayment = credit.calcCreditMonthlyPayment(creditSum, interestRate, creditLength)
  let overpayment = credit.calcCreditMonthlyOverpayment(creditSum, monthlyPayment, creditLength)

  document.getElementById('Loan.MonthlyPayment').innerHTML = helpers.roundNumber(monthlyPayment)
  document.getElementById('Loan.Overpayment').innerHTML = helpers.roundNumber(overpayment)
  document.getElementById('Loan.TotalPayment').innerHTML = helpers.roundNumber(monthlyPayment * creditLength)
}

function Microloan() {
  if (!document.getElementById('Microloan.Sum').value || !document.getElementById('Microloan.InterestRate').value
    || !document.getElementById('Microloan.Length').value || !document.getElementById('Microloan.FreeDays').value) {
    document.getElementById('Microloan.Overpayment').innerHTML = ''
    document.getElementById('Microloan.TotalPayment').innerHTML = ''
    return;
  }

  // первоначальная сумма кредита
  let creditSum = parseInt(document.getElementById('Microloan.Sum').value) * 100
  if (creditSum <= 0) {
    document.getElementById('Microloan.Overpayment').innerHTML = ''
    document.getElementById('Microloan.TotalPayment').innerHTML = ''
    return;
  }
  // процентная ставка в день
  let interestRate = parseFloat(document.getElementById('Microloan.InterestRate').value)
  if (interestRate <= 0) {
    document.getElementById('Microloan.Overpayment').innerHTML = ''
    document.getElementById('Microloan.TotalPayment').innerHTML = ''
    return;
  }
  // на сколько дней берется кредит
  let creditLength = parseInt(document.getElementById('Microloan.Length').value)
  if (creditLength <= 0) {
    document.getElementById('Microloan.Overpayment').innerHTML = ''
    document.getElementById('Microloan.TotalPayment').innerHTML = ''
    return;
  }
  // количество бесплатных дней
  let freeDays = parseInt(document.getElementById('Microloan.FreeDays').value)
  if (freeDays < 0 || freeDays > creditLength) {
    document.getElementById('Microloan.Overpayment').innerHTML = ''
    document.getElementById('Microloan.TotalPayment').innerHTML = ''
    return;
  }

  let overpayment = credit.calcDailyOverpayment(creditSum, interestRate, creditLength - freeDays)

  document.getElementById('Microloan.Overpayment').innerHTML = helpers.roundNumber(overpayment)
  document.getElementById('Microloan.TotalPayment').innerHTML = helpers.roundNumber(overpayment + creditSum)
  document.getElementById('Microloan.AnnualRate').innerHTML = helpers.roundNumber(helpers.getCurrentYearDaysCount() * interestRate * 100)
}

function App() {
  const { t, i18n } = useTranslation();

  return (
    <div className="App">
      <div class="container">
        <div class="header">
            <h1>{t('main.header')}</h1>
        </div>
        <div class="wrapper clearfix">
            <div class="nav" align="left">
              <ul>
                <li><a onClick={() => openTab('Loan')}>{t('tabs.LoanCalc')}</a></li>
                <li><a onClick={() => openTab('Microloan')}>{t('tabs.MicroloanCalc')}</a></li>
                <li><a onClick={() => openTab('DepositCap')}>{t('tabs.DepositCap')}</a></li>
                <li><a onClick={() => openTab('DepositNoCap')}>{t('tabs.DepositNoCap')}</a></li>
                <li><a onClick={() => openTab('Inf')}>{t('tabs.Inf')}</a></li>
                <li><a onClick={() => openTab('About')}>{t('tabs.About')}</a></li>
              </ul>
            </div>
            <div class="section">
        
            <div id="Loan" className="tabContent">
              <h3>{t('tabs.LoanCalc')}</h3>

              <div>
                {t('main.loanAm')}
                <input type="number" id="Loan.Sum" onInput={() => Loan()}></input>
                &nbsp;{t('misc.Currency')}
              </div>

              <div>
                {t('main.intRate')}
                <input type="number" id="Loan.InterestRate" onInput={() => Loan()}></input>
                &nbsp;%
              </div>

              <div>
                {t('main.loanTerm')}
                <input type="number" id="Loan.Length" onInput={() => Loan()}></input>
                {t('main.months')}
              </div>

              <div>
                {t('main.monthlyPayment')}<label id="Loan.MonthlyPayment"></label>
                &nbsp;{t('misc.Currency')}
              </div>
              
              <div>
                {t('main.overpayment')}<label id="Loan.Overpayment"></label>
                &nbsp;{t('misc.Currency')}
              </div>

              <div>
                {t('main.totalPayment')}<label id="Loan.TotalPayment"></label>
                &nbsp;{t('misc.Currency')}
              </div>
            </div>

            <div id="Microloan" className="tabContent">
              <h3>{t('tabs.MicroloanCalc')}</h3>

              <div>
                {t('main.microloanAm')}
                <input type="number" id="Microloan.Sum" onInput={() => Microloan()}></input>
                &nbsp;{t('misc.Currency')}
              </div>
              <div>
                {t('main.intRate')}
                <input type="number" id="Microloan.InterestRate" onInput={() => Microloan()}></input>
                &nbsp;%
              </div>

              <div>
                {t('main.microloanTerm')}
                <input type="number" id="Microloan.Length" onInput={() => Microloan()}></input>
                {t('main.days')}
              </div>

              <div>
                {t('main.freeDays')}
                <input type="number" id="Microloan.FreeDays" onInput={() => Microloan()}></input>
                {t('main.days')}
              </div>

              <div>
                {t('main.overpayment')}<label id="Microloan.Overpayment"></label>
                &nbsp;{t('misc.Currency')}
              </div>

              <div>
                {t('main.totalPayment')}<label id="Microloan.TotalPayment"></label>
                &nbsp;{t('misc.Currency')}
              </div>

              <div>
                {t('main.annualRate')}<label id="Microloan.AnnualRate"></label>
                &nbsp;%
              </div>
            </div>

            <div id="DepositCap" className="tabContent">              <h3>{t('tabs.DepositCap')}</h3>

              <div>
                {t('main.depositAm')}
                <input type="number" id="DepositCap.Sum" onInput={() => DepositCap()}></input>
                &nbsp;{t('misc.Currency')}
              </div>

              <div>
                {t('main.intRate')}
                <input type="number" id="DepositCap.InterestRate" onInput={() => DepositCap()}></input>
                &nbsp;%
              </div>

              <div>
                {t('main.Cap')}
                <select id="DepositCap.CapType" onChange={() => DepositCap()}>
                  <option value="months">{t('main.monthly')}</option>
                  <option value="daily">{t('main.daily')}</option>
                </select>
              </div>

              <div>
                {t('main.depositTerm')}
                <input type="number" id="DepositCap.Length" onInput={() => DepositCap()}></input>
                <select id="DepositCap.DepositLengthType" onInput={() => DepositCap()}>
                  <option value="months">{t('main.months')}</option>
                  <option value="days">{t('main.days')}</option>
                </select>
              </div>

              <div>
                {t('main.income')}<label id="DepositCap.Income"></label>
                &nbsp;{t('misc.Currency')}
              </div>
              
              <div>
                {t('main.endValue')}<label id="DepositCap.EndValue"></label>
                &nbsp;{t('misc.Currency')}
              </div>
            </div>
      
            <div id="DepositNoCap" className="tabContent">
              <h3>{t('tabs.DepositNoCap')}</h3>

              <div>
                {t('main.depositAm')}
                <input type="number" id="DepositNoCap.Sum" onInput={() => DepositNoCap()}></input>
                &nbsp;{t('misc.Currency')}
              </div>

              <div>
                {t('main.intRate')}
                <input type="number" id="DepositNoCap.InterestRate" onInput={() => DepositNoCap()}></input>
                &nbsp;%
              </div>

              <div>
                {t('main.depositTerm')}
                <input type="number" id="DepositNoCap.Length" onInput={() => DepositNoCap()}></input>
                <select id="DepositNoCap.DepositLengthType" onChange={() => DepositNoCap()}>
                  <option value="months">{t('main.months')}</option>
                  <option value="days">{t('main.days')}</option>
                </select>
              </div>
             
              <div>
                {t('main.income')}&nbsp;<label id="DepositNoCap.Income"></label>
                &nbsp;{t('misc.Currency')}
              </div>
                
              <div>
                {t('main.endValue')}&nbsp;<label id="DepositNoCap.EndValue"></label>
                &nbsp;{t('misc.Currency')}
              </div>
            </div> 

            <div id="Inf" className="tabContent">
            <h3>{t('tabs.Inf')}</h3>  
              {t('main.fullInf')}
            </div>

            <div id="About" className="tabContent">
            <h3>{t('tabs.About')}</h3>  
              {t('main.about')}
            </div>

            </div>
        </div>
        <div class="footer">
          <div>
            {Object.keys(locales).map((locale) => (
            <a style={{ cursor: 'pointer', fontWeight: i18n.resolvedLanguage === locale ? 'bold' : 'normal' }} onClick={() => i18n.changeLanguage(locale)}>{locales[locale].title}&nbsp;&nbsp;</a>
            ))}
          </div>
          <div>{t('misc.Copyright')}</div>
        </div>
    </div>
    <br></br>
    <img src="1x1.png" onLoad={() => openTab('Loan')}/>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Suspense fallback="...loading">
      <App />
    </Suspense>
  )
}
