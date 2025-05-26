/*
 * QDWLHL 响应抓包解析脚本
 * 专门用于解析 https://www.qdwlhl.com/wlhlwork/ 下所有接口的响应
 *
 * 使用方法：
 * 1. 在 Loon 的脚本配置中添加此脚本
 * 2. 配置正则匹配：^https://www\.qdwlhl\.com/wlhlwork/.*
 * 3. 启用 MITM 解密 www.qdwlhl.com
 * 4. 脚本类型选择：HTTP-RESPONSE
 *
 * 版本: 1.2.0
 * 更新日期: 2025-05-27
 * 功能: 响应解析、数据提取、结果分析
 */

const scriptName = "QDWLHL响应解析";
const targetDomain = "www.qdwlhl.com";
const targetPath = "/wlhlwork/";

// 脚本配置
const config = {
    // 是否显示详细日志
    debugMode: true,
    // 是否持久化存储捕获的响应
    saveData: true,
    // 最大保存记录数
    maxSavedRecords: 50,
    // 是否通知每个响应
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
    const storeKey = `qdwlhl_response_data`;
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

// 工具函数：分析响应体类型
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
        console.log(`🏷️ API类型: ${apiInfo.apiType}`);

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

        console.log("📋 完整响应头:");
        for (let key in headers) {
            console.log(`   ${key}: ${headers[key]}`);
        }

        if (body) {
            console.log("📥 响应体:");
            const contentType = headers['Content-Type'] || headers['content-type'] || '';
            const bodyAnalysis = analyzeResponseBody(body, contentType);
            
            console.log(`   📊 数据类型: ${bodyAnalysis.type}`);

            if (bodyAnalysis.type === 'json' && bodyAnalysis.data) {
                const jsonBody = bodyAnalysis.data;
                console.log(JSON.stringify(jsonBody, null, 2));

                // 分析响应结果
                if (jsonBody.msg !== undefined) {
                    const statusResult = jsonBody.msg === 'success' ? '✅ 成功' : '❌ 失败';
                    console.log(`📊 请求状态: ${statusResult} (${jsonBody.msg})`);
                }

                if (jsonBody.code !== undefined) {
                    console.log(`📊 状态码: ${jsonBody.code}`);
                }

                if (jsonBody.message) {
                    console.log(`💬 返回消息: ${jsonBody.message}`);
                }

                // 可根据需要添加对响应体中特定字段的解析和高亮
                if (jsonBody.token || jsonBody.accessToken) {
                    console.log("🔑 Token (响应体):", jsonBody.token || jsonBody.accessToken);
                }

                // 解析响应体中的特定业务字段
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

                        // 如果是休假信息
                        if (jsonBody.data.length > 0 && (jsonBody.data[0].applyDate || jsonBody.data[0].leaveType)) {
                            console.log("🏖️ 休假申请信息:");
                            jsonBody.data.forEach((item, index) => {
                                console.log(`   📋 申请 ${index + 1}:`);
                                if (item.applyDate) console.log(`      申请日期: ${item.applyDate}`);
                                if (item.leaveType) console.log(`      休假类型: ${item.leaveType}`);
                                if (item.startDate) console.log(`      开始时间: ${item.startDate}`);
                                if (item.endDate) console.log(`      结束时间: ${item.endDate}`);
                                if (item.reason) console.log(`      申请原因: ${item.reason}`);
                                if (item.status) console.log(`      审批状态: ${item.status}`);
                                if (item.days) console.log(`      请假天数: ${item.days}`);
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
                        
                        // 休假详情
                        if (apiInfo.apiType === 'vacation' && jsonBody.data) {
                            const vData = jsonBody.data;
                            console.log("🏖️ 休假详情信息:");
                            
                            if (vData.leaveType || vData.leaveTypeName) {
                                console.log(`   休假类型: ${vData.leaveTypeName || vData.leaveType || '未知'}`);
                            }
                            if (vData.startDate) console.log(`   开始时间: ${vData.startDate}`);
                            if (vData.endDate) console.log(`   结束时间: ${vData.endDate}`);
                            if (vData.reason) console.log(`   申请原因: ${vData.reason}`);
                            if (vData.days) console.log(`   请假天数: ${vData.days}`);
                            if (vData.status || vData.statusName) {
                                console.log(`   审批状态: ${vData.statusName || vData.status || '未知'}`);
                            }
                            if (vData.approveUser) console.log(`   审批人: ${vData.approveUser}`);
                            if (vData.approveDate) console.log(`   审批时间: ${vData.approveDate}`);
                        }
                    }
                }

                // 特殊处理各种业务场景的响应
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
                } else if (url.includes("xj") || url.includes("vacation")) {
                    console.log("🏖️ 休假相关结果分析:");
                    if (jsonBody.msg === 'success') {
                        console.log("   ✅ 休假操作成功");
                    } else {
                        console.log("   ❌ 休假操作失败");
                        if (jsonBody.message) {
                            console.log(`   错误信息: ${jsonBody.message}`);
                        }
                    }
                }

            } else if (bodyAnalysis.type === 'html') {
                console.log(`   (HTML内容, 长度: ${bodyAnalysis.raw.length}, 部分预览)`);
                console.log(`   ${bodyAnalysis.data}`);
            } else {
                console.log(`   ${bodyAnalysis.raw.substring(0, 500)}${bodyAnalysis.raw.length > 500 ? '...' : ''}`);
                if (contentType) console.log(`   (Content-Type: ${contentType})`);
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

    // 添加状态码信息到通知中
    let statusText = "成功";
    if (status >= 400) {
        statusText = "错误";
    } else if (status >= 300) {
        statusText = "重定向";
    }

    if (config.notifyAll || config.notifyPaths.some(p => apiInfo.apiPath.toLowerCase().includes(p.toLowerCase()))) {
        $notification.post(
            `QDWLHL响应: ${apiTypeNotify}`,
            `${statusIcon} ${status} ${statusText}`,
            `${url.substring(0, 100)}...`
        );
    }

    $done({});
}

// 主执行逻辑
if (typeof $response !== "undefined") {
    handleResponse();
} else {
    console.log(`${scriptName} 脚本已加载`);
    $done({});
}
