# Git
- Install [Git](https://git-scm.com/)
    ```
    git config --global user.email "a.baibikova@outlook.com"
    git config --global user.name "a.baibikova"
    ```
    
# Install Node.js
- [Doc](https://nodejs.org/en)
- Run
    ```
    mkdir %appdata%\npm
    ```

# Create a new project
- [Doc](https://lokalise.com/blog/how-to-internationalize-react-application-using-i18next)
- Run
    ```
    npx create-react-app f-calc
    ```

# Install i18next
- Run
    ```
    npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend
    ```
- Run
    ```
    npx npm-check-updates -u
    npm install
    npm install react-scripts --save
    ```

# Run app
```
npm start
```

# File structure
- First, create a *locales* folder inside the *public* directory of your app
- Inside the *en*, *rus*, and *tat* folders, create *translation.json* files
- Create a new *src/i18n.js*
- Open the *src/index.js* file and add *i18n.js* to the list of imports
- Open the *src/App.js* and add
    ```
    import { Suspense } from 'react';
    import { useTranslation} from 'react-i18next';
    ```

https://lokalise.com/blog/how-to-internationalize-react-application-using-i18next/

https://www.w3schools.com/howto/howto_js_tabs.asp

```
Date {
	int Year;
	int Month;
	int Day;

	Date()
	{
	set Year/Month/Day to the current date
	}

	Date(int year, int month, int day)
	{
		Year = year;
		Month = month;
		Day = day;
	}

	Date(Date v)
	{
		Year = v.Year;
		Month = v.Month;
		Day = v.Day;
	}
}


let myDate = new Date()
let myNewYear = new Date(2025, 1, 1)
let myDateCopy1 = myNewYear; //myDateCopy1 будет содержать ссылку на myNewYear

let myDateCopy = new Date(myNewYear) //myDateCopy будет содержать копию myNewYear
```