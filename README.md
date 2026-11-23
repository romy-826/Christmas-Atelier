# 圣诞树小屋 · Christmas Atelier

当前网站最新版源码：三款实时 3D 圣诞树、自由挂饰、紧凑可折叠收藏栏、半高顶部栏，以及以初始大小为下限的滚轮/双指放大。

## 上传 GitHub

1. 解压本压缩包。
2. 新建 GitHub 仓库，默认分支使用 `main`。
3. 将解压后的全部内容上传到仓库根目录，包括 `.github` 目录。不要只把 ZIP 文件本身上传，也不要在外面再套一层文件夹。
4. 提交后，仓库根目录应能看到 `README.md`、`dist`、`.github` 等内容。

## 发布 GitHub Pages

1. 打开仓库的 **Settings → Pages**。
2. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
3. 打开 **Actions → Deploy GitHub Pages → Run workflow**，选择 `main` 并运行。
4. 等待部署成功，在工作流结果或 Pages 设置中打开网站链接。

以后向 `main` 提交更新，会自动重新发布 `dist/`。如果使用其他默认分支，请修改 `.github/workflows/pages.yml` 中的 `branches`。

配置依据：[GitHub Pages 自定义工作流官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 本地运行

需要已安装 Node.js，无需安装 npm 依赖。

```sh
npm start
```

或运行 `node preview.cjs`。Windows 也可双击 `启动小屋.cmd`。
访问 <http://127.0.0.1:5173>，不要直接双击 HTML 文件。

## 目录

- `dist/`：可直接部署的静态网站与全部素材。
- `dist/game.js`：场景、取景、挂饰交互和保存。
- `dist/detail.js`：枝叶、缎带和材质。
- `dist/style.css`、`dist/edit-ui.js`：界面布局。
- `dist/vendor/`：本地 Three.js 依赖及原始许可。
- `.github/workflows/pages.yml`：GitHub Pages 部署工作流。
- `preview.cjs`：仅使用 Node.js 内置模块的本地服务器。

## 数据与素材

玩家布置保存在当前浏览器的 localStorage。换到 GitHub Pages 域名后，不会自动带入旧网站的布置。
程序树与挂饰是实时 3D 几何，房间是静态背景。需要支持 WebGL 的现代浏览器。

Three.js 使用 MIT 许可，详见 `dist/vendor/LICENSE`。其他源码和视觉素材未在此额外授予开源许可；公开仓库前请自行确认素材使用权限。

本包不含 Git 历史、Sites 项目标识、账号凭据或玩家保存数据。
