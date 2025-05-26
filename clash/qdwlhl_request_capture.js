/*
 * QDWLHL 请求抓包解析脚本
 * 专门用于解析 https://www.qdwlhl.com/wlhlwork/ 下所有接口的请求
 *
 * 使用方法：
 * 1. 在 Loon 的脚本配置中添加此脚本
 * 2. 配置正则匹配：^https://www\.qdwlhl\.com/wlhlwork/.*
 * 3. 启用 MITM 解密 www.qdwlhl.com
 * 4. 脚本类型选择：HTTP-REQUEST
 *
 * 版本: 1.2.0
 * 更新日期: 2025-05-27
 * 功能: 请求解析、数据提取、模式识别
 */

const scriptName = "QDWLHL请求解析";
const targetDomain = "www.qdwlhl.com";
const targetPath = "/wlhlwork/";

// 脚本配置
const config = {
    // 是否显示详细日志
    debugMode: true,
    // 是否持久化存储捕获的请求
    saveData: true,
    // 最大保存记录数
    maxSavedRecords: 50,
    // 是否通知每个请求
    notifyAll: false,
    // 仅通知这些API路径 (空数组表示通知所有)
    notifyPaths: ['login', 'auth', 'user', 'profile', 'upload', 'xj']
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
    const storeKey = `qdwlhl_request_data`;
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
    } else if (apiPath.includes('xj') || apiPath.includes('vacation')) {
        apiType = 'vacation';
    }

    return {
        fullPath: pathname,
        apiPath: apiPath,
        queryParams: params,
        hasParams: Object.keys(params).length > 0,
        apiType: apiType
    };
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
        console.log(`🏷️ API类型: ${apiInfo.apiType}`);

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
            const bodyAnalysis = analyzeRequestBody(body, contentType);

            console.log(`   📊 数据类型: ${bodyAnalysis.type}`);

            if (bodyAnalysis.type === 'json' && bodyAnalysis.data) {
                console.log(JSON.stringify(bodyAnalysis.data, null, 2));

                // 解析特定业务字段
                const jsonBody = bodyAnalysis.data;

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

                // 休假相关字段解析
                if (apiInfo.apiType === 'xj') {
                    if (jsonBody.leaveType) {
                        console.log("🏖️ 休假申请信息 (请求体):");
                        console.log(`   休假类型: ${jsonBody.leaveType}`);
                        if (jsonBody.startDate) console.log(`   开始时间: ${jsonBody.startDate}`);
                        if (jsonBody.endDate) console.log(`   结束时间: ${jsonBody.endDate}`);
                        if (jsonBody.reason) console.log(`   申请原因: ${jsonBody.reason}`);
                        if (jsonBody.days) console.log(`   请假天数: ${jsonBody.days}`);
                    }
                    if (jsonBody.billId) {
                        console.log("📋 单据信息 (请求体):");
                        console.log(`   单据ID: ${jsonBody.billId}`);
                    }
                }

            } else if (bodyAnalysis.type === 'form') {
                console.log("   (Form Data)");
                console.log(JSON.stringify(bodyAnalysis.data, null, 2));
            } else {
                console.log(`   ${bodyAnalysis.raw.substring(0, 500)}${bodyAnalysis.raw.length > 500 ? '...' : ''}`);
                if (contentType) console.log(`   (Content-Type: ${contentType})`);
            }
        } else {
            console.log("📤 请求体: 无");
        }

        // 查询参数解析
        if (apiInfo.hasParams) {
            console.log("🔍 查询参数:");
            for (let [key, value] of Object.entries(apiInfo.queryParams)) {
                console.log(`   ${key}: ${value}`);
            }
        }

        console.log("🔵 ===================================================");
    }

    saveToStore('request', { url, method, headers, body, apiInfo, timestamp });

    // 通知逻辑
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
        notificationBodyNotify = "处理日报数据";
    } else if (url.includes("bc/")) {
        apiTypeNotify = "🏢 基础服务";
        notificationBodyNotify = "基础配置服务";
    } else if (url.includes("projectmanage")) {
        apiTypeNotify = "📋 项目管理";
        notificationBodyNotify = "项目管理操作";
    } else if (url.includes("xj") || url.includes("vacation")) {
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

// 主执行逻辑
if (typeof $request !== "undefined") {
    handleRequest();
} else {
    console.log(`${scriptName} 脚本已加载`);
    $done({});
}
