# 部署指南

## 方式一：静态部署（最简单，免费）

### 1. GitHub Pages 部署

```bash
# 1. 创建 GitHub 仓库
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/virtual-goods-shop.git
git push -u origin main

# 2. 在 GitHub 仓库设置中启用 Pages
# Settings -> Pages -> Source -> Deploy from a branch -> main / root
```

### 2. Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel

# 按照提示完成部署
```

### 3. Netlify 部署

1. 访问 https://app.netlify.com/drop
2. 将项目文件夹拖拽到页面上
3. 自动完成部署

## 方式二：云服务器部署（需要后端）

### 腾讯云/阿里云服务器

```bash
# 1. 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. 安装 PM2
npm install -g pm2

# 3. 上传项目到服务器
# 使用 scp 或 git clone

# 4. 安装依赖
cd /path/to/project
npm install express payjs cors body-parser ws

# 5. 启动服务
pm2 start server-example.js --name "shop"

# 6. 配置 Nginx 反向代理
sudo apt-get install nginx

# 编辑 /etc/nginx/sites-available/default
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 重启 Nginx
sudo nginx -s reload
```

### 配置 HTTPS（Let's Encrypt）

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

## 方式三：使用云函数（Serverless）

### 腾讯云函数

1. 访问 https://console.cloud.tencent.com/scf
2. 创建函数 -> 从头开始
3. 运行环境：Node.js 16.13
4. 复制 `server-example.js` 代码到函数
5. 配置 API 网关触发器

### Vercel Serverless Functions

创建 `api/create-order.js`:

```javascript
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // 调用 Payjs API 创建订单
    const { productName, price } = req.body;

    const response = await fetch('https://payjs.cn/api/native', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            mchid: process.env.PAYJS_MCHID,
            total_fee: price * 100,
            body: productName,
            out_trade_no: `ORD${Date.now()}`,
            // ... 其他参数
        })
    });

    const data = await response.json();
    res.json(data);
}
```

配置 `vercel.json`:

```json
{
    "functions": {
        "api/*.js": {
            "maxDuration": 10
        }
    }
}
```

## 域名配置

### 购买域名

推荐：
- 腾讯云 DNSPod：https://dnspod.cloud.tencent.com/
- 阿里云万网：https://wanwang.aliyun.com/
- GoDaddy：https://www.godaddy.com/

### 配置 DNS

添加 A 记录：
- 主机记录：@（或 www）
- 记录值：你的服务器 IP 地址

## 配置 Payjs 支付

1. 访问 https://payjs.cn/ 注册账号
2. 完成实名认证
3. 在控制台获取：
   - 商户号（mchid）
   - API 密钥（key）
4. 配置回调 URL
5. 将密钥填入 `server-example.js`

## 安全建议

1. **环境变量存储密钥**
   ```bash
   # .env 文件
   PAYJS_KEY=your-secret-key
   PAYJS_MCHID=your-mchid
   ```

2. **使用 HTTPS**
   - 生产环境必须使用 HTTPS
   - 可以使用 Cloudflare 免费 SSL

3. **订单验证**
   - 支付回调必须验证签名
   - 检查订单金额是否正确

4. **频率限制**
   ```javascript
   const rateLimit = require('express-rate-limit');

   const limiter = rateLimit({
       windowMs: 15 * 60 * 1000, // 15分钟
       max: 100 // 限制100个请求
   });

   app.use('/api/', limiter);
   ```

## 监控与日志

### 使用 PM2 监控

```bash
pm2 status          # 查看状态
pm2 logs shop       # 查看日志
pm2 monit           # 监控面板
```

### 接入 Sentry 错误监控

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
    dsn: 'your-sentry-dsn'
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

## 备份策略

1. **数据库备份**（如果使用数据库）
   ```bash
   # 每日自动备份
   0 2 * * * mysqldump -u root -p shop_db > /backup/shop_$(date +\%Y\%m\%d).sql
   ```

2. **文件备份**
   ```bash
   # 使用 rclone 备份到云存储
   rclone sync /path/to/project remote:backup
   ```

## 成本估算

| 方案 | 域名 | 服务器 | 支付手续费 | 总计/月 |
|------|------|--------|-----------|---------|
| GitHub Pages | ¥0 | ¥0 | 2% | ¥0 + 手续费 |
| 腾讯云轻量 | ¥50/年 | ¥50/月 | 2% | ~¥55/月 |
| Vercel Pro | ¥0 | ¥0 | 2% | ¥0 + 手续费 |

## 后续优化

1. 接入 CDN 加速静态资源
2. 使用 Redis 缓存订单数据
3. 添加邮件/短信通知
4. 接入微信登录
5. 添加数据统计面板
