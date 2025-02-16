# Install Node.js
- [Doc](https://nodejs.org/en)
- Run
    ```
    mkdir %appdata%\npm
    Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted
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
    npm install --save-dev jest
    npm install ts-node
    ```
- Run
    ```
    npx npm-check-updates -u
    npm install
    ```

# Run app
```
npm start
```
https://www.thetombomb.com/posts/nextjs-on-vps

# Install on a server
- Find latest version [here](https://github.com/nvm-sh/nvm)
- Run
    ```
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    ```
- Install Node.js
    ```
    nvm install node
    npm install --global http-server
    ```
- Github settings
    - Goto https://github.com/settings/profile
    - Open *Developers settings*
    - Open *Personal access tokens* -> *Tokens (classic)* -> *Generate new token (classic)*
    - Add *note* and mark *repo*
    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
- Create dir and clone
    ```
    sudo mkdir /srv/node
    cd /srv/node
    sudo git clone https://<user_name>:<token>@github.com/corelevel/<repository>.git
    sudo git clone https://corelevel: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@github.com/corelevel/f-calc.git
    ```
- Run
    ```
    sudo mkdir /srv/node/f-calc/node_modules
    sudo mkdir /srv/node/f-calc/build
    cd /srv/node/f-calc/
    sudo mkdir ./node_modules/
    sudo mkdir ./build/
    sudo chmod -R ugo+rw ./node_modules/
    sudo chmod -R ugo+rw ./build/
    sudo chmod -R ugo+rw package-lock.json
    sudo chmod -R ugo+rw package.json
    npm install

    npm run build
    ```

# Install certbot
- Run
    ```
    sudo apt install certbot
    ```
- Download *acme-dns-auth.py*
    ```
    wget https://github.com/joohoi/acme-dns-certbot-joohoi/raw/master/acme-dns-auth.py
    sudo chmod +x acme-dns-auth.py
    ```
- Edit *acme-dns-auth.py*
    ```
    vi acme-dns-auth.py
    ```
    - Replace
        ```
        #!/usr/bin/env python
        ```
        - with
        ```
        #!/usr/bin/env python3
        ```
- Move the script
    ```
    sudo mv acme-dns-auth.py /etc/letsencrypt/
    ```
- To request a *staging* certificate corelevel@hotmail.com
    ```
    # for fin-calc.work
    sudo certbot certonly --manual --manual-auth-hook /etc/letsencrypt/acme-dns-auth.py --preferred-challenges dns --debug-challenges -d fin-calc.work --staging -v
    ```
- To request a *prod* certificate corelevel@hotmail.com
    ```
    # for fin-calc.work
    sudo certbot certonly --manual --manual-auth-hook /etc/letsencrypt/acme-dns-auth.py --preferred-challenges dns --debug-challenges -d fin-calc.work -v
    ```

# Install NGINX
- Run
    ```
    sudo apt install nginx
    ```
- Copy *index.html* to the server
    ```
    # for fin-calc.work
    sudo mkdir /var/www/html/fin-calc.work/
    ```
- Edit the NGINX config, add corresponding to the *http* section after *Virtual Host Configs*
    ```
    sudo vi /etc/nginx/nginx.conf
    ```
- Restart the NGINX Server
    ```
    sudo nginx -t
    sudo systemctl restart nginx
    ```
- To view logs
    ```
    sudo systemctl status nginx
    # or
    journalctl -u nginx --since "10 minute ago"
    ````

Certificate is saved at: /etc/letsencrypt/live/fin-calc.work/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/fin-calc.work/privkey.pem
