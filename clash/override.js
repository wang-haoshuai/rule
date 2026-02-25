// Clash Verge Rev / Clash Party 覆写脚本

/**
 * 主入口函数
 * @param {Object} config - 原始配置对象
 * @returns {Object} - 修改后的配置对象
 */
function main(config) {
  // ==================== 配置开关（按需修改）====================
  const settings = {
    // TUN 模式开关：true = TUN 全接管，false = 仅系统代理
    tunMode: false,

    // DNS 防泄露开关：true = 启用防泄露 DNS 策略
    dnsAntiLeak: true,

    // 局域网共享开关
    allowLan: true,

    // 嗅探开关（fakeip 下可关闭以提升性能）
    snifferEnable: true,

    // 日志级别：silent / error / warning / info / debug
    logLevel: "warning",
  };

  // ==================== 保留原配置的 proxies ====================
  // 确保"直连"节点存在
  if (!config.proxies) {
    config.proxies = [];
  }

  // 检查是否已有"直连"节点，没有则添加
  const hasDirectProxy = config.proxies.some(p => p.name === "直连");
  if (!hasDirectProxy) {
    config.proxies.unshift({ name: "直连", type: "direct" });
  }

  // ==================== 全局配置 ====================
  config["mixed-port"] = 7890;
  config["allow-lan"] = settings.allowLan;
  config["bind-address"] = settings.allowLan ? "*" : "127.0.0.1";
  config["mode"] = "rule";
  config["log-level"] = settings.logLevel;
  config["ipv6"] = false;
  config["unified-delay"] = true;
  config["tcp-concurrent"] = true;
  config["global-client-fingerprint"] = "chrome";
  config["keep-alive-idle"] = 600;
  config["keep-alive-interval"] = 15;

  // ==================== Profile ====================
  config["profile"] = {
    "store-selected": true,
    "store-fake-ip": true,
  };

  // ==================== GEO 自动更新 ====================
  config["geo-auto-update"] = true;
  config["geo-update-interval"] = 24;

  // ==================== TUN 配置 ====================
  config["tun"] = {
    enable: settings.tunMode,
    stack: "mixed",
    "dns-hijack": ["any:53", "tcp://any:53"],
    "auto-route": settings.tunMode,
    "auto-redirect": settings.tunMode,
    "auto-detect-interface": settings.tunMode,
  };

  // ==================== 嗅探配置 ====================
  config["sniffer"] = {
    enable: settings.snifferEnable,
    sniff: {
      HTTP: {
        ports: [80, "8080-8880"],
        "override-destination": true,
      },
      TLS: {
        ports: [443, 8443],
      },
      QUIC: {
        ports: [443, 8443],
      },
    },
    "skip-domain": ["Mijia Cloud", "+.push.apple.com"],
  };

  // ==================== DNS 配置 ====================
  const domesticDns = [
    "https://dns.alidns.com/dns-query",
    "https://doh.pub/dns-query",
  ];

  const proxyDns = [
    "https://dns.google/dns-query#🚀 默认代理",
    "https://cloudflare-dns.com/dns-query#🚀 默认代理",
  ];

  config["dns"] = {
    enable: true,
    "cache-algorithm": "arc",
    listen: settings.dnsAntiLeak ? "127.0.0.1:1053" : "0.0.0.0:1053",
    ipv6: false,
    "respect-rules": true,
    "enhanced-mode": "fake-ip",
    "fake-ip-range": "28.0.0.1/8",
    "fake-ip-filter-mode": "blacklist",
    "fake-ip-filter": [
      "rule-set:fakeipfilter_domain",
      "+.login.microsoftonline.com",
      "+.login.live.com",
      "+.login.microsoft.com",
      "+.microsoftazuread-sso.com",
      "+.msftauth.net",
      "+.msauth.net",
      "+.msauthimages.net",
      "+.gemini.google.com",
      "+.aistudio.google.com",
      "+.generativelanguage.googleapis.com",
      "+.alkalimakersuite-pa.clients6.google.com",
      "+.notebooklm.google",
      "+.notebooklm.google.com",
    ],
    "default-nameserver": ["223.5.5.5", "119.29.29.29"],
    "proxy-server-nameserver": domesticDns,
    nameserver: domesticDns,
  };

  // DNS 防泄露策略
  if (settings.dnsAntiLeak) {
    config["dns"]["nameserver-policy"] = {
      "rule-set:geolocation-!cn": proxyDns,
      "rule-set:youtube_domain": proxyDns,
      "rule-set:google_domain": proxyDns,
      "rule-set:github_domain": proxyDns,
      "rule-set:telegram_domain": proxyDns,
      "rule-set:netflix_domain": proxyDns,
      "rule-set:tiktok_domain": proxyDns,
      "rule-set:ai": proxyDns,
      "+.gemini.google.com": proxyDns,
      "+.aistudio.google.com": proxyDns,
      "+.generativelanguage.googleapis.com": proxyDns,
      "+.alkalimakersuite-pa.clients6.google.com": proxyDns,
      "+.notebooklm.google": proxyDns,
      "+.notebooklm.google.com": proxyDns,
      "+.login.microsoftonline.com": domesticDns,
      "+.login.live.com": domesticDns,
      "+.login.microsoft.com": domesticDns,
      "+.msftauth.net": domesticDns,
      "+.msauth.net": domesticDns,
      "rule-set:onedrive_domain": proxyDns,
      "rule-set:microsoft_domain": proxyDns,
      "rule-set:paypal_domain": proxyDns,
      "rule-set:cn_domain": domesticDns,
      "rule-set:private_domain": domesticDns,
      "rule-set:apple_domain": domesticDns,
    };
  }

  // ==================== 代理组配置 ====================
  // 地区筛选正则
  const regionFilters = {
    HK: "(?=.*(港|HK|(?i)Hong))^((?!(台|日|韩|新|深|美)).)*$",
    TW: "(?=.*(台|TW|(?i)Taiwan))^((?!(港|日|韩|新|深|美)).)*$",
    JP: "(?=.*(日|JP|(?i)Japan))^((?!(港|台|韩|新|美)).)*$",
    SG: "(?=.*(新加坡|坡|狮城|SG|Singapore))^((?!(台|日|韩|深|美)).)*$",
    US: "(?=.*(美|US|(?i)States|America))^((?!(港|台|韩|新|日)).)*$",
    ALL: "^((?!(直连|剩余|到期|流量|官网)).)*$",
  };

  // 通用测速配置
  const urlTestConfig = {
    url: "https://www.gstatic.com/generate_204",
    interval: 300,
    tolerance: 20,
    lazy: true,
  };

  // 地区配置
  const regions = [
    { name: "香港", emoji: "🇭🇰", filter: regionFilters.HK },
    { name: "台湾", emoji: "🇹🇼", filter: regionFilters.TW },
    { name: "日本", emoji: "🇯🇵", filter: regionFilters.JP },
    { name: "狮城", emoji: "🇸🇬", filter: regionFilters.SG },
    { name: "美国", emoji: "🇺🇲", filter: regionFilters.US },
  ];

  // 构建代理组
  const proxyGroups = [];

  // 1. 地区场景组（放最前面）
  regions.forEach((r) => {
    proxyGroups.push({
      name: `${r.emoji} ${r.name}场景`,
      type: "select",
      proxies: [`♻️ ${r.name}自动`, `🔯 ${r.name}故转`, `${r.emoji} ${r.name}节点`],
    });
  });

  // 2. 业务策略组
  proxyGroups.push(
    // 🚀 默认代理 — 默认：自动选择
    {
      name: "🚀 默认代理", type: "select", proxies: [
        "♻️ 自动选择", "🇭🇰 香港场景", "🇹🇼 台湾场景", "🇯🇵 日本场景", "🇸🇬 狮城场景", "🇺🇲 美国场景", "🌐 全部节点", "直连"
      ]
    },
    // 📹 YouTube — 默认：香港
    {
      name: "📹 YouTube", type: "select", proxies: [
        "🇭🇰 香港场景", "🚀 默认代理", "🇹🇼 台湾场景", "🇯🇵 日本场景", "🇸🇬 狮城场景", "🇺🇲 美国场景", "🌐 全部节点", "直连"
      ]
    },
    // 🍀 Google — 默认：香港
    {
      name: "🍀 Google", type: "select", proxies: [
        "🇭🇰 香港场景", "🚀 默认代理", "🇹🇼 台湾场景", "🇯🇵 日本场景", "🇸🇬 狮城场景", "🇺🇲 美国场景", "🌐 全部节点", "直连"
      ]
    },
    // 🤖 ChatGPT — 默认：美国
    {
      name: "🤖 ChatGPT", type: "select", proxies: [
        "🇺🇲 美国场景", "🚀 默认代理", "🇭🇰 香港场景", "🇹🇼 台湾场景", "🇯🇵 日本场景", "🇸🇬 狮城场景", "🌐 全部节点", "直连"
      ]
    },
    // 👨‍💻 GitHub — 默认：香港
    {
      name: "👨‍💻 GitHub", type: "select", proxies: [
        "🇭🇰 香港场景", "🚀 默认代理", "🇹🇼 台湾场景", "🇯🇵 日本场景", "🇸🇬 狮城场景", "🇺🇲 美国场景", "🌐 全部节点", "直连"
      ]
    },
    // 🐬 OneDrive — 默认：直连
    {
      name: "🐬 OneDrive", type: "select", proxies: [
        "直连", "🚀 默认代理", "🇭🇰 香港场景", "🇹🇼 台湾场景", "🇯🇵 日本场景", "🇸🇬 狮城场景", "🇺🇲 美国场景", "🌐 全部节点"
      ]
    },
    // 🪟 Microsoft — 默认：直连
    {
      name: "🪟 Microsoft", type: "select", proxies: [
        "直连", "🚀 默认代理", "🇭🇰 香港场景", "🇹🇼 台湾场景", "🇯🇵 日本场景", "🇸🇬 狮城场景", "🇺🇲 美国场景", "🌐 全部节点"
      ]
    },
    // 🎵 TikTok — 默认：台湾
    {
      name: "🎵 TikTok", type: "select", proxies: [
        "🇹🇼 台湾场景", "🚀 默认代理", "🇭🇰 香港场景", "🇯🇵 日本场景", "🇸🇬 狮城场景", "🇺🇲 美国场景", "🌐 全部节点", "直连"
      ]
    },
    // 📲 Telegram — 默认：狮城
    {
      name: "📲 Telegram", type: "select", proxies: [
        "🇸🇬 狮城场景", "🚀 默认代理", "🇭🇰 香港场景", "🇹🇼 台湾场景", "🇯🇵 日本场景", "🇺🇲 美国场景", "🌐 全部节点", "直连"
      ]
    },
    // 🎥 NETFLIX — 默认：狮城
    {
      name: "🎥 NETFLIX", type: "select", proxies: [
        "🇸🇬 狮城场景", "🚀 默认代理", "🇭🇰 香港场景", "🇹🇼 台湾场景", "🇯🇵 日本场景", "🇺🇲 美国场景", "🌐 全部节点", "直连"
      ]
    },
    // 💶 PayPal — 默认：美国
    {
      name: "💶 PayPal", type: "select", proxies: [
        "🇺🇲 美国场景", "🚀 默认代理", "🇭🇰 香港场景", "🇹🇼 台湾场景", "🇯🇵 日本场景", "🇸🇬 狮城场景", "🌐 全部节点", "直连"
      ]
    },
    // 🐟 漏网之鱼 — 默认：香港
    {
      name: "🐟 漏网之鱼", type: "select", proxies: [
        "🇭🇰 香港场景", "🚀 默认代理", "🇹🇼 台湾场景", "🇯🇵 日本场景", "🇸🇬 狮城场景", "🇺🇲 美国场景", "♻️ 自动选择", "🌐 全部节点", "直连"
      ]
    }
  );

  // 3. 地区手动选择节点组
  regions.forEach((r) => {
    proxyGroups.push({
      name: `${r.emoji} ${r.name}节点`,
      type: "select",
      "include-all": true,
      filter: r.filter,
    });
  });

  // 4. 地区故障转移组
  regions.forEach((r) => {
    proxyGroups.push({
      name: `🔯 ${r.name}故转`,
      type: "fallback",
      "include-all": true,
      url: urlTestConfig.url,
      interval: urlTestConfig.interval,
      lazy: urlTestConfig.lazy,
      filter: r.filter,
    });
  });

  // 5. 地区自动测速组
  regions.forEach((r) => {
    proxyGroups.push({
      name: `♻️ ${r.name}自动`,
      type: "url-test",
      "include-all": true,
      url: urlTestConfig.url,
      interval: urlTestConfig.interval,
      tolerance: urlTestConfig.tolerance,
      lazy: urlTestConfig.lazy,
      filter: r.filter,
    });
  });

  // 6. 全局自动选择
  proxyGroups.push({
    name: "♻️ 自动选择",
    type: "url-test",
    "include-all": true,
    url: urlTestConfig.url,
    interval: urlTestConfig.interval,
    tolerance: urlTestConfig.tolerance,
    lazy: urlTestConfig.lazy,
    filter: regionFilters.ALL,
  });

  // 7. 全部节点
  proxyGroups.push({
    name: "🌐 全部节点",
    type: "select",
    "include-all": true,
  });

  config["proxy-groups"] = proxyGroups;

  // ==================== 规则配置 ====================
  config["rules"] = [
    "RULE-SET,private_ip,直连,no-resolve",
    "RULE-SET,private_domain,直连",
    "RULE-SET,custom_domain,直连",
    "DOMAIN-SUFFIX,qichiyu.com,🚀 默认代理",
    "RULE-SET,proxylite,🚀 默认代理",
    "DOMAIN-SUFFIX,gemini.google.com,🤖 ChatGPT",
    "DOMAIN-SUFFIX,aistudio.google.com,🤖 ChatGPT",
    "DOMAIN-SUFFIX,generativelanguage.googleapis.com,🤖 ChatGPT",
    "DOMAIN-SUFFIX,alkalimakersuite-pa.clients6.google.com,🤖 ChatGPT",
    "DOMAIN-SUFFIX,notebooklm.google,🤖 ChatGPT",
    "DOMAIN-SUFFIX,notebooklm.google.com,🤖 ChatGPT",
    "DOMAIN-SUFFIX,deepmind.com,🤖 ChatGPT",
    "DOMAIN-SUFFIX,deepmind.google,🤖 ChatGPT",
    "RULE-SET,ai,🤖 ChatGPT",
    "RULE-SET,github_domain,👨‍💻 GitHub",
    "RULE-SET,youtube_domain,📹 YouTube",
    "RULE-SET,google_domain,🍀 Google",
    "DOMAIN-SUFFIX,login.microsoftonline.com,直连",
    "DOMAIN-SUFFIX,login.live.com,直连",
    "DOMAIN-SUFFIX,login.microsoft.com,直连",
    "DOMAIN-SUFFIX,microsoftazuread-sso.com,直连",
    "DOMAIN-SUFFIX,msftauth.net,直连",
    "DOMAIN-SUFFIX,msauth.net,直连",
    "RULE-SET,onedrive_domain,🐬 OneDrive",
    "RULE-SET,microsoft_domain,🪟 Microsoft",
    "RULE-SET,apple_domain,直连",
    "RULE-SET,tiktok_domain,🎵 TikTok",
    "RULE-SET,telegram_domain,📲 Telegram",
    "RULE-SET,netflix_domain,🎥 NETFLIX",
    "RULE-SET,paypal_domain,💶 PayPal",
    "RULE-SET,apple_ip,直连",
    "RULE-SET,google_ip,🍀 Google",
    "RULE-SET,netflix_ip,🎥 NETFLIX",
    "RULE-SET,telegram_ip,📲 Telegram",
    "RULE-SET,geolocation-!cn,🚀 默认代理",
    "RULE-SET,cn_domain,直连",
    "RULE-SET,cn_ip,直连",
    "MATCH,🐟 漏网之鱼",
  ];

  // ==================== 规则集配置 ====================
  const domainProvider = { type: "http", interval: 86400, behavior: "domain", format: "mrs" };
  const ipProvider = { type: "http", interval: 86400, behavior: "ipcidr", format: "mrs" };
  const classProvider = { type: "http", interval: 86400, behavior: "classical", format: "text" };

  config["rule-providers"] = {
    fakeipfilter_domain: { ...domainProvider, url: "https://raw.githubusercontent.com/wwqgtxx/clash-rules/release/fakeip-filter.mrs" },
    private_domain: { ...domainProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.mrs" },
    custom_domain: { ...classProvider, url: "https://raw.githubusercontent.com/wang-haoshuai/rule/refs/heads/master/rule/Direct/Direct.list" },
    proxylite: { ...classProvider, url: "https://raw.githubusercontent.com/qichiyuhub/rule/refs/heads/main/proxy.list" },
    ai: { ...domainProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ai-!cn.mrs" },
    youtube_domain: { ...domainProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/youtube.mrs" },
    google_domain: { ...domainProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google.mrs" },
    github_domain: { ...domainProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/github.mrs" },
    telegram_domain: { ...domainProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.mrs" },
    netflix_domain: { ...domainProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/netflix.mrs" },
    paypal_domain: { ...domainProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/paypal.mrs" },
    onedrive_domain: { ...domainProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/onedrive.mrs" },
    microsoft_domain: { ...domainProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft.mrs" },
    apple_domain: { ...domainProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/apple.mrs" },
    tiktok_domain: { ...domainProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/tiktok.mrs" },
    "geolocation-!cn": { ...domainProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/geolocation-!cn.mrs" },
    cn_domain: { ...domainProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.mrs" },
    private_ip: { ...ipProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/private.mrs" },
    cn_ip: { ...ipProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.mrs" },
    google_ip: { ...ipProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/google.mrs" },
    telegram_ip: { ...ipProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/telegram.mrs" },
    netflix_ip: { ...ipProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/netflix.mrs" },
    apple_ip: { ...ipProvider, url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo-lite/geoip/apple.mrs" },
  };

  return config;
}
