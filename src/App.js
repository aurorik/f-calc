import { Suspense } from 'react';
import { useTranslation} from 'react-i18next';
import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const locales = {
  en: { title: 'English' },
  rus: { title: 'Русский' },
  tat: { title: 'Татарча' },
};

function openTab(tabName) {
  let i, elements;

  elements = document.getElementsByClassName('tabContent');
  for (i = 0; i < elements.length; i++) {
    if (elements[i].id == tabName) {
      // show the tab
      elements[i].style.display = 'block';
    }
    else {
      // hide the tab
      elements[i].style.display = 'none';
    }
  }
}
// onLoad={() => openTab('Kazan')}
function App() {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>{t('main.header')}</h1>
        <img src={logo} className="App-logo" alt="logo" onLoad={() => openTab('Kazan')}/>
      </header>
      <button>Kazan chak chak</button>
      <input type="text" id="name" name="name" required minlength="4" maxlength="8" size="10" />
      <ul>
        {Object.keys(locales).map((locale) => (
          <li key={locale}>
            <button style={{ fontWeight: i18n.resolvedLanguage === locale ? 'bold' : 'normal' }} type="submit" onClick={() => i18n.changeLanguage(locale)}>{locales[locale].title}</button>
          </li>
        ))}
      </ul>
      <div className="tab">
        <button className="tablinks" onClick={() => openTab('Credit')}>{t('tabs.loanCalc')}</button>
        <button className="tablinks" onClick={() => openTab('Microloan')}>Microloan calculater</button>
        <button className="tablinks" onClick={() => openTab('CalculatorCap')}>Calculator of deposit profitability with capitalization</button>
        <button className="tablinks" onClick={() => openTab('CalculatorNoCap')}>Calculator of deposit profitability without capitalization</button>
        <button className="tablinks" onClick={() => openTab('Inf')}>Basics of financial literacy</button>
      </div>
      
      <div id="Credit" className="tabContent">
        <h3>Калькулятор кредитов</h3>  
        <label for="name">{t('main.creditSum')}</label>
        <input type="number" id="tb1" onKeyDown={() => alert(document.getElementById('tb1').value)}></input>
        <label for="name"> ₽</label>
        <br></br>

        <label for="name">Процентная ставка  </label>
        <input
          type="number"
        ></input>
        <label for="name"> %</label>
        <br></br>

        <label for="name"> Срок кредита  </label>
        <input
          type="number"
        ></input>
        <label for="name">  месяцев</label>
        
      </div>
      
      <div id="Microloan" className="tabContent">
      <h3>Калькулятор микрозаймов</h3>  
        <label for="name">Сумма микрозайма  </label>
        <input 
         type="number"  
        ></input>
        <label for="name"> ₽</label>
        <br></br>

        <label for="name">Процентная ставка  </label>
        <input
        type="number"
        ></input>
        <label for="name"> %</label>
        <br></br>

        <label for="name"> Срок микрозайма  </label>
        <input
          type="number"
        ></input>
        <label for="name">  дней</label>
        <br></br>

        <label for="name">Бесплантные дни  </label>
        <input
          type="number"
        ></input>
        <label for="name"> дней</label>
      </div>

      <div id="CalculatorCap" className="tabContent">
      <h3>Калькулятор доходности вкладов с капитализацией</h3>  
        <label for="name">Сумма вклада  </label>
        <input 
        type="number"  
        ></input>
        <label for="name"> ₽</label>
        <br></br>

        <label for="name">Процентная ставка  </label>
        <input
          type="number"
        ></input>
        <label for="name"> %</label>
        <br></br>

        <label for="name">Периодичность капитализации </label>
        <select name="cap" id="cap-select">
          <option value="monthly">раз в месяц</option>
          <option value="daily">каждый дней</option>
        </select>
        <br></br>

        <form>
        <label for="name"> Срок вклада  </label>
        <input
          type="number"
        ></input>
        <label for="name">  </label>
        <select name="lenght" id="lenght-select">
          <option value="month"> месяцев</option>
          <option value="days"> дней</option>
        </select>
      </form>


      </div>

      <div id="CalculatorNoCap" className="tabContent">
      <h3>Калькулятор доходности вкладов без капитализацией</h3>  
        <label for="name">Сумма вклада  </label>
        <input 
        type="number"  
        ></input>
        <label for="name"> ₽</label>
        <br></br>

        <label for="name">Процентная ставка  </label>
        <input
          type="number"
        ></input>
        <label for="name"> %</label>
        <br></br>
        <form>
        <label for="name"> Срок вклада  </label>
        <input
          type="number"
        ></input>
        <label for="name">  </label>
        <select name="lenght" id="lenght-select">
          <option value="month"> месяцев</option>
          <option value="days"> дней</option>
        </select>
      </form>
      </div> 

      <div id="Inf" className="tabContent">
      <h3>Справочная информация о калькуляторах</h3>  
        <label for="name">Кредиты
        <br></br>
Кредиты — это деньги, которые заемщик получает от кредитора и обязан вернуть с процентами. Основные виды:
<br></br>
Потребительский кредит — для личных нужд.
<br></br>
Ипотечный кредит — на покупку недвижимости.
<br></br>
Автокредит — для покупки автомобиля.
<br></br>
Кредитные карты — использование средств в рамках лимита.
<br></br>
Кредиты могут быть обеспеченными (с залогом) и необеспеченными.
<br></br>
Микрозаймы
<br></br>
Микрозаймы — это небольшие суммы на короткий срок, часто с высокими процентами и минимальными требованиями к заемщику. Выдаются быстро, но могут привести к финансовым трудностям.
<br></br>
Доходность вкладов
<br></br>
Вклады — это средства, доверенные банку под проценты. Основные типы:
<br></br>
С капитализацией — проценты добавляются к вкладу, что увеличивает сумму для начисления в будущем.
Без капитализации — проценты выплачиваются по окончании срока, но не увеличивают основную сумму.
<br></br>
Заключение
<br></br>
Кредиты и микрозаймы могут помочь в финансовых вопросах, а вклады способствуют накоплению и приумножению капитала. Важно принимать взвешенные решения и консультироваться с финансовыми экспертами.</label>
      </div>
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
