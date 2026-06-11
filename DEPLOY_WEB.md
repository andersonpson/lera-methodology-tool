# Lera Web Deployment

This project can run as a normal web app on your own server.

## What You Need

- A Linux server with `git` and `python3`
- Your GitHub repository
- Optional: `nginx` and `systemd`

## 1. Push This Project To GitHub

Recommended:

- keep source code in GitHub
- do not upload `node_modules`
- do not upload `electron-release`
- do not upload `restaurant-database/restaurant.db` unless you intentionally want to publish that exact database file

The included `.gitignore` already covers those paths.

## 2. Clone On Your Server

```bash
cd /opt
git clone <your-github-repo-url> lera
cd /opt/lera
```

## 3. Start The Web App

```bash
bash scripts/start-web.sh
```

Default runtime values:

- host: `0.0.0.0`
- port: `8000`
- database: `restaurant-database/restaurant.db`
- auth password: disabled by default

You can override them:

```bash
LERA_PORT=8080 LERA_HOST=127.0.0.1 bash scripts/start-web.sh
```

To protect the whole app with one password:

```bash
LERA_PORT=8080 \
LERA_HOST=127.0.0.1 \
LERA_AUTH_PASSWORD='your-password-here' \
bash scripts/start-web.sh
```

When `LERA_AUTH_PASSWORD` is set:

- every page requires login first
- every `/api/*` endpoint also requires login
- GitHub webhook deploy stays available

## 4. Open The App

If you start it directly on port `8000`, open:

```text
http://your-server-ip:8000
```

## 5. Keep It Running With systemd

Copy the example service:

```bash
sudo cp deploy/lera.service.example /etc/systemd/system/lera.service
sudo systemctl daemon-reload
sudo systemctl enable --now lera
sudo systemctl status lera
```

Before enabling it, edit:

- `User=`
- `WorkingDirectory=`
- `Environment=LERA_ROOT=`
- `Environment=LERA_DB_PATH=`
- `Environment=LERA_AUTH_PASSWORD=`

## 6. Put nginx In Front

Copy the example config:

```bash
sudo cp deploy/nginx.example.conf /etc/nginx/sites-available/lera
sudo ln -s /etc/nginx/sites-available/lera /etc/nginx/sites-enabled/lera
sudo nginx -t
sudo systemctl reload nginx
```

Then replace:

- `your-domain.com`

## 7. Import Your Existing Data

You have two choices:

1. Copy your local `restaurant-database/restaurant.db` to the server
2. Start with a fresh database and import a backup JSON through the app UI

If you only care about future frontend edits, option 2 is usually cleaner.

## 8. Update The Online Version

After you change the frontend locally:

```bash
git add .
git commit -m "Update frontend"
git push
```

On the server:

```bash
cd /opt/lera
git pull
sudo systemctl restart lera
```

## Notes

- The desktop bridge is optional. In browser mode the app falls back to normal web behavior.
- Printing uses browser printing when Electron APIs are not available.
- Backup import/export already works in browser mode through `/api/backup`.
- The password gate is server-side, not a fake frontend popup.
