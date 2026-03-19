// 商品数据配置
const products = [
    {
        id: 1,
        name: "广东1500真题词",
        description: "广东中考英语真题词汇1500词，Excel表格整理，方便打印和背诵学习。",
        icon: "📚",
        price: 9.9,
        originalPrice: 19.9,
        features: ["1500真题词汇", "Excel表格", "可打印", "背诵必备"],
        baiduLink: "https://pan.baidu.com/s/1izO8SUkO_c73MDpL1S44Tw?pwd=255M",
        extractCode: "255M"
    }
];

// 当前选中的商品
let currentProduct = null;
let checkPaymentInterval = null;
let orderId = null;

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});

// 渲染商品列表
function renderProducts() {
    const container = document.getElementById('products');
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-icon">${product.icon}</div>
            <h3>${product.name}</h3>
            <p class="description">${product.description}</p>
            <ul class="features">
                ${product.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <div class="product-footer">
                <div class="price">
                    ¥${product.price}
                    <span>¥${product.originalPrice}</span>
                </div>
                <button class="buy-btn" onclick="openPayment(${product.id})">
                    立即购买
                </button>
            </div>
        </div>
    `).join('');
}

// 打开支付弹窗
function openPayment(productId) {
    currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) return;

    // 更新支付信息
    document.getElementById('payProductName').textContent = currentProduct.name;
    document.getElementById('payPrice').textContent = currentProduct.price;

    // 生成订单号
    orderId = generateOrderId();

    // 重置标签页
    switchTab('wechat');

    // 显示弹窗
    document.getElementById('paymentModal').classList.add('active');

    // 重置状态
    document.getElementById('statusText').textContent = '⏳ 等待支付...';
    document.getElementById('loadingSpinner').style.display = 'block';

    // 3秒后显示"我已完成支付"按钮（给用户时间扫码）
    const confirmBtn = document.getElementById('confirmPayBtn');
    confirmBtn.style.display = 'none';
    setTimeout(() => {
        confirmBtn.style.display = 'inline-block';
    }, 3000);

    // 开始轮询支付状态
    startPaymentCheck();
}

// 关闭支付弹窗
function closeModal() {
    document.getElementById('paymentModal').classList.remove('active');
    document.getElementById('confirmPayBtn').style.display = 'none';
    stopPaymentCheck();
}

// 切换支付方式
function switchTab(method, event) {
    // 更新按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    // 如果传递了event，使用event.target，否则根据method找到对应按钮
    if (event && event.target) {
        event.target.classList.add('active');
    } else {
        // 根据method找到对应按钮
        const buttons = document.querySelectorAll('.tab-btn');
        buttons.forEach(btn => {
            if ((method === 'wechat' && btn.textContent.includes('微信')) ||
                (method === 'alipay' && btn.textContent.includes('支付宝'))) {
                btn.classList.add('active');
            }
        });
    }

    // 显示对应二维码
    if (method === 'wechat') {
        document.getElementById('wechatQR').classList.remove('hidden');
        document.getElementById('alipayQR').classList.add('hidden');
    } else {
        document.getElementById('wechatQR').classList.add('hidden');
        document.getElementById('alipayQR').classList.remove('hidden');
    }
}

// 生成订单号
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD${timestamp}${random}`;
}

// 开始检查支付状态（模拟）
function startPaymentCheck() {
    // 清除之前的轮询
    stopPaymentCheck();

    // 这里模拟支付状态检查
    // 实际使用时，你需要接入真实的支付API
    checkPaymentInterval = setInterval(() => {
        checkPaymentStatus();
    }, 3000);

    // 30秒后自动停止轮询（可选）
    setTimeout(() => {
        stopPaymentCheck();
    }, 300000); // 5分钟超时
}

// 停止检查
function stopPaymentCheck() {
    if (checkPaymentInterval) {
        clearInterval(checkPaymentInterval);
        checkPaymentInterval = null;
    }
}

// 检查支付状态（模拟实现）
async function checkPaymentStatus() {
    // ==========================================================
    // 这里需要接入真实的支付API
    // ==========================================================
    // 方案1: 使用第三方支付平台（如Payjs、虎皮椒等个人支付接口）
    // 方案2: 使用微信/支付宝官方API（需要企业资质）
    // 方案3: 手动确认（小额交易，看到付款后手动发货）
    // ==========================================================

    // 示例：假设你有一个后端API
    // try {
    //     const response = await fetch(`/api/check-payment?orderId=${orderId}`);
    //     const result = await response.json();
    //     if (result.paid) {
    //         paymentSuccess();
    //     }
    // } catch (error) {
    //     console.error('检查支付状态失败:', error);
    // }

    // 目前不做自动检测，等待用户手动确认或后端推送
}

// 支付成功处理
function paymentSuccess() {
    stopPaymentCheck();

    // 关闭支付弹窗
    closeModal();

    // 更新下载链接
    if (currentProduct) {
        document.getElementById('baiduLink').value = currentProduct.baiduLink;
        document.getElementById('extractCode').textContent = currentProduct.extractCode;
        document.querySelector('.download-btn').href = currentProduct.baiduLink;
    }

    // 显示下载弹窗
    document.getElementById('downloadModal').classList.add('active');

    // 记录订单（可以发送到服务器）
    recordOrder();
}

// 手动确认支付（用户点击"我已完成支付"）
function manualConfirm() {
    const btn = document.getElementById('confirmPayBtn');
    btn.textContent = '⏳ 处理中...';
    btn.disabled = true;

    // 模拟处理延迟，1秒后跳转
    setTimeout(() => {
        paymentSuccess();
        // 恢复按钮状态（为下次使用）
        btn.textContent = '✅ 我已完成支付';
        btn.disabled = false;
    }, 1000);
}

// 复制链接
function copyLink() {
    const linkInput = document.getElementById('baiduLink');
    linkInput.select();
    document.execCommand('copy');

    // 显示提示
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '已复制!';
    setTimeout(() => {
        btn.textContent = originalText;
    }, 2000);
}

// 关闭下载弹窗
function closeDownloadModal() {
    document.getElementById('downloadModal').classList.remove('active');
    currentProduct = null;
}

// 记录订单
function recordOrder() {
    const order = {
        orderId: orderId,
        productId: currentProduct?.id,
        productName: currentProduct?.name,
        price: currentProduct?.price,
        time: new Date().toISOString()
    };

    // 保存到本地存储
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // 可以在这里发送到服务器
    // sendOrderToServer(order);
}

// 发送订单到服务器（示例）
async function sendOrderToServer(order) {
    try {
        // 替换为你的服务器地址
        await fetch('https://your-server.com/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });
    } catch (error) {
        console.error('发送订单失败:', error);
    }
}

// 点击弹窗外部关闭
document.getElementById('paymentModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeModal();
    }
});

document.getElementById('downloadModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeDownloadModal();
    }
});

// 支付集成方案说明
/*
============================================================
要实现真实的支付自动回调，你需要：

方案A - 个人收款码 + 监听软件（最简单）
------------------------------------------------------------
1. 使用微信/支付宝个人收款码
2. 安装手机监听APP（如"收款助手"类应用）
3. 设置 webhook 通知你的服务器
4. 服务器通知前端支付成功

推荐工具：
- Payjs（个人微信/支付宝收款）
- 虎皮椒（个人支付接口）
- 易支付（聚合支付平台）

方案B - 使用第三方支付平台
------------------------------------------------------------
1. 注册 Payjs / 虎皮椒 / 码支付 等
2. 获取API密钥
3. 调用API创建订单
4. 设置回调URL接收支付通知

示例代码（Payjs）：

const payjs = new Payjs({
    key: 'your-api-key',
    mchid: 'your-mchid'
});

// 创建订单
payjs.unifiedOrder({
    total_fee: currentProduct.price * 100, // 分
    body: currentProduct.name,
    out_trade_no: orderId,
    notify_url: 'https://your-site.com/api/pay-callback',
    callback_url: 'https://your-site.com/success'
}).then(result => {
    // 显示支付二维码
    showQRCode(result.code_url);
});

方案C - 微信/支付宝官方接口
------------------------------------------------------------
- 需要企业营业执照
- 申请商户号
- 配置JSAPI支付或Native支付
- 开发复杂度较高
============================================================
*/
