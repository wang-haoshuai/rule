/*
Loon EAS 响应抓包脚本
用于抓取青岛网络海联工作系统的 API 响应
*/

const url = $request.url;
const status = $response.status;
const headers = $response.headers;
const body = $response.body;

const apiPath = url.replace("https://www.qdwlhl.com/wlhlwork/eas", "");
const timestamp = new Date().toLocaleString('zh-CN', {timeZone: 'Asia/Shanghai'});

console.log("🟢 =================== EAS 响应 ===================");
console.log(`⏰ 时间: ${timestamp}`);
console.log(`🌐 URL: ${url}`);
console.log(`📈 状态码: ${status}`);
console.log(`📍 API路径: ${apiPath}`);

// 输出重要响应头
console.log("📋 响应头:");
const importantHeaders = ['content-type', 'set-cookie', 'server', 'date'];
for (let key in headers) {
    if (importantHeaders.some(h => key.toLowerCase().includes(h.toLowerCase()))) {
        if (key.toLowerCase().includes('cookie')) {
            // 解析 Cookie 信息
            const cookies = headers[key].split(';');
            console.log(`   🍪 ${key}:`);
            cookies.forEach(cookie => {
                const trimmed = cookie.trim();
                if (trimmed.includes('JSESSIONID')) {
                    console.log(`      🔑 ${trimmed}`);
                } else {
                    console.log(`      📄 ${trimmed}`);
                }
            });
        } else {
            console.log(`   📄 ${key}: ${headers[key]}`);
        }
    }
}

// 输出响应体
if (body) {
    console.log("📥 响应体:");
    try {
        const jsonBody = JSON.parse(body);
        console.log(JSON.stringify(jsonBody, null, 2));

        // 分析响应结果
        if (jsonBody.msg !== undefined) {
            const status = jsonBody.msg === 'success' ? '✅ 成功' : '❌ 失败';
            console.log(`📊 请求状态: ${status} (${jsonBody.msg})`);
        }

        if (jsonBody.code !== undefined) {
            console.log(`📊 状态码: ${jsonBody.code}`);
        }

        if (jsonBody.message) {
            console.log(`💬 返回消息: ${jsonBody.message}`);
        }

        // 分析数据内容
        if (jsonBody.data) {
            const dataType = Array.isArray(jsonBody.data) ? '数组' : typeof jsonBody.data;
            console.log(`📊 数据类型: ${dataType}`);

            if (Array.isArray(jsonBody.data)) {
                console.log(`📊 数据数量: ${jsonBody.data.length}`);

                // 如果是职位信息
                if (jsonBody.data.length > 0 && jsonBody.data[0].adminOrg_name) {
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
            } else if (typeof jsonBody.data === 'object') {
                // 如果是用户认证信息
                if (jsonBody.data.unionid || jsonBody.data.openid) {
                    console.log("👤 用户认证信息:");
                    if (jsonBody.data.unionid) {
                        const masked = jsonBody.data.unionid.substring(0, 6) + "..." + jsonBody.data.unionid.substring(jsonBody.data.unionid.length - 4);
                        console.log(`   UnionID: ${masked}`);
                    }
                    if (jsonBody.data.openid) {
                        const masked = jsonBody.data.openid.substring(0, 6) + "..." + jsonBody.data.openid.substring(jsonBody.data.openid.length - 4);
                        console.log(`   OpenID: ${masked}`);
                    }
                    if (jsonBody.data.session_key) {
                        console.log(`   Session Key: ${jsonBody.data.session_key}`);
                    }
                }
            }
        }

        // 特殊处理日报提交响应
        if (url.includes("saveData")) {
            console.log("📝 日报提交结果分析:");
            if (jsonBody.msg === 'success') {
                console.log("   ✅ 日报提交成功");
            } else {
                console.log("   ❌ 日报提交失败");
                if (jsonBody.message) {
                    console.log(`   错误信息: ${jsonBody.message}`);
                }
            }
        }

    } catch (e) {
        console.log(`   ${body}`);
        console.log("   (非JSON格式)");
    }
} else {
    console.log("📥 响应体: 无");
}

// 状态码分析
let statusEmoji = "✅";
let statusText = "成功";
if (status >= 400) {
    statusEmoji = "❌";
    statusText = "错误";
} else if (status >= 300) {
    statusEmoji = "⚠️";
    statusText = "重定向";
}

// 判断 API 类型
let apiType = "未知";
if (url.includes("getPositons")) {
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

$notification.post("EAS API 响应", `${statusEmoji} ${status} ${statusText}`, `${apiType} | ${timestamp.split(' ')[1]}`);

console.log("🟢 ===============================================");

$done({});
