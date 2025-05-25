const url = $request.url;
const method = $request.method;
const headers = $request.headers;
const body = $request.body;

console.log("📤 EAS请求: " + url);
console.log("Method: " + method);
console.log("Headers: " + JSON.stringify(headers, null, 2));

if (body) {
    console.log("Body: " + body);
}

// 提取API路径
const apiPath = url.replace("https://www.qdwlhl.com/wlhlwork/eas", "");
$notification.post("EAS API调用", apiPath, method);

$done({});
