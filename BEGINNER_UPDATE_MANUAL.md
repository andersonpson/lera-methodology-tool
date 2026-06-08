# Lera 新手更新手册

这份手册是给现在的你用的。

目标只有一个：

- 以后你修改前端后，能自己把线上网站更新成功

不要试图一次记住所有东西。
你只需要按顺序复制命令。

---

## 1. 你现在的项目信息

### 本地电脑上的项目目录

```bash
/Users/puppyhome/Downloads/毕业论文代写/方法论工具_副本
```

### GitHub 仓库

```text
https://github.com/andersonpson/lera-methodology-tool
```

### 服务器信息

- 服务器 IP：`43.134.115.245`
- 服务器项目目录：`/home/ubuntu/lera-methodology-tool`
- 常驻服务名称：`lera`

### 当前网站地址

```text
http://43.134.115.245:8080
```

---

## 2. 你以后最常用的完整更新流程

以后每次你改了前端，按这个顺序做。

### 第一步：在本地修改文件

你平时主要会改这些文件：

- `index.html`
- `home.css`
- `home.js`
- `style.css`
- `methodology.html`
- `app.js`
- `restaurant-database/` 里的页面和脚本

改完以后，建议你先本地看一眼，再上传。

---

### 第二步：把本地修改推到 GitHub

在你自己电脑的终端里执行：

```bash
git -C "/Users/puppyhome/Downloads/毕业论文代写/方法论工具_副本" add .
git -C "/Users/puppyhome/Downloads/毕业论文代写/方法论工具_副本" commit -m "Update frontend"
git -C "/Users/puppyhome/Downloads/毕业论文代写/方法论工具_副本" push
```

说明：

- `add .`：把你改过的内容加入本次上传
- `commit -m`：写一条更新说明
- `push`：推送到 GitHub

如果第二条提示：

```text
nothing to commit
```

说明你这次没有新改动，或者改动已经提交过了。

---

### 第三步：登录服务器

在你自己电脑的终端里执行：

```bash
ssh ubuntu@43.134.115.245
```

如果提示输入密码，就输入服务器密码。

---

### 第四步：让服务器拉取最新代码

登录服务器后执行：

```bash
cd /home/ubuntu/lera-methodology-tool
git pull
```

这一步的意思是：

- 把 GitHub 上你刚刚推送的新代码拉到服务器

---

### 第五步：重启网站服务

继续执行：

```bash
sudo systemctl restart lera
```

这一步的意思是：

- 让服务器重新加载你刚刚更新后的代码

如果要输密码，就输入服务器密码。

---

### 第六步：检查网站是否正常

执行：

```bash
sudo systemctl status lera --no-pager
```

如果你看到类似下面这句，就说明服务正常：

```text
Active: active (running)
```

还可以再执行：

```bash
curl http://127.0.0.1:8080/api/health
```

如果返回类似：

```json
{"ok": true, "app": "lera", "files_ok": true, "instance_id": ""}
```

说明程序本身正常。

最后去浏览器打开：

```text
http://43.134.115.245:8080
```

刷新页面，看是不是已经变成最新版。

---

## 3. 最短版更新流程

如果你已经熟练了，以后只需要记住下面这两组命令。

### 本地电脑

```bash
git -C "/Users/puppyhome/Downloads/毕业论文代写/方法论工具_副本" add .
git -C "/Users/puppyhome/Downloads/毕业论文代写/方法论工具_副本" commit -m "Update frontend"
git -C "/Users/puppyhome/Downloads/毕业论文代写/方法论工具_副本" push
```

### 服务器

```bash
cd /home/ubuntu/lera-methodology-tool
git pull
sudo systemctl restart lera
```

---

## 4. 常用检查命令

### 查看服务状态

```bash
sudo systemctl status lera --no-pager
```

### 启动服务

```bash
sudo systemctl start lera
```

### 停止服务

```bash
sudo systemctl stop lera
```

### 重启服务

```bash
sudo systemctl restart lera
```

### 查看实时日志

```bash
journalctl -u lera -f
```

按 `Ctrl + C` 可以退出日志界面。

---

## 5. 遇到问题时怎么判断

### 情况 1：`git push` 失败

常见原因：

- GitHub 没登录
- token 失效
- 网络问题

先把报错内容保存下来，再处理。

---

### 情况 2：`git pull` 失败

常见原因：

- 服务器上的目录不是 Git 仓库
- 有未处理的本地改动

先执行：

```bash
cd /home/ubuntu/lera-methodology-tool
git status
```

把输出保存下来再判断。

---

### 情况 3：网站打不开

按顺序检查：

```bash
sudo systemctl status lera --no-pager
curl http://127.0.0.1:8080/api/health
```

如果服务正常但外网打不开，通常是：

- 安全组没放行
- 防火墙没放行
- 端口不对

---

### 情况 4：页面没更新

先做这三件事：

1. 浏览器强制刷新
2. 确认本地已经 `git push`
3. 确认服务器已经 `git pull` 并 `restart`

---

## 6. 你现在不要乱做的事

在你还不熟之前，先不要乱用这些命令：

```bash
git reset --hard
git clean -fd
rm -rf
```

这些命令容易把东西删掉。

如果你不知道某条命令会不会危险，先不要执行。

---

## 7. 最推荐的实际工作习惯

每次改动都按这个顺序：

1. 本地改文件
2. 本地看效果
3. `git add`
4. `git commit`
5. `git push`
6. 服务器 `git pull`
7. `sudo systemctl restart lera`
8. 浏览器检查线上效果

---

## 8. 一条最重要的原则

如果报错了，不要连续乱试很多命令。

先保留终端报错内容，再一步一步处理。

这样最安全，也最容易修好。

