/*
Loon EAS 请求抓包脚本
用于抓取青岛网络海联工作系统的 API 请求
*/

const url = $request.url;
const method = $request.method;
const headers = $request.headers;
const body = $request.body;

// 提取 API 路径
const apiPath = url.replace("https://www.qdwlhl.com/wlhlwork/eas", "");
const timestamp = new Date().toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'});

console.log("🔵 =================== EAS 请求 ===================");
console.log(`⏰ 时间: ${timestamp}`);
console.log(`🌐 URL: ${url}`);
console.log(`📊 Method: ${method}`);
console.log(`📍 API路径: ${apiPath}`);

// 输出请求头 - 重点关注认证信息
console.log("📋 请求头:");
const importantHeaders = ['unionId', 'openId', 'Content-Type', 'User-Agent', 'Cookie'];
for (let key in headers) {
    if (importantHeaders.some(h => key.toLowerCase().includes(h.toLowerCase()))) {
        // 敏感信息部分隐藏
        if (key.toLowerCase().includes('unionid') || key.toLowerCase().includes('openid')) {
            const value = headers[key];
            const masked = value.length > 10 ? value.substring(0, 6) + "..." + value.substring(value.length - 4) : value;
            console.log(`   🔑 ${key}: ${masked}`);
        } else {
            console.log(`   📄 ${key}: ${headers[key]}`);
        }
    }
}

// 输出完整请求头到详细日志
console.log("📋 完整请求头:");
for (let key in headers) {
    console.log(`   ${key}: ${headers[key]}`);
}

// 输出请求体
if (body) {
    console.log("📤 请求体:");
    try {
        const jsonBody = JSON.parse(body);
        console.log(JSON.stringify(jsonBody, null, 2));

        // 特殊处理用户信息
        if (jsonBody.Person) {
            console.log("👤 用户信息:");
            console.log(`   姓名: ${jsonBody.Person.name || '未知'}`);
            console.log(`   工号: ${jsonBody.Person.number || '未知'}`);
            console.log(`   ID: ${jsonBody.Person.id || '未知'}`);
        }

        // 特殊处理位置信息
        if (jsonBody.longitude && jsonBody.latitude) {
            console.log("📍 位置信息:");
            console.log(`   地址: ${jsonBody.address || '未知'}`);
            console.log(`   经纬度: ${jsonBody.longitude}, ${jsonBody.latitude}`);
        }

        // 特殊处理认证请求
        if (jsonBody.isPrimary !== undefined) {
            console.log("🔐 认证请求:");
            console.log(`   isPrimary: ${jsonBody.isPrimary}`);
        }

    } catch (e) {
        console.log(`   ${body}`);
        console.log("   (非JSON格式)");
    }
} else {
    console.log("📤 请求体: 无");
}

// 判断 API 类型并发送通知
let apiType = "未知";
let notificationBody = "";

if (url.includes("getPositons")) {
    apiType = "🔐 用户认证";
    notificationBody = "获取职位信息";
} else if (url.includes("saveData")) {
    apiType = "📝 日报提交";
    notificationBody = "提交工作日报";
} else if (url.includes("DailyReportBill")) {
    apiType = "📊 日报相关";
    notificationBody = "日报相关操作";
} else if (url.includes("bc/")) {
    apiType = "🏢 基础服务";
    notificationBody = "基础服务调用";
} else if (url.includes("projectmanage")) {
    apiType = "📋 项目管理";
    notificationBody = "项目管理操作";
}

// 发送系统通知
$notification.post("EAS API 请求", `${apiType} - ${apiPath}`, `${method} | ${timestamp.split(' ')[1]}`);

console.log("🔵 ===============================================");

$done({});
