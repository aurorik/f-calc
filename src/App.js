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

      <ul>
        {Object.keys(locales).map((locale) => (
          <li key={locale}>
            <button style={{ fontWeight: i18n.resolvedLanguage === locale ? 'bold' : 'normal' }} type="submit" onClick={() => i18n.changeLanguage(locale)}>{locales[locale].title}</button>
          </li>
        ))}
      </ul>
      <div className="tab">
        <button className="tablinks" onClick={() => openTab('Kazan')}>Kazan</button>
        <button className="tablinks" onClick={() => openTab('Moscow')}>Moscow</button>
        <button className="tablinks" onClick={() => openTab('New York')}>New York</button>
      </div>
      
      <div id="Kazan" className="tabContent">
        <h3>Kazan</h3>
        <p>Kazan is the capital city of Tatarstan.</p>
      </div>

      <div id="Moscow" className="tabContent">
        <h3>Moscow</h3>
        <p>Moscow is the capital of Russia.</p>
      </div>

      <div id="New York" className="tabContent">
        <h3>New York</h3>
        <p>New York is just a big city.</p>
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
