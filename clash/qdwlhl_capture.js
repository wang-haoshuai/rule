/*
 * QDWLHL 接口抓包解析脚本
 * 专门用于解析 https://www.qdwlhl.com/wlhlwork/ 下所有接口的请求和响应
 *
 * 使用方法：
 * 1. 在 Loon 的脚本配置中添加此脚本
 * 2. 配置正则匹配：^https://www\.qdwlhl\.com/wlhlwork/.*
 * 3. 启用 MITM 解密 www.qdwlhl.com
 *
 * 版本: 1.1.0
 * 更新日期: 2025-05-27
 * 功能: 请求/响应解析、数据提取、模式识别、统计分析
 */

const scriptName = "青岛未来互连eas接口解析";
const targetDomain = "www.qdwlhl.com";
const targetPath = "/wlhlwork/";

// 脚本配置
const config = {
    // 是否显示详细日志
    debugMode: true,
    // 是否持久化存储捕获的请求/响应
    saveData: true,
    // 最大保存记录数
    maxSavedRecords: 50,
    // 是否通知每个请求/响应
    notifyAll: false,
    // 仅通知这些API路径 (空数组表示通知所有)
    notifyPaths: ['login', 'auth', 'user', 'profile', 'upload']
};

// 工具函数：安全的 JSON 解析
function safeJsonParse(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}

// 工具函数：数据存储
function saveToStore(key, data) {
    if (!config.saveData) return;

    // 获取现有数据
    const storeKey = `qdwlhl_data`;
    let storedData = $persistentStore.read(storeKey);
    let dataArray = [];

    if (storedData) {
        try {
            dataArray = JSON.parse(storedData);
            // 保持最大记录数
            if (dataArray.length >= config.maxSavedRecords) {
                dataArray = dataArray.slice(-config.maxSavedRecords + 1);
            }
        } catch (e) {
            dataArray = [];
        }
    }

    // 添加新数据
    dataArray.push({
        timestamp: new Date().toISOString(),
        type: key,
        data: data
    });

    // 保存回存储
    $persistentStore.write(JSON.stringify(dataArray), storeKey);
}

// 工具函数：提取接口信息
function extractApiInfo(url) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    const searchParams = urlObj.searchParams;

    // 提取接口路径（去除 /wlhlwork/ 前缀）
    const apiPath = pathname.replace('/wlhlwork/', '');

    // 提取查询参数
    const params = {};
    for (let [key, value] of searchParams.entries()) {
        params[key] = value;
    }

    // 识别API类型
    let apiType = 'unknown';
    if (apiPath.includes('login') || apiPath.includes('auth')) {
        apiType = 'auth';
    } else if (apiPath.includes('user') || apiPath.includes('profile')) {
        apiType = 'user';
    } else if (apiPath.includes('upload') || apiPath.includes('file')) {
        apiType = 'file';
    } else if (apiPath.includes('list') || apiPath.includes('search')) {
        apiType = 'list';
    } else if (apiPath.includes('get') || apiPath.includes('info')) {
        apiType = 'info';
    } else if (apiPath.includes('add') || apiPath.includes('create')) {
        apiType = 'create';
    } else if (apiPath.includes('update') || apiPath.includes('edit')) {
        apiType = 'update';
    } else if (apiPath.includes('delete') || apiPath.includes('remove')) {
        apiType = 'delete';
    }

    return {
        fullPath: pathname,
        apiPath: apiPath,
        queryParams: params,
        hasParams: Object.keys(params).length > 0,
        apiType: apiType
    };
}

// 工具函数：检测敏感信息
function detectSensitiveInfo(data) {
    if (!data) return null;

    // 转换为字符串以便检查
    let dataStr = typeof data === 'object' ? JSON.stringify(data) : String(data);

    const patterns = {
        password: /["']?(?:password|pwd|passwd)["']?\s*[=:]\s*["']([^"']+)["']/i,
        token: /["']?(?:token|accessToken|access_token|jwt)["']?\s*[=:]\s*["']([^"']{5,})["']/i,
        key: /["']?(?:apiKey|api_key|secretKey|app_key)["']?\s*[=:]\s*["']([^"']+)["']/i,
        id: /["']?(?:id|userId|user_id)["']?\s*[=:]\s*["']([^"']+)["']/i,
        phone: /["']?(?:phone|mobile|tel)["']?\s*[=:]\s*["'](\d{7,})["']/i,
        email: /["']?(?:email|mail)["']?\s*[=:]\s*["']([^"'@]+@[^"']+\.[^"']+)["']/i
    };

    const results = {};
    let hasSensitive = false;

    // 检查各种敏感信息模式
    for (const [key, pattern] of Object.entries(patterns)) {
        const match = dataStr.match(pattern);
        if (match && match[1]) {
            results[key] = match[1];
            hasSensitive = true;
        }
    }

    return hasSensitive ? results : null;
}

// 工具函数：检测数据模式
function detectDataPattern(data) {
    if (!data || typeof data !== 'object') return null;

    // 尝试检测常见的数据模式
    const patterns = {
        pagination: 'total,page,pageSize,count,list,items,results'.split(','),
        user: 'username,user,name,nickname,userId,user_id,profile'.split(','),
        auth: 'token,jwt,accessToken,access_token,auth,authorization'.split(','),
        error: 'error,err,message,msg,code,status,success'.split(','),
        time: 'time,date,timestamp,createTime,create_time,updateTime'.split(',')
    };

    const results = {};
    let hasPattern = false;

    // 检查对象的键是否匹配常见模式
    const keys = Object.keys(data);
    for (const [patternName, patternKeys] of Object.entries(patterns)) {
        const matchedKeys = patternKeys.filter(key => keys.includes(key));
        if (matchedKeys.length > 0) {
            results[patternName] = matchedKeys;
            hasPattern = true;
        }
    }

    return hasPattern ? results : null;
}

// 工具函数：分析请求体类型
function analyzeRequestBody(body, contentType) {
    if (!body) return { type: 'empty', data: null };

    // JSON 类型
    if (contentType && contentType.includes('application/json')) {
        const jsonData = safeJsonParse(body);
        return {
            type: 'json',
            data: jsonData,
            raw: body
        };
    }

    // 表单类型
    if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
        const formData = {};
        const pairs = body.split('&');
        pairs.forEach(pair => {
            const [key, value] = pair.split('=');
            if (key && value) {
                formData[decodeURIComponent(key)] = decodeURIComponent(value);
            }
        });
        return {
            type: 'form',
            data: formData,
            raw: body
        };
    }

    // 多部分表单
    if (contentType && contentType.includes('multipart/form-data')) {
        return {
            type: 'multipart',
            data: 'multipart data (binary)',
            raw: body.substring(0, 200) + '...'
        };
    }

    // 纯文本或其他
    return {
        type: 'text',
        data: body,
        raw: body
    };
}

// 工具函数：分析响应体
function analyzeResponseBody(body, contentType) {
    if (!body) return { type: 'empty', data: null };

    // JSON 响应
    if (contentType && contentType.includes('application/json')) {
        const jsonData = safeJsonParse(body);
        return {
            type: 'json',
            data: jsonData,
            raw: body
        };
    }

    // HTML 响应
    if (contentType && contentType.includes('text/html')) {
        return {
            type: 'html',
            data: body.substring(0, 500) + (body.length > 500 ? '...' : ''),
            raw: body
        };
    }

    // XML 响应
    if (contentType && (contentType.includes('application/xml') || contentType.includes('text/xml'))) {
        return {
            type: 'xml',
            data: body.substring(0, 500) + (body.length > 500 ? '...' : ''),
            raw: body
        };
    }

    // 纯文本
    return {
        type: 'text',
        data: body,
        raw: body
    };
}

// 请求拦截和解析
function handleRequest() {
    const url = $request.url;
    const method = $request.method;
    const headers = $request.headers;
    const body = $request.body;

    if (!url.includes(targetDomain) || !url.includes(targetPath)) {
        $done({});
        return;
    }

    const apiInfo = extractApiInfo(url);
    const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

    if (config.debugMode) {
        console.log("\n🔵 =================== QDWLHL 请求 ===================");
        console.log(`⏰ 时间: ${timestamp}`);
        console.log(`🌐 URL: ${url}`);
        console.log(`📊 Method: ${method}`);
        console.log(`📍 API路径: ${apiInfo.apiPath}`);

        console.log("📋 请求头 (重点):");
        const importantHeaders = ['unionId', 'openId', 'Content-Type', 'User-Agent', 'Cookie', 'Authorization'];
        for (let key in headers) {
            if (importantHeaders.some(h => key.toLowerCase().includes(h.toLowerCase()))) {
                const headerValue = headers[key];
                if (key.toLowerCase().includes('unionid') || key.toLowerCase().includes('openid') || key.toLowerCase().includes('authorization')) {
                    const masked = headerValue.length > 10 ? headerValue.substring(0, 6) + "..." + headerValue.substring(headerValue.length - 4) : headerValue;
                    console.log(`   🔑 ${key}: ${masked}`);
                } else {
                    console.log(`   📄 ${key}: ${headerValue}`);
                }
            }
        }
        console.log("📋 完整请求头:");
        for (let key in headers) {
            console.log(`   ${key}: ${headers[key]}`);
        }

        if (body) {
            console.log("📤 请求体:");
            const contentType = headers['Content-Type'] || headers['content-type'] || '';
            if (contentType.includes('application/json')) {
                try {
                    const jsonBody = JSON.parse(body);
                    console.log(JSON.stringify(jsonBody, null, 2));
                    if (jsonBody.Person) {
                        console.log("👤 用户信息 (请求体):");
                        console.log(`   姓名: ${jsonBody.Person.name || '未知'}`);
                        console.log(`   工号: ${jsonBody.Person.number || '未知'}`);
                        console.log(`   ID: ${jsonBody.Person.id || '未知'}`);
                    }
                    if (jsonBody.longitude && jsonBody.latitude) {
                        console.log("📍 位置信息 (请求体):");
                        console.log(`   地址: ${jsonBody.address || '未知'}`);
                        console.log(`   经纬度: ${jsonBody.longitude}, ${jsonBody.latitude}`);
                    }
                    if (jsonBody.isPrimary !== undefined) {
                        console.log("🔐 认证相关 (请求体):");
                        console.log(`   isPrimary: ${jsonBody.isPrimary}`);
                    }
                } catch (e) {
                    console.log(`   ${body}`);
                    console.log("   (非JSON格式或解析错误)");
                }
            } else if (contentType.includes('application/x-www-form-urlencoded')) {
                console.log(`   ${body}`);
                console.log("   (Form Data)");
            } else {
                console.log(`   ${body.substring(0, 500)}${body.length > 500 ? '...' : ''}`);
                console.log(`   (Content-Type: ${contentType})`);
            }
        } else {
            console.log("📤 请求体: 无");
        }
        console.log("🔵 ===================================================");
    }

    saveToStore('request', { url, method, headers, body, apiInfo, timestamp });

    // 更新通知逻辑
    let apiTypeNotify = "接口操作";
    let notificationBodyNotify = apiInfo.apiPath;

    if (url.includes("getPositons")) {
        apiTypeNotify = "🔐 用户认证";
        notificationBodyNotify = "获取职位信息";
    } else if (url.includes("saveData")) {
        apiTypeNotify = "📝 日报提交";
        notificationBodyNotify = "提交工作日报";
    } else if (url.includes("DailyReportBill")) {
        apiTypeNotify = "📊 日报相关";
    } else if (url.includes("bc/")) {
        apiTypeNotify = "🏢 基础服务";
    } else if (url.includes("projectmanage")) {
        apiTypeNotify = "📋 项目管理";
    } else if (url.includes("xj") || url.includes("vacation")) { // 新增：休假相关
        apiTypeNotify = "🏖️ 休假相关";
        notificationBodyNotify = "处理休假申请/查询";
    }

    if (config.notifyAll || config.notifyPaths.some(p => apiInfo.apiPath.toLowerCase().includes(p.toLowerCase()))) {
        $notification.post(
            `QDWLHL请求: ${apiTypeNotify}`,
            `${method} ${notificationBodyNotify}`,
            `${url.substring(0, 100)}...`
        );
    }

    $done({});
}

// 响应拦截和解析
function handleResponse() {
    const url = $response.url;
    const method = $request.method; // 获取原始请求方法
    const status = $response.status;
    const headers = $response.headers;
    const body = $response.body;

    if (!url.includes(targetDomain) || !url.includes(targetPath)) {
        $done({});
        return;
    }

    const apiInfo = extractApiInfo(url);
    const timestamp = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
    const isSuccess = status >= 200 && status < 300;
    const statusIcon = isSuccess ? "✅" : "❌";

    if (config.debugMode) {
        console.log("\n🟢 =================== QDWLHL 响应 ===================");
        console.log(`⏰ 时间: ${timestamp}`);
        console.log(`🚦 状态: ${statusIcon} ${status}`);
        console.log(`🌐 URL: ${url}`);
        console.log(`📊 Method: ${method}`);
        console.log(`📍 API路径: ${apiInfo.apiPath}`);

        console.log("📋 响应头:");
        for (let key in headers) {
            console.log(`   ${key}: ${headers[key]}`);
        }

        if (body) {
            console.log("📥 响应体:");
            const contentType = headers['Content-Type'] || headers['content-type'] || '';
            if (contentType.includes('application/json')) {
                try {
                    const jsonBody = JSON.parse(body);
                    console.log(JSON.stringify(jsonBody, null, 2));
                    // 可根据需要添加对响应体中特定字段的解析和高亮
                    if (jsonBody.token || jsonBody.accessToken) {
                        console.log("🔑 Token (响应体):", jsonBody.token || jsonBody.accessToken);
                    }
                    // 新增：解析响应体中的特定业务字段
                    if (jsonBody.Person) {
                        console.log("👤 用户信息 (响应体):");
                        console.log(`   姓名: ${jsonBody.Person.name || '未知'}`);
                        console.log(`   工号: ${jsonBody.Person.number || '未知'}`);
                        console.log(`   ID: ${jsonBody.Person.id || '未知'}`);
                    }
                    if (jsonBody.longitude && jsonBody.latitude) {
                        console.log("📍 位置信息 (响应体):");
                        console.log(`   地址: ${jsonBody.address || '未知'}`);
                        console.log(`   经纬度: ${jsonBody.longitude}, ${jsonBody.latitude}`);
                    }
                    if (jsonBody.isPrimary !== undefined) {
                        console.log("🔐 认证相关 (响应体):");
                        console.log(`   isPrimary: ${jsonBody.isPrimary}`);
                    }
                } catch (e) {
                    console.log(`   ${body}`);
                    console.log("   (非JSON格式或解析错误)");
                }
            } else if (contentType.includes('text/html')) {
                console.log(`   (HTML内容, 长度: ${body.length}, 部分预览)`);
                console.log(`   ${body.substring(0, 500)}${body.length > 500 ? '...' : ''}`);
            } else {
                console.log(`   ${body.substring(0, 500)}${body.length > 500 ? '...' : ''}`);
                console.log(`   (Content-Type: ${contentType})`);
            }
        } else {
            console.log("📥 响应体: 无");
        }
        console.log("🟢 ===================================================");
    }

    saveToStore('response', { url, status, headers, body, apiInfo, timestamp });

    // 更新通知逻辑
    let apiTypeNotify = "接口操作";
    let notificationBodyNotify = apiInfo.apiPath;
    // (可以沿用请求时的apiTypeNotify判断，或根据响应内容调整)
    if (url.includes("getPositons")) {
        apiTypeNotify = "🔐 用户认证";
        notificationBodyNotify = "获取职位信息";
    } else if (url.includes("saveData")) {
        apiTypeNotify = "📝 日报提交";
        notificationBodyNotify = "提交工作日报";
    } else if (url.includes("DailyReportBill")) {
        apiTypeNotify = "📊 日报相关";
    } else if (url.includes("leave") || url.includes("vacation")) { // 新增：休假相关
        apiTypeNotify = "🏖️ 休假相关";
        notificationBodyNotify = "处理休假申请/查询";
    } // ... 其他类型判断

    if (config.notifyAll || config.notifyPaths.some(p => apiInfo.apiPath.toLowerCase().includes(p.toLowerCase()))) {
        $notification.post(
            `QDWLHL响应: ${apiTypeNotify}`,
            `${statusIcon} ${status} ${notificationBodyNotify}`,
            `${url.substring(0, 100)}...`
        );
    }

    $done({});
}

// 主执行逻辑
if (typeof $request !== "undefined") {
    // 处理请求
    handleRequest();
} else if (typeof $response !== "undefined") {
    // 处理响应
    handleResponse();
} else {
    // 脚本加载
    console.log(`${scriptName} 脚本已加载`);
    $done({});
}
