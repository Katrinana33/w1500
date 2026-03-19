// 支付后端示例 - Node.js + Express + Payjs
// 这个文件展示了如何接入真实的支付接口

const express = require('express');
const Payjs = require('payjs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 配置 Payjs（需要替换为你的真实配置）
const payjsConfig = {
    key: 'your-payjs-key',      // Payjs API密钥
    mchid: 'your-mchid'         // Payjs 商户号
};

const payjs = new Payjs(payjsConfig);

// 存储订单（生产环境请使用数据库）
const orders = new Map();

// ========== API 路由 ==========

// 1. 创建支付订单
app.post('/api/create-order', async (req, res) => {
    try {
        const { productId, productName, price } = req.body;

        // 生成订单号
        const orderId = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

        // 创建 Payjs 订单
        const payData = await payjs.unifiedOrder({
            total_fee: Math.round(price * 100),  // 转换为分
            body: productName,
            out_trade_no: orderId,
            notify_url: 'https://your-domain.com/api/pay-callback',
            callback_url: 'https://your-domain.com/success'
        });

        // 保存订单信息
        orders.set(orderId, {
            id: orderId,
            productId,
            productName,
            price,
            status: 'pending',
            payjsId: payData.payjs_order_id,
            createdAt: new Date()
        });

        res.json({
            success: true,
            orderId: orderId,
            qrCode: payData.code_url,  // 支付二维码URL
            payjsOrderId: payData.payjs_order_id
        });

    } catch (error) {
        console.error('创建订单失败:', error);
        res.status(500).json({
            success: false,
            message: '创建订单失败'
        });
    }
});

// 2. 查询支付状态
app.get('/api/check-payment', async (req, res) => {
    try {
        const { orderId } = req.query;
        const order = orders.get(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: '订单不存在'
            });
        }

        // 查询 Payjs 订单状态
        const result = await payjs.checkOrder({
            payjs_order_id: order.payjsId
        });

        // 更新订单状态
        if (result.status === 1) {
            order.status = 'paid';
            order.paidAt = new Date();
        }

        res.json({
            success: true,
            paid: order.status === 'paid',
            order: order
        });

    } catch (error) {
        console.error('查询支付状态失败:', error);
        res.status(500).json({
            success: false,
            message: '查询失败'
        });
    }
});

// 3. 支付回调通知（Payjs 会调用这个URL）
app.post('/api/pay-callback', (req, res) => {
    try {
        const data = req.body;

        // 验证签名
        const isValid = payjs.checkSign(data);

        if (!isValid) {
            return res.status(400).send('签名验证失败');
        }

        // 支付成功处理
        if (data.return_code === 1) {
            const orderId = data.out_trade_no;
            const order = orders.get(orderId);

            if (order) {
                order.status = 'paid';
                order.paidAt = new Date();
                order.transactionId = data.transaction_id;

                console.log('订单支付成功:', orderId);

                // 这里可以：
                // 1. 发送邮件通知
                // 2. 记录到数据库
                // 3. 推送给前端（使用 WebSocket）
                // 4. 发送短信通知
            }
        }

        // 必须返回 success
        res.send('success');

    } catch (error) {
        console.error('回调处理失败:', error);
        res.status(500).send('fail');
    }
});

// 4. 获取商品信息（从服务器获取）
app.get('/api/products', (req, res) => {
    // 可以从数据库读取商品信息
    const products = [
        {
            id: 1,
            name: "财务报表分析模板",
            description: "包含利润表、资产负债表、现金流量表等全套财务分析表格",
            price: 29.9,
            baiduLink: "https://pan.baidu.com/s/1xxxxx1",
            extractCode: "abc1"
        },
        // ... 更多商品
    ];

    res.json({
        success: true,
        products: products
    });
});

// 5. 获取下载链接（支付后）
app.get('/api/download/:orderId', (req, res) => {
    const { orderId } = req.params;
    const order = orders.get(orderId);

    if (!order || order.status !== 'paid') {
        return res.status(403).json({
            success: false,
            message: '订单未支付'
        });
    }

    // 返回下载链接
    res.json({
        success: true,
        downloadUrl: order.baiduLink,
        extractCode: order.extractCode
    });
});

// ========== WebSocket 实时通知（可选） ==========

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

// 存储客户端连接
const clients = new Map();

wss.on('connection', (ws, req) => {
    const orderId = new URL(req.url, 'http://localhost').searchParams.get('orderId');

    if (orderId) {
        clients.set(orderId, ws);

        ws.on('close', () => {
            clients.delete(orderId);
        });
    }
});

// 发送支付成功通知
function notifyPaymentSuccess(orderId) {
    const ws = clients.get(orderId);
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'payment_success',
            orderId: orderId
        }));
    }
}

// ========== 启动服务器 ==========

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
});

// 前端代码需要修改的部分：
/*
// 1. 创建订单时调用后端API
async function createOrder(product) {
    const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            productId: product.id,
            productName: product.name,
            price: product.price
        })
    });
    const result = await response.json();

    if (result.success) {
        // 显示支付二维码
        showQRCode(result.qrCode);
        // 连接 WebSocket 等待通知
        connectWebSocket(result.orderId);
    }
}

// 2. WebSocket 连接
function connectWebSocket(orderId) {
    const ws = new WebSocket(`ws://localhost:8080?orderId=${orderId}`);

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'payment_success') {
            paymentSuccess();
        }
    };
}
*/
