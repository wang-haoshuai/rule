const url = $request.url;
const body = $response.body;
const status = $response.status;

console.log("📥 EAS响应: " + url);
console.log("Status: " + status);

if (body) {
    console.log("Response: " + body);
}

$done({});
