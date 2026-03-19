# Excel资料自助下单商城

一个简洁优雅的虚拟资料（Excel表格）自助下单网站，顾客扫码支付后自动显示下载链接。

## 功能特点

- 🛍️ 商品展示：美观的商品卡片，展示价格、描述、功能特点
- 📱 响应式设计：支持手机、平板、电脑访问
- 💳 双支付方式：微信支付 + 支付宝
- 🔗 自动发货：支付成功后自动显示百度网盘下载链接
- 📦 订单记录：本地存储订单信息

## 文件结构

```
virtual-goods-shop/
├── index.html          # 主页面
├── style.css           # 样式文件
├── app.js              # 交互逻辑
├── README.md           # 说明文档
├── qr-wechat.png       # 微信收款码（需要自行添加）
└── qr-alipay.png       # 支付宝收款码（需要自行添加）
```

## 使用方法

### 1. 准备工作

- 准备你的微信收款码截图，重命名为 `qr-wechat.png`
- 准备你的支付宝收款码截图，重命名为 `qr-alipay.png`
- 将两张二维码图片放在项目根目录

### 2. 配置商品信息

编辑 `app.js` 文件中的 `products` 数组，修改商品信息：

```javascript
const products = [
    {
        id: 1,
        name: "你的商品名称",
        description: "商品描述",
        icon: "📊",  // Emoji图标
        price: 29.9,  // 售价
        originalPrice: 59,  // 原价（显示划线价格）
        features: ["功能1", "功能2", "功能3", "功能4"],
        baiduLink: "https://pan.baidu.com/s/你的链接",
        extractCode: "提取码"
    },
    // ... 更多商品
];
```

### 3. 本地预览

使用浏览器直接打开 `index.html` 文件即可预览。

或者使用本地服务器：

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

然后访问 http://localhost:8000

### 4. 部署上线

将项目文件夹上传到任意静态网站托管平台：

- **GitHub Pages**（免费）
- **Vercel**（免费）
- **Netlify**（免费）
- **腾讯云/阿里云 OSS**（低成本）

## 支付方案说明

### 当前模式（静态二维码）

目前使用的是静态收款码模式：
1. 顾客扫码支付
2. 你在手机收到到账通知
3. 按 `Ctrl + Shift + A` 显示"模拟支付成功"按钮
4. 点击按钮完成交易演示

**实际使用时建议接入以下方案：**

### 方案A：Payjs（推荐个人使用）

Payjs 是一个支持个人使用的微信支付接口平台。

官网：https://payjs.cn/

接入步骤：
1. 注册 Payjs 账号
2. 获取 mchid 和 key
3. 安装 SDK：`npm install payjs`
4. 按照 SDK 文档调用 API 创建订单

### 方案B：虎皮椒（个人微信/支付宝）

支持个人微信和支付宝收款。

官网：https://www.xunhupay.com/

### 方案C：监听软件（自动化）

使用收款通知监听软件：
1. 手机安装监听APP
2. 设置 Webhook 回调到你的服务器
3. 服务器通知前端支付成功

## 自定义修改

### 修改网站标题

编辑 `index.html` 第7行：
```html
<title>你的商城名称</title>
```

### 修改主题颜色

编辑 `style.css`，替换所有 `#667eea` 和 `#764ba2` 为你喜欢的颜色。

### 添加更多商品

在 `app.js` 的 `products` 数组中添加新的商品对象。

### 修改客服联系方式

编辑 `index.html` 第79行：
```html
<p class="support">如有问题请联系客服微信：你的微信号</p>
```

## 演示截图

页面包含：
1. 商品列表页面
2. 扫码支付弹窗
3. 支付成功下载页面

## 技术栈

- HTML5
- CSS3 (Flexbox + Grid)
- Vanilla JavaScript (无依赖)

## 注意事项

1. 静态二维码模式下需要手动确认支付
2. 真实环境建议接入 Payjs 等支付平台
3. 百度网盘链接建议设置为永久有效
4. 定期备份订单数据

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎反馈。
