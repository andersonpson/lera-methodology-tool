# Lera Webhook Auto Deploy

This guide enables automatic deploys when you push to GitHub.

## What It Does

When you push to `main`:

1. GitHub sends a webhook to your server
2. The server verifies the webhook secret
3. The server runs `git pull --ff-only origin main`
4. If new code arrived, the process exits once
5. `systemd` starts it again automatically

That means your usual flow becomes:

```bash
git add .
git commit -m "Update frontend"
git push
```

And the server updates itself.

## Important Note

GitHub recommends using HTTPS and a webhook secret for security.

## 1. Pick A Webhook Secret

Choose a long random string. Example format:

```text
lera-webhook-2026-very-long-random-secret
```

Do not put spaces in it.

## 2. Add Deploy Environment Variables To systemd

On your server, edit the service file:

```bash
sudo nano /etc/systemd/system/lera.service
```

Inside the `[Service]` block, make sure these lines exist:

```ini
Environment=LERA_DEPLOY_REPO=andersonpson/lera-methodology-tool
Environment=LERA_DEPLOY_BRANCH=main
Environment=LERA_DEPLOY_WEBHOOK_SECRET=replace-with-your-secret
Environment=LERA_DEPLOY_RESTART=1
```

Replace `replace-with-your-secret` with your real secret string.

Then reload and restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart lera
sudo systemctl status lera --no-pager
```

## 3. Add A GitHub Webhook

Open your repository on GitHub:

```text
https://github.com/andersonpson/lera-methodology-tool
```

Then:

1. Click `Settings`
2. Click `Webhooks`
3. Click `Add webhook`

Fill the form like this:

- Payload URL:

```text
http://43.134.115.245:8080/api/deploy-webhook
```

- Content type:

```text
application/json
```

- Secret:

Use the exact same secret you put in `lera.service`

- Which events:

Choose:

```text
Just the push event
```

- Active:

Leave checked

Then click:

```text
Add webhook
```

## 4. Check The First Delivery

After saving, GitHub will usually send a `ping`.

If the webhook is correct, you should see a successful delivery in the GitHub webhook page.

## 5. Test A Real Auto Deploy

Make a tiny frontend change locally, then:

```bash
git add .
git commit -m "Test webhook deploy"
git push
```

Then on the server, watch the logs:

```bash
journalctl -u lera -f
```

You should see the process restart once after the webhook runs.

## 6. How To Know It Worked

You can check:

```bash
sudo systemctl status lera --no-pager
```

And:

```bash
journalctl -u lera -n 50 --no-pager
```

## 7. Common Problems

### GitHub says the webhook failed

Check:

```bash
journalctl -u lera -n 100 --no-pager
```

### The secret is wrong

GitHub will send the request, but the server will reject it.

### The repository is private

Then `git pull` on the server must already work without asking for a username or password.

If your repo is public, this is simpler.

### The code pulls but backend changes do not apply

This guide already schedules a process restart after successful pull, so backend code changes should also apply.
