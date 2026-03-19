# 网站部署指南

恭喜！您的虚拟商品商城已准备就绪。请按照以下步骤完成部署，让用户可以使用网站。

## 准备工作

1. **检查配置文件**
   - 商品信息：编辑 `app.js` 中的 `products` 数组，修改商品名称、价格、描述、百度网盘链接和提取码。
   - 客服微信：编辑 `index.html` 第90行，修改客服微信号。
   - 网站标题：编辑 `index.html` 第6行，修改 `<title>` 标签。

2. **准备收款码图片**
   - 微信收款码：`qr-wechat.png`（已存在，请替换为您的真实收款码）
   - 支付宝收款码：`qr-alipay.png`（已创建占位符，请替换为您的真实收款码）
   - 图片尺寸建议：正方形，至少 200×200 像素，PNG格式。

## 部署选项

### 选项一：Vercel 部署（推荐，免费，最简单）

Vercel 提供免费的静态网站托管，自动 HTTPS，全球 CDN。

**步骤：**

1. **访问 [vercel.com](https://vercel.com)**
   - 使用 GitHub 账号登录
   - 点击 "New Project"

2. **导入 Git 仓库**
   - 选择 "Import Git Repository"
   - 如果您已将本仓库推送到 GitHub，选择您的仓库
   - 或者直接拖拽项目文件夹到 Vercel 网页

3. **配置项目**
   - 项目名称：`virtual-goods-shop`
   - Framework Preset：选择 "Other"
   - Build Command：留空
   - Output Directory：留空
   - 点击 "Deploy"

4. **获取域名**
   - 部署完成后，您将获得一个 `*.vercel.app` 的免费域名
   - 可以在项目设置中绑定自定义域名（需购买域名）

**优势：**
- 完全免费
- 自动 HTTPS
- 全球 CDN 加速
- 支持自定义域名
- 无需服务器配置

### 选项二：GitHub Pages（免费）

GitHub Pages 适合已有 GitHub 账号的用户。

**步骤：**

1. **创建 GitHub 仓库**
   - 登录 [github.com](https://github.com)
   - 点击 "New repository"
   - 仓库名：`virtual-goods-shop`
   - 选择 Public（公开）

2. **推送代码到 GitHub**
   ```bash
   # 添加远程仓库（替换 YOUR_USERNAME 为您的 GitHub 用户名）
   git remote add origin https://github.com/YOUR_USERNAME/virtual-goods-shop.git

   # 推送代码
   git branch -M main
   git push -u origin main
   ```

3. **启用 GitHub Pages**
   - 进入仓库的 "Settings" 页面
   - 左侧选择 "Pages"
   - "Source" 选择 "Deploy from a branch"
   - "Branch" 选择 "main" 和 "/ (root)"
   - 点击 "Save"

4. **访问网站**
   - 等待几分钟，访问：`https://YOUR_USERNAME.github.io/virtual-goods-shop/`

### 选项三：Netlify（免费）

Netlify 是另一个优秀的静态托管平台。

**步骤：**

1. **访问 [app.netlify.com](https://app.netlify.com)**
2. 拖拽项目文件夹到页面上的上传区域
3. 自动完成部署，获得 `*.netlify.app` 域名

## 配置支付功能

您选择了 **静态部署（手动确认支付）**，这意味着：

### 支付流程
1. 顾客选择商品，点击"立即购买"
2. 弹出支付弹窗，显示微信/支付宝收款码
3. 顾客扫码支付
4. **您需要在手机上确认收到款项**
5. 顾客点击"我已完成支付"按钮
6. 系统显示下载链接

### 管理员功能
- **模拟支付测试**：按 `Ctrl + Shift + A` 显示"模拟支付成功"按钮
- **手动确认支付**：顾客点击"我已完成支付"按钮后，您需要在实际收到款项后允许顾客下载

### 后续升级（可选）
如果您希望实现自动支付确认，可以考虑：

1. **接入 Payjs**（个人支付接口）
   - 注册 [payjs.cn](https://payjs.cn)
   - 获取 API 密钥
   - 参考 `server-example.js` 实现后端

2. **使用虎皮椒支付**
   - 访问 [xunhupay.com](https://www.xunhupay.com)
   - 支持个人微信/支付宝收款

## 网站测试

部署完成后，请测试以下功能：

1. ✅ 访问网站首页，查看商品展示
2. ✅ 点击"立即购买"，弹出支付弹窗
3. ✅ 切换微信/支付宝标签页
4. ✅ 扫描二维码（使用测试图片）
5. ✅ 点击"我已完成支付"按钮
6. ✅ 查看下载链接是否正确显示
7. ✅ 复制链接功能
8. ✅ 管理员功能：按 `Ctrl + Shift + A` 显示模拟按钮

## 常见问题

### 1. 二维码图片不显示
- 确保 `qr-wechat.png` 和 `qr-alipay.png` 文件存在
- 图片文件名必须完全一致
- 图片格式应为 PNG

### 2. 支付弹窗无法关闭
- 点击弹窗右上角的 × 按钮
- 或点击弹窗外部背景

### 3. 下载链接错误
- 检查 `app.js` 中商品的 `baiduLink` 和 `extractCode`
- 确保百度网盘链接永久有效

### 4. 网站加载缓慢
- 使用 Vercel 或 Netlify 的全球 CDN
- 压缩图片大小
- 减少视频文件尺寸（如需）

## 安全建议

1. **定期备份订单数据**
   - 订单存储在浏览器的 LocalStorage 中
   - 建议定期导出 `localStorage` 数据

2. **监控支付状态**
   - 定期检查手机收款通知
   - 及时处理顾客问题

3. **更新商品信息**
   - 定期更新商品链接和提取码
   - 下架已售完的商品

## 联系方式

如有部署问题，请参考：
- 项目 README：`README.md`
- 详细部署指南：`DEPLOY.md`
- 或联系技术支持

---

**您的网站现已准备就绪！** 选择上述任一部署选项，即可让用户访问您的虚拟商品商城。祝您生意兴隆！