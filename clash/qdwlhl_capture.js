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

const scriptName = "QDWLHL接口解析";
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

// 工具函数：格式化输出
function formatLog(title, data) {
    if (!config.debugMode) return;
    console.log(`\n=== ${scriptName} - ${title} ===`);
    console.log(data);
    console.log("=" + "=".repeat(title.length + scriptName.length + 6));
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

    // 检查是否为目标接口
    if (!url.includes(targetDomain) || !url.includes(targetPath)) {
        $done({});
        return;
    }

    // 提取接口信息
    const apiInfo = extractApiInfo(url);

    // 分析请求体
    const contentType = headers['Content-Type'] || headers['content-type'] || '';
    const bodyAnalysis = analyzeRequestBody(body, contentType);

    // 格式化输出请求信息
    formatLog("请求解析", {
        "时间": new Date().toLocaleString('zh-CN'),
        "请求方法": method,
        "完整URL": url,
        "接口路径": apiInfo.apiPath,
        "查询参数": apiInfo.hasParams ? apiInfo.queryParams : "无",
        "请求头": {
            "User-Agent": headers['User-Agent'] || headers['user-agent'] || "未知",
            "Content-Type": contentType || "未指定",
            "Authorization": headers['Authorization'] || headers['authorization'] || "无",
            "Cookie": headers['Cookie'] || headers['cookie'] ? "存在" : "无",
            "Referer": headers['Referer'] || headers['referer'] || "无"
        },
        "请求体类型": bodyAnalysis.type,
        "请求体内容": bodyAnalysis.data,
        "原始请求体": bodyAnalysis.type !== 'empty' ? bodyAnalysis.raw.substring(0, 200) + (bodyAnalysis.raw.length > 200 ? '...' : '') : "无"
    });

    // 特殊接口处理
    if (apiInfo.apiPath.includes('login') || apiInfo.apiPath.includes('auth')) {
        console.log(`\n🔐 检测到认证相关接口: ${apiInfo.apiPath}`);
        if (bodyAnalysis.data) {
            console.log("🔍 认证数据:", bodyAnalysis.data);
        }
    }

    if (apiInfo.apiPath.includes('upload') || method === 'POST') {
        console.log(`\n📤 检测到数据提交接口: ${apiInfo.apiPath}`);
    }

    // 发送通知
    $notification.post(
        "QDWLHL请求捕获",
        `${method} ${apiInfo.apiPath}`,
        bodyAnalysis.type !== 'empty' ? `包含${bodyAnalysis.type}数据` : "无请求体"
    );

    $done({});
}

// 响应拦截和解析
function handleResponse() {
    const url = $response.url;
    const status = $response.status;
    const headers = $response.headers;
    const body = $response.body;

    // 检查是否为目标接口
    if (!url.includes(targetDomain) || !url.includes(targetPath)) {
        $done({});
        return;
    }

    // 提取接口信息
    const apiInfo = extractApiInfo(url);

    // 分析响应体
    const contentType = headers['Content-Type'] || headers['content-type'] || '';
    const bodyAnalysis = analyzeResponseBody(body, contentType);

    // 判断请求是否成功
    const isSuccess = status >= 200 && status < 300;
    const statusIcon = isSuccess ? "✅" : "❌";

    // 格式化输出响应信息
    formatLog("响应解析", {
        "时间": new Date().toLocaleString('zh-CN'),
        "状态": `${statusIcon} ${status}`,
        "接口路径": apiInfo.apiPath,
        "响应头": {
            "Content-Type": contentType || "未指定",
            "Content-Length": headers['Content-Length'] || headers['content-length'] || "未知",
            "Server": headers['Server'] || headers['server'] || "未知",
            "Set-Cookie": headers['Set-Cookie'] || headers['set-cookie'] ? "存在" : "无"
        },
        "响应体类型": bodyAnalysis.type,
        "响应体内容": bodyAnalysis.data
    });

    // 特殊响应处理
    if (bodyAnalysis.type === 'json' && bodyAnalysis.data) {
        const jsonData = bodyAnalysis.data;

        // 检查是否包含错误信息
        if (jsonData.error || jsonData.err || jsonData.message) {
            console.log(`\n⚠️  检测到错误响应:`);
            console.log("错误信息:", jsonData.error || jsonData.err || jsonData.message);
        }

        // 检查是否包含认证令牌
        if (jsonData.token || jsonData.access_token || jsonData.jwt) {
            console.log(`\n🔑 检测到认证令牌:`);
            const token = jsonData.token || jsonData.access_token || jsonData.jwt;
            console.log("令牌:", token.substring(0, 20) + "...");
        }

        // 检查是否包含用户信息
        if (jsonData.user || jsonData.userInfo || jsonData.profile) {
            console.log(`\n👤 检测到用户信息:`);
            const userInfo = jsonData.user || jsonData.userInfo || jsonData.profile;
            console.log("用户信息:", userInfo);
        }

        // 检查分页信息
        if (jsonData.total || jsonData.count || jsonData.pageSize) {
            console.log(`\n📄 检测到分页数据:`);
            console.log("分页信息:", {
                total: jsonData.total,
                count: jsonData.count,
                page: jsonData.page,
                pageSize: jsonData.pageSize
            });
        }
    }

    // 发送通知
    $notification.post(
        "QDWLHL响应捕获",
        `${statusIcon} ${status} ${apiInfo.apiPath}`,
        bodyAnalysis.type !== 'empty' ? `返回${bodyAnalysis.type}数据` : "无响应体"
    );

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
