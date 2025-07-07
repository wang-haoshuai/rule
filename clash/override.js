function main(config) {
  // 1. 添加手动代理节点
  if (!config.proxies) {
    config.proxies = [];
  }
  config.proxies.push({
    name: "直连",
    type: "direct"
  });

  // 2. 定义策略组
  config["proxy-groups"] = [
    // 核心默认代理组
    {
      name: "🚀 默认代理",
      type: "select",
      proxies: [
        "♻️ 自动选择",
        "🇭🇰 香港-场景",
        "🇯🇵 日本-场景", 
        "🇺🇲 美国-场景",
        "🇸🇬 新加坡-场景",
        "🇹🇼 台湾-场景",
        "🌐 其他地区-场景",
        "🌐 全部节点",
        "直连"
      ]
    },
    
    // 全局自动选择和全部节点组
    {
      name: "♻️ 自动选择",
      type: "url-test",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 50,
      "include-all": true,
      filter: "^((?!(直连|流量|套餐|重置|官网|剩余)).)*$"
    },
    {
      name: "🌐 全部节点",
      type: "select",
      "include-all": true
    },
    
    // 应用分流的策略组
    {
      name: "📹 YouTube",
      type: "select",
      proxies: [
        "🚀 默认代理",
        "🇭🇰 香港-场景",
        "🇹🇼 台湾-场景",
        "🇯🇵 日本-场景",
        "🇸🇬 新加坡-场景",
        "🇺🇲 美国-场景",
        "🌐 其他地区-场景",
        "♻️ 自动选择",
        "🌐 全部节点",
        "直连"
      ]
    },
    {
      name: "🍀 Google",
      type: "select",
      proxies: [
        "🚀 默认代理",
        "🇭🇰 香港-场景",
        "🇹🇼 台湾-场景",
        "🇯🇵 日本-场景",
        "🇸🇬 新加坡-场景",
        "🇺🇲 美国-场景",
        "🌐 其他地区-场景",
        "♻️ 自动选择",
        "🌐 全部节点",
        "直连"
      ]
    },
    {
      name: "🤖 ChatGPT",
      type: "select",
      proxies: [
        "🚀 默认代理",
        "🇭🇰 香港-场景",
        "🇹🇼 台湾-场景",
        "🇯🇵 日本-场景",
        "🇸🇬 新加坡-场景",
        "🇺🇲 美国-场景",
        "🌐 其他地区-场景",
        "♻️ 自动选择",
        "🌐 全部节点",
        "直连"
      ]
    },
    {
      name: "👨🏿‍💻 GitHub",
      type: "select",
      proxies: [
        "🚀 默认代理",
        "🇭🇰 香港-场景",
        "🇹🇼 台湾-场景",
        "🇯🇵 日本-场景",
        "🇸🇬 新加坡-场景",
        "🇺🇲 美国-场景",
        "🌐 其他地区-场景",
        "♻️ 自动选择",
        "🌐 全部节点",
        "直连"
      ]
    },
    {
      name: "🐬 OneDrive",
      type: "select",
      proxies: [
        "🚀 默认代理",
        "🇭🇰 香港-场景",
        "🇹🇼 台湾-场景",
        "🇯🇵 日本-场景",
        "🇸🇬 新加坡-场景",
        "🇺🇲 美国-场景",
        "🌐 其他地区-场景",
        "♻️ 自动选择",
        "🌐 全部节点",
        "直连"
      ]
    },
    {
      name: "🪟 Microsoft",
      type: "select",
      proxies: [
        "🚀 默认代理",
        "🇭🇰 香港-场景",
        "🇹🇼 台湾-场景",
        "🇯🇵 日本-场景",
        "🇸🇬 新加坡-场景",
        "🇺🇲 美国-场景",
        "🌐 其他地区-场景",
        "♻️ 自动选择",
        "🌐 全部节点",
        "直连"
      ]
    },
    {
      name: "🎵 TikTok",
      type: "select",
      proxies: [
        "🚀 默认代理",
        "🇭🇰 香港-场景",
        "🇹🇼 台湾-场景",
        "🇯🇵 日本-场景",
        "🇸🇬 新加坡-场景",
        "🇺🇲 美国-场景",
        "🌐 其他地区-场景",
        "♻️ 自动选择",
        "🌐 全部节点",
        "直连"
      ]
    },
    {
      name: "📲 Telegram",
      type: "select",
      proxies: [
        "🚀 默认代理",
        "🇭🇰 香港-场景",
        "🇹🇼 台湾-场景",
        "🇯🇵 日本-场景",
        "🇸🇬 新加坡-场景",
        "🇺🇲 美国-场景",
        "🌐 其他地区-场景",
        "♻️ 自动选择",
        "🌐 全部节点",
        "直连"
      ]
    },
    {
      name: "🎥 NETFLIX",
      type: "select",
      proxies: [
        "🚀 默认代理",
        "🇭🇰 香港-场景",
        "🇹🇼 台湾-场景",
        "🇯🇵 日本-场景",
        "🇸🇬 新加坡-场景",
        "🇺🇲 美国-场景",
        "🌐 其他地区-场景",
        "♻️ 自动选择",
        "🌐 全部节点",
        "直连"
      ]
    },
    {
      name: "✈️ Speedtest",
      type: "select",
      proxies: [
        "🚀 默认代理",
        "🇭🇰 香港-场景",
        "🇹🇼 台湾-场景",
        "🇯🇵 日本-场景",
        "🇸🇬 新加坡-场景",
        "🇺🇲 美国-场景",
        "🌐 其他地区-场景",
        "♻️ 自动选择",
        "🌐 全部节点",
        "直连"
      ]
    },
    {
      name: "💶 PayPal",
      type: "select",
      proxies: [
        "🚀 默认代理",
        "🇭🇰 香港-场景",
        "🇹🇼 台湾-场景",
        "🇯🇵 日本-场景",
        "🇸🇬 新加坡-场景",
        "🇺🇲 美国-场景",
        "🌐 其他地区-场景",
        "♻️ 自动选择",
        "🌐 全部节点",
        "直连"
      ]
    },
    {
      name: "🍎 Apple",
      type: "select",
      proxies: [
        "🚀 默认代理",
        "🇭🇰 香港-场景",
        "🇹🇼 台湾-场景",
        "🇯🇵 日本-场景",
        "🇸🇬 新加坡-场景",
        "🇺🇲 美国-场景",
        "🌐 其他地区-场景",
        "♻️ 自动选择",
        "🌐 全部节点",
        "直连"
      ]
    },

    // 香港地区策略组
    {
      name: "🇭🇰 香港-场景",
      type: "select",
      proxies: ["🇭🇰 香港-自动", "🇭🇰 香港-手动", "🇭🇰 香港-故障转移", "🇭🇰 香港-负载均衡"]
    },
    {
      name: "🇭🇰 香港-自动",
      type: "url-test",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 20,
      "include-all": true,
      filter: "(?=.*(港|HK|(?i)Hong))^((?!(台|日|韩|新|深|美)).)*$"
    },
    {
      name: "🇭🇰 香港-手动",
      type: "select",
      "include-all": true,
      filter: "(?i)港|hk|hongkong|hong kong"
    },
    {
      name: "🇭🇰 香港-故障转移",
      type: "fallback",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 20,
      "include-all": true,
      filter: "(?=.*(港|HK|(?i)Hong))^((?!(台|日|韩|新|深|美)).)*$"
    },
    {
      name: "🇭🇰 香港-负载均衡",
      type: "load-balance",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      strategy: "round-robin",
      "include-all": true,
      filter: "(?=.*(港|HK|(?i)Hong))^((?!(台|日|韩|新|深|美)).)*$"
    },

    // 台湾地区策略组
    {
      name: "🇹🇼 台湾-场景",
      type: "select",
      proxies: ["🇹🇼 台湾-自动", "🇹🇼 台湾-手动", "🇹🇼 台湾-故障转移", "🇹🇼 台湾-负载均衡"]
    },
    {
      name: "🇹🇼 台湾-自动",
      type: "url-test",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 30,
      "include-all": true,
      filter: "(?i)台|tw|taiwan|formosa|台湾|台灣"
    },
    {
      name: "🇹🇼 台湾-手动",
      type: "select",
      "include-all": true,
      filter: "(?i)台|tw|taiwan|formosa|台湾|台灣"
    },
    {
      name: "🇹🇼 台湾-故障转移",
      type: "fallback",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 20,
      "include-all": true,
      filter: "(?i)台|tw|taiwan|formosa|台湾|台灣"
    },
    {
      name: "🇹🇼 台湾-负载均衡",
      type: "load-balance",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      strategy: "round-robin",
      "include-all": true,
      filter: "(?i)台|tw|taiwan|formosa|台湾|台灣"
    },

    // 日本地区策略组
    {
      name: "🇯🇵 日本-场景",
      type: "select",
      proxies: ["🇯🇵 日本-自动", "🇯🇵 日本-手动", "🇯🇵 日本-故障转移", "🇯🇵 日本-负载均衡"]
    },
    {
      name: "🇯🇵 日本-自动",
      type: "url-test",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 20,
      "include-all": true,
      filter: "(?=.*(日|JP|(?i)Japan))^((?!(港|台|韩|新|美)).)*$"
    },
    {
      name: "🇯🇵 日本-手动",
      type: "select",
      "include-all": true,
      filter: "(?i)日|jp|japan"
    },
    {
      name: "🇯🇵 日本-故障转移",
      type: "fallback",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 20,
      "include-all": true,
      filter: "(?=.*(日|JP|(?i)Japan))^((?!(港|台|韩|新|美)).)*$"
    },
    {
      name: "🇯🇵 日本-负载均衡",
      type: "load-balance",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      strategy: "round-robin",
      "include-all": true,
      filter: "(?=.*(日|JP|(?i)Japan))^((?!(港|台|韩|新|美)).)*$"
    },

    // 新加坡地区策略组
    {
      name: "🇸🇬 新加坡-场景",
      type: "select",
      proxies: ["🇸🇬 新加坡-自动", "🇸🇬 新加坡-手动", "🇸🇬 新加坡-故障转移", "🇸🇬 新加坡-负载均衡"]
    },
    {
      name: "🇸🇬 新加坡-自动",
      type: "url-test",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 30,
      "include-all": true,
      filter: "(?i)新|sg|singapore|狮城|lion city"
    },
    {
      name: "🇸🇬 新加坡-手动",
      type: "select",
      "include-all": true,
      filter: "(?i)新|sg|singapore|狮城|lion city"
    },
    {
      name: "🇸🇬 新加坡-故障转移",
      type: "fallback",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 20,
      "include-all": true,
      filter: "(?i)新|sg|singapore|狮城|lion city"
    },
    {
      name: "🇸🇬 新加坡-负载均衡",
      type: "load-balance",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      strategy: "round-robin",
      "include-all": true,
      filter: "(?i)新|sg|singapore|狮城|lion city"
    },

    // 美国地区策略组
    {
      name: "🇺🇲 美国-场景",
      type: "select",
      proxies: ["🇺🇲 美国-自动", "🇺🇲 美国-手动", "🇺🇲 美国-故障转移", "🇺🇲 美国-负载均衡"]
    },
    {
      name: "🇺🇲 美国-自动",
      type: "url-test",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 20,
      "include-all": true,
      filter: "(?=.*(美|US|(?i)States|America))^((?!(港|台|日|韩|新)).)*$"
    },
    {
      name: "🇺🇲 美国-手动",
      type: "select",
      "include-all": true,
      filter: "(?i)美|us|unitedstates|united states|america"
    },
    {
      name: "🇺🇲 美国-故障转移",
      type: "fallback",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 20,
      "include-all": true,
      filter: "(?=.*(美|US|(?i)States|America))^((?!(港|台|日|韩|新)).)*$"
    },
    {
      name: "🇺🇲 美国-负载均衡",
      type: "load-balance",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      strategy: "round-robin",
      "include-all": true,
      filter: "(?=.*(美|US|(?i)States|America))^((?!(港|台|日|韩|新)).)*$"
    },

    // 其他地区策略组
    {
      name: "🌐 其他地区-场景",
      type: "select",
      proxies: ["🌐 其他地区-自动", "🌐 其他地区-手动", "🌐 其他地区-故障转移", "🌐 其他地区-负载均衡"]
    },
    {
      name: "🌐 其他地区-自动",
      type: "url-test",
      url: "https://www.gstatic.com/generate_204",
      interval: 360,
      tolerance: 100,
      "include-all": true,
      filter: "(?i)^(?!.*(港|hk|hongkong|hong kong|台|tw|taiwan|台湾|台灣|formosa|日|jp|japan|新|sg|singapore|狮城|lion city|美|us|united states|america|直连|流量|套餐|重置|官网|剩余)).*$"
    },
    {
      name: "🌐 其他地区-手动",
      type: "select",
      "include-all": true,
      filter: "(?i)^(?!.*(港|hk|hongkong|hong kong|台|tw|taiwan|台湾|台灣|formosa|日|jp|japan|新|sg|singapore|狮城|lion city|美|us|united states|america|直连|流量|套餐|重置|官网|剩余)).*$"
    },
    {
      name: "🌐 其他地区-故障转移",
      type: "fallback",
      url: "https://www.gstatic.com/generate_204",
      interval: 360,
      tolerance: 20,
      "include-all": true,
      filter: "(?i)^(?!.*(港|hk|hongkong|hong kong|台|tw|taiwan|台湾|台灣|formosa|日|jp|japan|新|sg|singapore|狮城|lion city|美|us|united states|america|直连|流量|套餐|重置|官网|剩余)).*$"
    },
    {
      name: "🌐 其他地区-负载均衡",
      type: "load-balance",
      url: "https://www.gstatic.com/generate_204",
      interval: 360,
      strategy: "round-robin",
      "include-all": true,
      filter: "(?i)^(?!.*(港|hk|hongkong|hong kong|台|tw|taiwan|台湾|台灣|formosa|日|jp|japan|新|sg|singapore|狮城|lion city|美|us|united states|america|直连|流量|套餐|重置|官网|剩余)).*$"
    },

    // 全球直连和漏网之鱼
    {
      name: "🎯 全球直连",
      type: "select",
      proxies: ["直连"]
    },
    {
      name: "🐟 漏网之鱼",
      type: "select",
      proxies: [
        "🚀 默认代理",
        "🇭🇰 香港-场景",
        "🇹🇼 台湾-场景",
        "🇯🇵 日本-场景",
        "🇸🇬 新加坡-场景",
        "🇺🇲 美国-场景",
        "🌐 其他地区-场景",
        "♻️ 自动选择",
        "🌐 全部节点",
        "直连"
      ]
    }
  ];

  // 3. 添加规则提供者
  if (!config['rule-providers']) {
    config['rule-providers'] = {};
  }

  config['rule-providers'] = Object.assign(config['rule-providers'], {
    private_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    proxylite: {
      url: "https://raw.githubusercontent.com/qichiyuhub/rule/refs/heads/main/proxy.list",
      type: "http",
      interval: 86400,
      behavior: "classical",
      format: "text"
    },
    ai: {
      url: "https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/category-ai-!cn.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    youtube_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/youtube.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    google_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    github_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/github.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    telegram_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    netflix_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/netflix.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    paypal_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/paypal.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    onedrive_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/onedrive.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    microsoft_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    apple_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/apple-cn.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    speedtest_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/ookla-speedtest.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    tiktok_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/tiktok.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    gfw_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/gfw.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    "geolocation-!cn": {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/geolocation-!cn.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    cn_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    cn_ip: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.mrs",
      type: "http",
      interval: 86400,
      behavior: "ipcidr",
      format: "mrs"
    },
    google_ip: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/google.mrs",
      type: "http",
      interval: 86400,
      behavior: "ipcidr",
      format: "mrs"
    },
    telegram_ip: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/telegram.mrs",
      type: "http",
      interval: 86400,
      behavior: "ipcidr",
      format: "mrs"
    },
    netflix_ip: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/netflix.mrs",
      type: "http",
      interval: 86400,
      behavior: "ipcidr",
      format: "mrs"
    },
    "category-ads-all": {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ads-all.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    google_cn_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google-cn.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    }
  });

  // 4. 设置规则
  config.rules = [
    "RULE-SET,category-ads-all,REJECT",
    "DOMAIN-SUFFIX,qichiyu.com,🚀 默认代理",
    "RULE-SET,private_domain,🎯 全球直连",
    "GEOIP,LAN,🎯 全球直连,no-resolve",
    "RULE-SET,apple_domain,🍎 Apple",
    "RULE-SET,proxylite,🚀 默认代理",
    "RULE-SET,ai,🤖 ChatGPT",
    "RULE-SET,github_domain,👨🏿‍💻 GitHub",
    "RULE-SET,youtube_domain,📹 YouTube",
    "RULE-SET,google_cn_domain,🍀 Google",
    "RULE-SET,google_domain,🍀 Google",
    "RULE-SET,onedrive_domain,🐬 OneDrive",
    "RULE-SET,microsoft_domain,🪟 Microsoft",
    "RULE-SET,tiktok_domain,🎵 TikTok",
    "RULE-SET,speedtest_domain,✈️ Speedtest",
    "RULE-SET,telegram_domain,📲 Telegram",
    "RULE-SET,netflix_domain,🎥 NETFLIX",
    "RULE-SET,paypal_domain,💶 PayPal",
    "RULE-SET,gfw_domain,🚀 默认代理",
    "RULE-SET,geolocation-!cn,🚀 默认代理",
    "RULE-SET,cn_domain,🎯 全球直连",
    "RULE-SET,google_ip,🍀 Google,no-resolve",
    "RULE-SET,netflix_ip,🎥 NETFLIX,no-resolve",
    "RULE-SET,telegram_ip,📲 Telegram,no-resolve",
    "RULE-SET,cn_ip,🎯 全球直连",
    "MATCH,🐟 漏网之鱼"
  ];

  return config;
}
