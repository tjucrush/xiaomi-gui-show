# Xiaomi-GUI-Show

一个以真实交互流程为核心的静态展示网站，集中呈现界面自动化演示、案例轨迹、评测结果和方法架构。
项目采用原生 HTML、CSS 和 JavaScript 构建，无运行时后端，打开即可浏览，也可以直接部署到 GitHub Pages。

<p align="center">
	<a href="https://tjucrush.github.io/xiaomi-gui-show/">在线访问网站</a>
	&nbsp;&nbsp;·&nbsp;&nbsp;
	<a href="https://github.com/tjucrush/xiaomi-gui-show">查看 GitHub 仓库</a>
</p>

## 项目内容

页面按照从概览到结果的阅读路径组织：

- **Overview**：快速了解展示内容、执行基础和任务评估方向。
- **Demos**：三个视频连续纵向展示，每个视频配有任务说明和操作流程。
- **Cases**：通过两组案例图查看完整执行与中途恢复过程。
- **Approach**：展示执行基础设施、数据构建、错误改进和渐进式训练流程。
- **Benchmark**：呈现任务规模、应用分布和多应用任务结构。
- **Results**：展示不同模型的具体对比名称、成功率和任务进度。

## 交互亮点

- 三个演示视频直接从上到下连续浏览，不需要左右切换。
- 评测柱状图进入视口后自动播放增长动画。
- 案例图片支持点击放大，并支持关闭按钮、背景点击和 `Esc` 键退出。
- 移动端导航自动折叠，适配窄屏浏览。
- 桌面端提供橙色跟随式鼠标光标和交互元素悬停反馈。
- `prefers-reduced-motion` 开启时自动减少动画。
- 页面资源全部使用本地图片、视频和脚本，适合静态托管。

## 目录结构

```text
.
├── index.html                页面结构与展示内容
├── style.css                 品牌视觉、响应式布局与动效
├── script.js                 图表动画、菜单和灯箱交互
├── assets/
│   ├── figs/                 图表与案例图片
│   ├── logo/                 Xiaomi 标识资源
│   └── videos/               三个本地演示视频
├── scripts/
│   ├── build.py              生成 _site 发布目录
│   ├── check_site.py         检查锚点和本地资源
│   └── browser-check.cjs     浏览器交互检查
├── .github/workflows/
│   └── pages.yml             GitHub Pages 自动部署
└── _site/                    本地构建生成的发布目录
```

## 本地运行

项目不需要安装前端依赖。使用 Python 启动本地静态服务器：

```powershell
python -m http.server 8780
```

然后打开：

```text
http://127.0.0.1:8780/
```

也可以直接打开 `index.html`，但通过本地服务器访问时，视频和资源加载会更稳定。

## 检查与构建

检查页面锚点、资源路径和远程资源：

```powershell
python scripts/check_site.py
```

检查 JavaScript 语法：

```powershell
node --check script.js
node --check scripts/browser-check.cjs
```

生成 GitHub Pages 使用的发布目录：

```powershell
python scripts/build.py
```

## GitHub Pages

仓库已经配置 GitHub Actions 自动发布。推送到 `main` 分支后，工作流会依次完成：

1. 检查页面锚点和本地资源。
2. 构建 `_site` 发布目录。
3. 上传 Pages 构建产物。
4. 部署到公开网站。

在线地址：

<https://tjucrush.github.io/xiaomi-gui-show/>
