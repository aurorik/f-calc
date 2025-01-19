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
перевод: public/locales
открыть файл translation.json
```
{
    "main": {  вместо main можно использовать credit
      "header": "Hey, Aurora",
      "creditSum": "Сумма кредита",
      "creditLenght": "Срок кредита",
      "key3": ","
    }
}
```
 в скобках ключи
 вместо названия на русском пишем {t('main.creditSum')}, вместо creditSum ключ
