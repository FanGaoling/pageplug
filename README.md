<p align="center">
  <img src="static/pageplug/pageplug_logo_banner.svg" width="360" height="160" alt="PagePlug">
</p>

<h2 align="center">更快、更快乐的开源前端低代码【中国版Appsmith】</h2>

<h3 align="center" style="margin-bottom: 32px">
  <a href="#quickStart">快速开始</a>
  •
  <a href="#help">帮助</a>
  •
  <a href="https://appsmith-fans.cn/" target="_blank">中文社区</a>
</h3>

## PagePlug 是什么？

PagePlug 是 [Appsmith](https://github.com/appsmithorg/appsmith) 的中国化项目，是一个开源的、声明式的、可视化的前端低代码框架，可以用来制作 web 应用、微信小程序。

> 当前版本基于 Appsmith v1.8.15 版本，最新版本正在开发中，敬请期待。

## PagePlug 和其他低代码有什么不同？

PagePlug 无需侵入客户架构，直接连接数据源（API、DB），任何的后端数据都变成了 JS 变量，可以随意转换、并配置到任意的视图组件，整个过程符合开发者心流，前端开发变得不仅更快了、而且更快乐了！

<p>
  <img src="static/pageplug/gifs/overview.gif" width="100%">
</p>

<p>
  <img src="static/pageplug/gifs/overview2.gif" width="100%">
</p>

## 功能特色

- 支持移动端！一分钟制作一个小程序，并生成小程序码进行分享！  
  <img src="static/pageplug/gifs/weapp.gif">

- 丰富的移动端组件  
  <img src="static/pageplug/gifs/widgets.gif">

- 集成优秀可视化方案 [Echarts](https://echarts.apache.org)  
  <img src="static/pageplug/gifs/echarts.gif">

- 集成社区中功能拔群的表单解决方案 [Formily](https://github.com/alibaba/formily)
  <img src="static/pageplug/gifs/formily.gif" width="100%">

- PC 端应用支持自定义导航菜单
  <img src="static/pageplug/gifs/menu.gif" width="100%">

- 中文界面、更简洁的 UI

- 引入 antd 组件库，react 版本升级到 v17

- 简化启动步骤，支持 Windows 环境本地开发（无需 WSL）  
  官方 AppSmith 前端项目第一次启动步骤繁琐，依赖非常多，并且官方支持 Windows 平台本地开发是通过 WSL 实现的，配置非常麻烦！PagePlug 优化了 Windows 环境下的运行脚本，简化了项目启动过程。[详请](#dev)

## DEMO 项目

- 严选小程序（微信小程序）  
  <img src="static/pageplug/weapp_demo.png" width="200" />

  PagePlug 制作的完整电商小程序案例，支持注册、登录、二级商品分类、商品搜索、商品详情、购物车、购买下单、收货地址管理、订单管理等功能。后端接口使用开源商城后台 [litmall](https://github.com/linlinjava/litemall)

- 工程管理系统（PC web 应用）  
  [体验地址](https://lowcode.methodot.com/applications/6322a1453892ca140cb874d5/pages/6322a1453892ca140cb874e3)  
  PagePlug 制作的一个典型 CRUD 项目，实现了基本增删改查、后端分页、搜索过滤、弹窗表单、复杂表单等功能

- 企业 CRM 系统（PC web 应用）  
  [体验地址](https://lowcode.methodot.com/applications/6322a6d63892ca140cb87551/pages/6322a6d63892ca140cb87555?embed=1)  
  PagePlug 制作的简单 CRM 项目，实现了线索、商机和客户的信息管理

- Echarts 示例  
  演示如何在 PagePlug 中使用 Echarts

## 如何导入 DEMO 项目？

通过文件方式导入 demo 项目到应用组，demo 项目 JSON 文件在 /demo 目录下
<img src="static/pageplug/gifs/import.gif" width="100%">

<div id="quickStart" />

## 快速开始

- 🚀 [立即体验](https://lowcode.methodot.com)

  > **注意**：体验环境数据没有做持久化，只作功能演示使用

- 🌱 [私有部署【Docker】](https://lowcode.methodot.com/app/pageplug/page1-63160074cb370d532de7f2af?embed=1)（推荐）

  > 最低服务器配置：4G 内存 + 2 核 CPU

- 35 版本源码要求 JDK 17, nodejs 18.17.0
<div id="dev" />

### 🎈 本地开发

PagePlug 代码位于 /app 目录下，主要目录分别是：

- /client -- React 前端项目，使用 create-react-app 脚手架生成，负责低代码的编辑器和 web 端展示
- /server -- Java 后端项目，使用 Spring WebFlux 框架，负责低代码的后端服务、各种数据源的代理
- /taro -- Taro 移动端项目，使用 Taro 跨平台方案实现移动端对低代码 DSL 的解析和展示

#### PagePlug 前端启动

PagePlug 前端项目使用 Nginx 作为网关，并且 Nginx 使用 Docker 运行，所以在运行之前请确保已安装 [Docker](https://www.docker.com/get-started/) ，下面的启动命令仅针对 **Windows** 环境，非 Windows 环境请参考[官方指南](/contributions/ClientSetup.md)。

```
// 配置 host
127.0.0.1 dev.appsmith.com

// 环境变量
cp .env.example .env

// 启动本地 nginx docker
cd app/client
yarn start-proxy

// 启动前端服务
yarn
yarn start-win
```

顺利启动后，访问 [https://dev.appsmith.com](https://dev.appsmith.com/) 预览效果。

#### PagePlug 后端启动

PagePlug 后端启动需要 Jdk11、Maven3、一个 Mongo 实例和一个 Redis 实例，具体操作请参考[官方指南](/contributions/ServerSetup.md)。下面的启动命令仅针对 **Windows** 环境，Windows 环境运行脚本需要借助 bash 命令，非 Windows 环境下直接运行脚本即可。

> **注意**：build.sh 脚本中用到了 rsync 工具，启动前请确保系统中已经安装了 rsync，Windows 环境安装 rsync 请看[这里](https://xindot.com/2019/08/13/add-rsync-to-git-bash-for-windows/)。

```
// 使用 IDEA 打开工程
app/server

// 创建环境变量文件
cp envs/dev.env.example .env

// 打开.env，配置环境变量
APPSMITH_MONGODB_URI="你的Mongo实例地址"
APPSMITH_REDIS_URL="你的Redis实例地址"

//【可选】如果需要小程序预览功能，需要配置你的小程序信息
CLOUDOS_WECHAT_APPID=""
CLOUDOS_WECHAT_SECRET=""

// 构建 java 服务
mvn clean compile
bash ./build.sh -DskipTests

// 启动 java 服务
bash ./scripts/start-dev-server.sh
```

#### PagePlug 移动端启动

PagePlug 移动端是一个 [Taro](https://github.com/NervJS/taro) 项目，天然地支持多端小程序、H5 和 React Native，但是，目前 PagePlug 仅支持微信小程序，微信小程序的预览和发布需要使用微信开发者工具、小程序账号，开发前请先查看[微信小程序官方指南](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/getstart.html)。  
PagePlug 移动端组件采用 [Taroify](https://github.com/mallfoundry/taroify) UI 组件库打造。

```
cd app/taro

打开 config/dev.js 配置开发参数

// PagePlug 后端接口地址，本地开发时需要填写本机IP地址
API_BASE_URL: '"http://192.168.xxx.xxx:8080/api/"'

// 小程序默认展示的应用ID
DEFAULT_APP: '"应用ID"'

// 启动 Taro 项目
yarn
yarn dev:weapp
```

<div id="help" />

## 帮助

- 扫码邀请加入微信交流群  
  <img src="static/pageplug/wechat_help.jpg" width="200">
- 联系作者  
  <img src="static/pageplug/wechat_author.jpg" width="200">
- [中文社区](https://appsmith-fans.cn/)

## 感谢这些巨人

PagePlug 代码中使用到的才华横溢的开源项目，感谢这些开源项目让世界更美好！

- [Appsmith](https://github.com/appsmithorg/appsmith)（低代码原型）
- [Taro](https://github.com/NervJS/taro)（移动端跨端解决方案）
- [Formily](https://github.com/alibaba/formily)（表单解决方案）
- [Taroify](https://github.com/mallfoundry/taroify)（Taro UI 组件库）
- [React Vant](https://github.com/3lang3/react-vant)（React 版 Vant 组件库）

## LICENSE

本项目基于 [Apache License 2.0](/LICENSE) 开源协议
