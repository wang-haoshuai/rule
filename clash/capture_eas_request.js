/*
Quantumult X EAS 请求抓包脚本 (改编自 Loon 脚本)
用于抓取青岛网络海联工作系统的 API 请求
*/

const url = $request.url;
const method = $request.method;
const headers = $request.headers;
// $request.body will be handled carefully below

// 提取 API 路径
const apiPath = url.replace("https://www.qdwlhl.com/wlhlwork/eas", "");
const timestamp = new Date().toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'});

console.log("🔵 =================== EAS 请求 (Quantumult X) ===================");
console.log(`⏰ 时间: ${timestamp}`);
console.log(`🌐 URL: ${url}`);
console.log(`📊 Method: ${method}`);
console.log(`📍 API路径: ${apiPath}`);

// 输出请求头 - 重点关注认证信息
console.log("📋 请求头 (重点):");
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

// 输出完整请求头到详细日志 (与Loon脚本保持一致，方便对比)
console.log("📋 完整请求头:");
for (let key in headers) {
    console.log(`   ${key}: ${headers[key]}`);
}

// 输出请求体 - 针对 Quantumult X 的 $request.body 进行适配
console.log("📤 请求体:");
const qxBody = $request.body;
let jsonBody = null; // 用于存放解析后的JSON对象
let bodyToDisplay = ""; // 用于存放最终要打印的body内容字符串

if (qxBody) {
    if (typeof qxBody === 'string') {
        bodyToDisplay = qxBody; // 原始字符串
        try {
            jsonBody = JSON.parse(qxBody); // 尝试解析为JSON
        } catch (e) {
            // 解析失败，jsonBody 保持 null
            // bodyToDisplay 已经是原始字符串
        }
    } else if (typeof qxBody === 'object' && qxBody !== null) {
        // QX 可能已经预解析为对象
        jsonBody = qxBody;
        try {
            bodyToDisplay = JSON.stringify(jsonBody, null, 2); // 格式化为字符串以便打印
        } catch (e) {
            bodyToDisplay = "[Object (无法序列化为字符串)]";
        }
    } else if ($request.bodyBytes && $request.bodyBytes.length > 0) {
        // 处理二进制数据 (Uint8Array)
        try {
            const decodedString = new TextDecoder("utf-8").decode($request.bodyBytes);
            bodyToDisplay = decodedString;
            jsonBody = JSON.parse(decodedString); // 尝试解析解码后的字符串
        } catch (e) {
            // 解码或解析失败
            if (bodyToDisplay === "") { // 如果解码就失败了
                 bodyToDisplay = `[二进制数据 (长度: ${$request.bodyBytes.length}), 解码或解析为JSON失败]`;
            } else { // 解码成功但JSON解析失败
                 bodyToDisplay += "\n   (解码后内容，但非JSON格式)";
            }
            // jsonBody 保持 null
        }
    } else {
        bodyToDisplay = String(qxBody); // 其他未知类型，尝试转为字符串
    }

    // 根据是否成功解析出 jsonBody 来决定如何打印和后续处理
    if (jsonBody) {
        console.log(JSON.stringify(jsonBody, null, 2)); // 打印格式化后的JSON

        // --- 原有的特殊信息提取逻辑 (基于 jsonBody) ---
        if (jsonBody.Person) {
            console.log("👤 用户信息:");
            console.log(`   姓名: ${jsonBody.Person.name || '未知'}`);
            console.log(`   工号: ${jsonBody.Person.number || '未知'}`);
            console.log(`   ID: ${jsonBody.Person.id || '未知'}`);
        }

        if (jsonBody.longitude && jsonBody.latitude) {
            console.log("📍 位置信息:");
            console.log(`   地址: ${jsonBody.address || '未知'}`);
            console.log(`   经纬度: ${jsonBody.longitude}, ${jsonBody.latitude}`);
        }

        if (jsonBody.isPrimary !== undefined) { // 使用 undefined 判断确保属性存在
            console.log("🔐 认证请求:");
            console.log(`   isPrimary: ${jsonBody.isPrimary}`);
        }
        // --- 特殊信息提取逻辑结束 ---

    } else {
        // 未能解析为JSON，直接打印原始的或解码后的 bodyToDisplay
        console.log(bodyToDisplay);
        if (typeof qxBody === 'string' || ($request.bodyBytes && $request.bodyBytes.length > 0 && bodyToDisplay.startsWith("["))) {
            // 如果原始是字符串但不是json，或者解码失败显示的是错误信息，则不重复提示非json
        } else if (qxBody) { // 避免在 bodyToDisplay 已经是错误提示时重复添加
            console.log("   (非JSON格式或处理失败)");
        }
    }
} else {
    console.log("📤 请求体: 无");
}

// 判断 API 类型并发送通知 (这部分逻辑与Loon脚本相同)
let apiType = "未知API"; // 默认值，避免undefined
let notificationBody = `路径: ${apiPath}`; // 默认通知内容

if (url.includes("getPositons")) { // 注意Loon脚本中可能是 getPositons, 请确认 API 实际名称
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
$notification.post(`EAS API: ${apiType}`, `${method} | ${timestamp.split(' ')[1]}`, notificationBody);

console.log("🔵 =============================================================");

$done({});
