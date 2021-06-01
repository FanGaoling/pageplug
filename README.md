# 前端低代码工具（base on AppSmith）

## 🎈启动项目（windows）
[非windows](/contributions/ClientSetup.md)  
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

[服务端指南](/contributions/ServerSetup.md)
```
// .env 环境变量，开发测试 mongo、redis 地址
APPSMITH_MONGODB_URI="mongodb://10.10.13.50:27017/appsmith"
APPSMITH_REDIS_URL="redis://10.10.13.50:63799"
```

## 💕合并 GitHub 更新
```
// 添加 GitHub 远程仓库，定期同步
git remote add mirror https://github.com/appsmithorg/appsmith.git
git fetch mirror master
git checkout master
git merge mirror/master
git push origin master
``` 