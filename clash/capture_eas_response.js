/*
Quantumult X EAS 响应抓包脚本 (改编自 Loon 脚本)
用于抓取青岛网络海联工作系统的 API 响应
*/

const url = $request.url; // $request 在响应脚本中通常可用，包含原始请求信息
const status = $response.status;
const headers = $response.headers;
// $response.body 将在下面小心处理

const apiPath = url.replace("https://www.qdwlhl.com/wlhlwork/eas", "");
const timestamp = new Date().toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'});

console.log("🟢 =================== EAS 响应 (Quantumult X) ===================");
console.log(`⏰ 时间: ${timestamp}`);
console.log(`🌐 URL: ${url}`);
console.log(`📈 状态码: ${status}`);
console.log(`📍 API路径: ${apiPath}`);

// 输出重要响应头
console.log("📋 响应头:");
const importantResponseHeaders = ['content-type', 'set-cookie', 'server', 'date', 'content-length']; // 添加了 content-length
for (let key in headers) {
    if (importantResponseHeaders.some(h => key.toLowerCase().includes(h.toLowerCase()))) {
        if (key.toLowerCase().includes('cookie')) { // 一般是 Set-Cookie
            // 解析 Cookie 信息
            const cookieHeaderValue = headers[key];
            // Set-Cookie 可能是一个数组或单个字符串，QX中通常是单个字符串，但可以按标准处理
            const cookies = Array.isArray(cookieHeaderValue) ? cookieHeaderValue.join('; ').split(';') : String(cookieHeaderValue).split(';');

            console.log(`   🍪 ${key}:`);
            cookies.forEach(cookie => {
                const trimmed = cookie.trim();
                if (trimmed) { // 确保cookie片段不为空
                    if (trimmed.toLowerCase().includes('jsessionid')) {
                        console.log(`      🔑 ${trimmed}`);
                    } else {
                        console.log(`      📄 ${trimmed}`);
                    }
                }
            });
        } else {
            console.log(`   📄 ${key}: ${headers[key]}`);
        }
    }
}

// 输出响应体 - 针对 Quantumult X 的 $response.body 进行适配
console.log("📥 响应体:");
const qxBody = $response.body;
let jsonBody = null; // 用于存放解析后的JSON对象
let bodyToDisplay = ""; // 用于存放最终要打印的body内容字符串

if (qxBody) {
    if (typeof qxBody === 'string') {
        bodyToDisplay = qxBody; // 原始字符串
        try {
            jsonBody = JSON.parse(qxBody); // 尝试解析为JSON
        } catch (e) {
            // 解析失败，jsonBody 保持 null
        }
    } else if (typeof qxBody === 'object' && qxBody !== null) {
        // QX 可能已经预解析为对象
        jsonBody = qxBody;
        try {
            bodyToDisplay = JSON.stringify(jsonBody, null, 2); // 格式化为字符串以便打印
        } catch (e) {
            bodyToDisplay = "[Object (无法序列化为字符串)]";
        }
    } else if ($response.bodyBytes && $response.bodyBytes.length > 0) {
        // 处理二进制数据 (Uint8Array from $response.bodyBytes)
        try {
            const decodedString = new TextDecoder("utf-8").decode($response.bodyBytes);
            bodyToDisplay = decodedString;
            jsonBody = JSON.parse(decodedString); // 尝试解析解码后的字符串
        } catch (e) {
            if (bodyToDisplay === "") { // 如果解码就失败了
                 bodyToDisplay = `[二进制数据 (长度: ${$response.bodyBytes.length}), 解码或解析为JSON失败: ${e.message}]`;
            } else { // 解码成功但JSON解析失败
                 bodyToDisplay += `\n   (解码后内容，但非JSON格式: ${e.message})`;
            }
        }
    } else if (qxBody instanceof Uint8Array) { // 如果 $response.body 本身就是 Uint8Array
        try {
            const decodedString = new TextDecoder("utf-8").decode(qxBody);
            bodyToDisplay = decodedString;
            jsonBody = JSON.parse(decodedString);
        } catch (e) {
             if (bodyToDisplay === "") {
                bodyToDisplay = `[二进制数据 (长度: ${qxBody.length}), 解码或解析为JSON失败: ${e.message}]`;
            } else {
                 bodyToDisplay += `\n   (解码后内容，但非JSON格式: ${e.message})`;
            }
        }
    } else {
        bodyToDisplay = String(qxBody); // 其他未知类型，尝试转为字符串
    }

    // 根据是否成功解析出 jsonBody 来决定如何打印和后续处理
    if (jsonBody) {
        console.log(JSON.stringify(jsonBody, null, 2)); // 打印格式化后的JSON

        // --- 原有的特定字段分析逻辑 (基于 jsonBody) ---
        if (jsonBody.msg !== undefined) {
            const successStatus = jsonBody.msg === 'success' || jsonBody.msg === 'Success' || jsonBody.msg === 'SUCCESS'; // 更灵活的判断
            const statusStr = successStatus ? '✅ 成功' : '❌ 失败';
            console.log(`📊 请求状态: ${statusStr} (${jsonBody.msg})`);
        }

        if (jsonBody.code !== undefined) {
            console.log(`🔢 业务码: ${jsonBody.code}`); // 区分HTTP状态码和业务码
        }

        if (jsonBody.message) {
            console.log(`💬 返回消息: ${jsonBody.message}`);
        }

        // 分析数据内容
        if (jsonBody.data) {
            const dataType = Array.isArray(jsonBody.data) ? '数组' : typeof jsonBody.data;
            console.log(`📦 数据类型: ${dataType}`);

            if (Array.isArray(jsonBody.data)) {
                console.log(`📊 数据条数: ${jsonBody.data.length}`);

                // 如果是职位信息 (getPositons)
                if (jsonBody.data.length > 0 && jsonBody.data[0] && jsonBody.data[0].adminOrg_name !== undefined) { // 检查属性是否存在
                    console.log("🏢 组织职位信息:");
                    jsonBody.data.forEach((item, index) => {
                        console.log(`   📋 职位 ${index + 1}:`);
                        console.log(`      组织: ${item.adminOrg_name || '未知'}`);
                        console.log(`      职位: ${item.position_name || '未知'}`);
                        console.log(`      公司: ${item.companyOrg_name || '未知'}`);
                        if (item.adminOrg_id) {
                            console.log(`      组织ID: ${item.adminOrg_id}`);
                        }
                        if (item.position_id) {
                            console.log(`      职位ID: ${item.position_id}`);
                        }
                    });
                }
            } else if (typeof jsonBody.data === 'object' && jsonBody.data !== null) {
                // 如果是用户认证信息
                if (jsonBody.data.unionid || jsonBody.data.openid) {
                    console.log("👤 用户认证信息:");
                    if (jsonBody.data.unionid) {
                        const value = String(jsonBody.data.unionid); //确保是字符串
                        const masked = value.length > 10 ? value.substring(0, 6) + "..." + value.substring(value.length - 4) : value;
                        console.log(`   UnionID: ${masked}`);
                    }
                    if (jsonBody.data.openid) {
                        const value = String(jsonBody.data.openid); //确保是字符串
                        const masked = value.length > 10 ? value.substring(0, 6) + "..." + value.substring(value.length - 4) : value;
                        console.log(`   OpenID: ${masked}`);
                    }
                    if (jsonBody.data.session_key) {
                        console.log(`   Session Key: [已隐藏]`); // 通常 session_key 比较敏感，不直接打印
                    }
                }
            }
        }

        // 特殊处理日报提交响应
        if (url.includes("saveData")) { // 假设 saveData 接口响应中也有 msg 字段
            console.log("📝 日报提交结果分析:");
            if (jsonBody.msg === 'success' || jsonBody.msg === 'Success' || jsonBody.msg === 'SUCCESS') {
                console.log("   ✅ 日报提交成功");
            } else {
                console.log("   ❌ 日报提交失败");
                if (jsonBody.message) {
                    console.log(`      错误信息: ${jsonBody.message}`);
                } else if (jsonBody.msg) {
                     console.log(`      状态信息: ${jsonBody.msg}`);
                }
            }
        }
        // --- 特定字段分析逻辑结束 ---

    } else {
        // 未能解析为JSON，直接打印原始的或解码后的 bodyToDisplay
        console.log(bodyToDisplay);
        // 避免在 bodyToDisplay 已经是错误提示时重复添加 "(非JSON格式)"
        if (bodyToDisplay && !bodyToDisplay.startsWith("[二进制数据") && !bodyToDisplay.includes("(解码后内容，但非JSON格式")) {
             console.log("   (内容非JSON格式或解析失败)");
        }
    }
} else {
    console.log("📥 响应体: 无");
}

// 状态码分析
let statusEmoji = "✅";
let statusText = "成功";
if (status >= 400) {
    statusEmoji = "❌";
    statusText = "客户端或服务端错误";
} else if (status >= 300) {
    statusEmoji = "⚠️";
    statusText = "重定向";
} else if (status < 200) { // 1xx Informational responses
    statusEmoji = "ℹ️";
    statusText = "信息响应";
}
// 200-299 默认为成功

// 判断 API 类型 (与请求脚本保持一致)
let apiType = "未知API";
if (url.includes("getPositons")) { // 再次提醒确认此 API 名称拼写
    apiType = "🔐 认证";
} else if (url.includes("saveData")) {
    apiType = "📝 日报";
} else if (url.includes("DailyReportBill")) {
    apiType = "📊 日报";
} else if (url.includes("bc/")) {
    apiType = "🏢 基础";
} else if (url.includes("projectmanage")) {
    apiType = "📋 项目";
}

// 发送系统通知
$notification.post(`EAS API 响应: ${apiType}`, `HTTP ${status} ${statusEmoji} ${statusText}`, `路径: ${apiPath} | ${timestamp.split(' ')[1]}`);

console.log("🟢 =============================================================");

$done({});
