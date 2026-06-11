# Lera 工具项目 README

## 当前运行入口

- 主页：`index.html`
- 方法论：`methodology.html`
- 数据库模块：`restaurant-database/`
- 本地服务：`restaurant-database/server.py`
- 本地数据库：`restaurant-database/restaurant.db`
- Web 启动脚本：`scripts/start-web.sh`
- Web 部署说明：`DEPLOY_WEB.md`
- Webhook 自动部署说明：`AUTO_DEPLOY_WEBHOOK.md`
- 全局密码：通过服务器环境变量 `LERA_AUTH_PASSWORD` 开启

## 有用文件与作用

| 文件 | 作用 |
|---|---|
| `index.html` | 工具主页入口，负责把用户引到方法论、菜品注册、数据库、方法论使用列表、编码管理。 |
| `home.css` | 工具主页专用样式。 |
| `home.js` | 工具主页的中西切换与文案渲染。 |
| `style.css` | 全局主样式，方法论页和数据库页都依赖它，按钮与排版基础也在这里。 |
| `methodology.html` | 方法论主界面页面结构。 |
| `app.js` | 方法论主逻辑，包含阶段推进、保存/读取、回退、工具记录、导出、归档跳转等核心行为。 |
| `assets/fonts/京華老宋体v3.0.ttf` | 中文界面字体资源，由 style.css 引用。 |
| `restaurant-database/server.py` | 本地 HTTP 服务与 SQLite API 层，负责 dishes / recipe / codebook / methodology 的真实读写。 |
| `restaurant-database/restaurant.db` | 真实本地 SQLite 数据库文件。 |
| `restaurant-database/database.css` | 数据库模块公共样式。 |
| `restaurant-database/index.html` | 菜品注册页结构。 |
| `restaurant-database/entry.js` | 菜品注册逻辑，包括编码、方法论关联、食谱入口、保存覆盖等。 |
| `restaurant-database/catalog.html` | 数据库总表页面结构。 |
| `restaurant-database/catalog.js` | 总表检索、主菜/副产品切换、查看/编辑/删除动作。 |
| `restaurant-database/codebook.html` | 编码管理页结构。 |
| `restaurant-database/codebook.js` | F / P 编码的新增、编辑、删除、筛选与翻译。 |
| `restaurant-database/dish-detail.html` | 已注册菜品详情页结构。 |
| `restaurant-database/dish-detail.js` | 详情页展示、跳转编辑、删除、方法论记录链接。 |
| `restaurant-database/menu-entry-template.html` | 菜谱/ ficha tecnica 录入页，含模块、步骤、计划、照片、过敏原。 |
| `restaurant-database/methodology-list.html` | 方法论使用列表页结构。 |
| `restaurant-database/methodology-list.js` | 方法论记录列表读取、检索与跳转报告。 |
| `restaurant-database/methodology-report.html` | 方法论报告页结构。 |
| `restaurant-database/methodology-report.js` | 方法论最终内容、修改记录、工具使用说明的展示逻辑。 |
| `UNUSED_FILES_REPORT.md` | 当前代码链路下的无用文件清单。 |
| `BILINGUAL_ZH_ES_REFERENCE.txt` | 从代码与编码字典提取出的完整中西对照文本。 |

## 结构说明

- `index.html + home.css + home.js`：主页入口层。
- `methodology.html + app.js + style.css`：方法论设计层。
- `restaurant-database/*.html + *.js + database.css`：餐厅数据库与菜谱录入层。
- `restaurant-database/server.py + restaurant.db`：真实本地服务与数据层。

## 建议保留

- 开发时不要只保留打包产物，应始终保留这套源码目录。
- 真正可删除的首选对象是 `restaurant-database/__pycache__/server.cpython-313.pyc` 这一类缓存文件。

## Web 部署补充

- 这套项目可以直接部署到自己的服务器，不必依赖 Electron 打包。
- 前端页面仍然是当前这套 `html + css + js`。
- 数据读写仍然通过 `restaurant-database/server.py` 暴露的 `/api/*` 完成。
- 如果你准备上传 GitHub 并上线，优先看 `DEPLOY_WEB.md`。
- 如果你想整站加一道密码门，在服务器环境里设置 `LERA_AUTH_PASSWORD` 即可。
