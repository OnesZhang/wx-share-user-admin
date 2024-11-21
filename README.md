
# Share 用户管理小程序

### 注：全部内容由Cursor自动生成~
这是一个基于微信小程序的 Share 用户管理系统。该系统用于管理 Share 用户的使用信息，包括用户 Token、到期时间、PLUS 会员状态和备注信息。

## 功能

* **用户列表展示:** 显示所有用户的 Token、到期时间、PLUS 会员状态和备注信息，支持分页和搜索功能。
* **用户添加:**  添加新的 ChatGPT 用户，包括生成随机 Token、设置到期时间、PLUS 会员状态和备注信息。
* **用户编辑:** 编辑现有用户的到期时间、PLUS 会员状态和备注信息。
* **用户删除:** 删除指定用户。
* **分页:** 支持自定义每页显示数量，方便浏览大量用户信息。
* **搜索:** 支持根据用户 Token 进行搜索。

## 技术栈

* 微信小程序
* `weui-miniprogram` UI 组件库

## 项目结构

```
main/
├── api/                // API 接口
│   └── user.js         // 用户管理 API
├── app.js              // 小程序入口文件
├── app.json            // 小程序全局配置
├── app.wxss            // 小程序全局样式
├── config.js           // 项目配置
├── pages/              // 页面
│   ├── index/          // 用户列表页面
│   │   ├── index.js    // 用户列表页面逻辑
│   │   ├── index.json  // 用户列表页面配置
│   │   ├── index.wxml  // 用户列表页面结构
│   │   └── index.wxss  // 用户列表页面样式
│   └── user-form/     // 用户添加/编辑页面
│       ├── index.js    // 用户添加/编辑页面逻辑
│       ├── index.json  // 用户添加/编辑页面配置
│       ├── index.wxml  // 用户添加/编辑页面结构
│       └── index.wxss  // 用户添加/编辑页面样式
├── project.config.json // 小程序项目配置
├── project.private.config.json // 小程序私有配置
├── sitemap.json        // 网站地图
└── utils/              // 工具函数
    ├── request.js      // 网络请求工具函数
    └── util.js         // 工具函数
```

## 配置

* 在 `main/config.js` 中配置 `baseURL` 和 `apiauth`，分别为后端 API 地址和 API 认证信息。

## 使用方法

1.  克隆项目到本地。
2.  使用微信开发者工具打开项目。
3.  修改 `main/config.js` 中的配置信息。
4.  编译并运行项目。


## 后端接口

该项目依赖于后端 API 接口，接口地址和参数定义在 `main/api/user.js` 中。

* `/adminapi/chatgpt/user/page`: 获取用户列表 (POST)
* `/adminapi/chatgpt/user/info`: 获取用户信息 (GET)
* `/adminapi/chatgpt/user/add`: 添加用户 (POST)
* `/adminapi/chatgpt/user/update`: 更新用户信息 (POST)
* `/adminapi/chatgpt/user/delete`: 删除用户 (POST)


## 贡献

欢迎贡献代码和改进建议！
