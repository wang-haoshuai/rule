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
    
    // 全局自动选择和全部节点组 - 排除无关节点但保留直连
    {
      name: "♻️ 自动选择",
      type: "url-test",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 50,
      "include-all": true,
      // 排除包含流量、套餐、重置、官网、剩余、到期等关键词的节点
      filter: "^((?!(流量|套餐|重置|官网|剩余|到期|expire|traffic|package)).)*$"
    },
    {
      name: "🌐 全部节点",
      type: "select",
      "include-all": true,
      // 排除包含流量、套餐、重置、官网、剩余、到期等关键词的节点
      filter: "^((?!(流量|套餐|重置|官网|剩余|到期|expire|traffic|package)).)*$"
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
      // 优化香港节点过滤：匹配港|HK|Hong但排除台|日|韩|新|美|深圳等地区
      filter: "(?=.*(港|HK|(?i)Hong))^((?!(台|日|韩|新|美|深圳|流量|套餐|重置|官网|剩余|到期)).)*$"
    },
    {
      name: "🇭🇰 香港-手动",
      type: "select",
      "include-all": true,
      // 香港手动选择：匹配香港相关关键词
      filter: "(?i)(港|hk|hongkong|hong kong)"
    },
    {
      name: "🇭🇰 香港-故障转移",
      type: "fallback",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 20,
      "include-all": true,
      filter: "(?=.*(港|HK|(?i)Hong))^((?!(台|日|韩|新|美|深圳|流量|套餐|重置|官网|剩余|到期)).)*$"
    },
    {
      name: "🇭🇰 香港-负载均衡",
      type: "load-balance",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      strategy: "round-robin",
      "include-all": true,
      filter: "(?=.*(港|HK|(?i)Hong))^((?!(台|日|韩|新|美|深圳|流量|套餐|重置|官网|剩余|到期)).)*$"
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
      // 优化台湾节点过滤：匹配台湾相关关键词但排除其他地区和无关节点
      filter: "(?=.*(台|TW|(?i)Taiwan|Formosa))^((?!(港|日|韩|新|美|流量|套餐|重置|官网|剩余|到期)).)*$"
    },
    {
      name: "🇹🇼 台湾-手动",
      type: "select",
      "include-all": true,
      filter: "(?i)(台|tw|taiwan|formosa|台湾|台灣)"
    },
    {
      name: "🇹🇼 台湾-故障转移",
      type: "fallback",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 20,
      "include-all": true,
      filter: "(?=.*(台|TW|(?i)Taiwan|Formosa))^((?!(港|日|韩|新|美|流量|套餐|重置|官网|剩余|到期)).)*$"
    },
    {
      name: "🇹🇼 台湾-负载均衡",
      type: "load-balance",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      strategy: "round-robin",
      "include-all": true,
      filter: "(?=.*(台|TW|(?i)Taiwan|Formosa))^((?!(港|日|韩|新|美|流量|套餐|重置|官网|剩余|到期)).)*$"
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
      // 优化日本节点过滤：匹配日本|JP|Japan但排除港|台|韩|新|美等地区，避免沪日等非日本节点
      filter: "(?i)(日本|jp|japan)"
    },
    {
      name: "🇯🇵 日本-手动",
      type: "select",
      "include-all": true,
      filter: "(?i)(日本|jp|japan)"
    },
    {
      name: "🇯🇵 日本-故障转移",
      type: "fallback",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 20,
      "include-all": true,
      filter: "(?i)(日本|jp|japan)"
    },
    {
      name: "🇯🇵 日本-负载均衡",
      type: "load-balance",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      strategy: "round-robin",
      "include-all": true,
      filter: "(?i)(日本|jp|japan)"
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
      // 新加坡节点过滤：匹配新加坡相关关键词
      filter: "(?=.*(新加坡|狮城|SG|(?i)Singapore))^((?!(港|台|日|韩|美|流量|套餐|重置|官网|剩余|到期)).)*$"
    },
    {
      name: "🇸🇬 新加坡-手动",
      type: "select",
      "include-all": true,
      filter: "(?i)(新加坡|狮城|sg|singapore)"
    },
    {
      name: "🇸🇬 新加坡-故障转移",
      type: "fallback",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 20,
      "include-all": true,
      filter: "(?=.*(新加坡|狮城|SG|(?i)Singapore))^((?!(港|台|日|韩|美|流量|套餐|重置|官网|剩余|到期)).)*$"
    },
    {
      name: "🇸🇬 新加坡-负载均衡",
      type: "load-balance",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      strategy: "round-robin",
      "include-all": true,
      filter: "(?=.*(新加坡|狮城|SG|(?i)Singapore))^((?!(港|台|日|韩|美|流量|套餐|重置|官网|剩余|到期)).)*$"
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
      // 修复美国节点过滤：匹配美国相关关键词但排除其他地区
      filter: "(?i)(美国|美|us|united.*states|america)"
    },
    {
      name: "🇺🇲 美国-手动",
      type: "select",
      "include-all": true,
      filter: "(?i)(美国|美|us|united.*states|america)"
    },
    {
      name: "🇺🇲 美国-故障转移",
      type: "fallback",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      tolerance: 20,
      "include-all": true,
      filter: "(?i)(美国|美|us|united.*states|america)"
    },
    {
      name: "🇺🇲 美国-负载均衡",
      type: "load-balance",
      url: "https://www.gstatic.com/generate_204",
      interval: 300,
      strategy: "round-robin",
      "include-all": true,
      filter: "(?i)(美国|美|us|united.*states|america)"
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
      // 其他地区过滤：排除主要地区和无关节点，但不排除直连
      filter: "(?i)^(?!.*(港|hk|hongkong|hong kong|台|tw|taiwan|台湾|台灣|formosa|日本|jp|japan|新加坡|狮城|sg|singapore|美国|美|us|united states|america|流量|套餐|重置|官网|剩余|到期)).*$"
    },
    {
      name: "🌐 其他地区-手动",
      type: "select",
      "include-all": true,
      filter: "(?i)^(?!.*(港|hk|hongkong|hong kong|台|tw|taiwan|台湾|台灣|formosa|日本|jp|japan|新加坡|狮城|sg|singapore|美国|美|us|united states|america|流量|套餐|重置|官网|剩余|到期)).*$"
    },
    {
      name: "🌐 其他地区-故障转移",
      type: "fallback",
      url: "https://www.gstatic.com/generate_204",
      interval: 360,
      tolerance: 20,
      "include-all": true,
      filter: "(?i)^(?!.*(港|hk|hongkong|hong kong|台|tw|taiwan|台湾|台灣|formosa|日本|jp|japan|新加坡|狮城|sg|singapore|美国|美|us|united states|america|流量|套餐|重置|官网|剩余|到期)).*$"
    },
    {
      name: "🌐 其他地区-负载均衡",
      type: "load-balance",
      url: "https://www.gstatic.com/generate_204",
      interval: 360,
      strategy: "round-robin",
      "include-all": true,
      filter: "(?i)^(?!.*(港|hk|hongkong|hong kong|台|tw|taiwan|台湾|台灣|formosa|日本|jp|japan|新加坡|狮城|sg|singapore|美国|美|us|united states|america|流量|套餐|重置|官网|剩余|到期)).*$"
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

  // 3. 配置规则提供者 - 定义各种分流规则的数据源
  if (!config['rule-providers']) {
    config['rule-providers'] = {};
  }

  config['rule-providers'] = Object.assign(config['rule-providers'], {
    // 私有域名规则
    private_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/private.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    // 自定义直连规则
    custom_direct: {
      url: "https://raw.githubusercontent.com/wang-haoshuai/rule/refs/heads/master/rule/Direct/Direct.list",
      type: "http",
      interval: 86400,
      behavior: "classical",
      format: "text"
    },
    // 代理精简版规则
    proxylite: {
      url: "https://raw.githubusercontent.com/qichiyuhub/rule/refs/heads/main/proxy.list",
      type: "http",
      interval: 86400,
      behavior: "classical",
      format: "text"
    },
    // AI相关域名规则
    ai: {
      url: "https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/category-ai-!cn.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    // YouTube域名规则
    youtube_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/youtube.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    // Google域名规则
    google_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    // GitHub域名规则
    github_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/github.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    // Telegram域名规则
    telegram_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/telegram.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    // Netflix域名规则
    netflix_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/netflix.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    // PayPal域名规则
    paypal_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/paypal.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    // OneDrive域名规则
    onedrive_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/onedrive.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    // Microsoft域名规则
    microsoft_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/microsoft.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    // Apple中国域名规则
    apple_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/apple-cn.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    // Speedtest域名规则
    speedtest_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/ookla-speedtest.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    // TikTok域名规则
    tiktok_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/tiktok.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    // GFW被墙域名规则
    gfw_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/gfw.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    // 非中国地区域名规则
    "geolocation-!cn": {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/geolocation-!cn.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    // 中国域名规则
    cn_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/cn.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    // 中国IP规则
    cn_ip: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/cn.mrs",
      type: "http",
      interval: 86400,
      behavior: "ipcidr",
      format: "mrs"
    },
    // Google IP规则
    google_ip: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/google.mrs",
      type: "http",
      interval: 86400,
      behavior: "ipcidr",
      format: "mrs"
    },
    // Telegram IP规则
    telegram_ip: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/telegram.mrs",
      type: "http",
      interval: 86400,
      behavior: "ipcidr",
      format: "mrs"
    },
    // Netflix IP规则
    netflix_ip: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geoip/netflix.mrs",
      type: "http",
      interval: 86400,
      behavior: "ipcidr",
      format: "mrs"
    },
    // 广告拦截规则
    "category-ads-all": {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ads-all.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    },
    // Google中国域名规则
    google_cn_domain: {
      url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/google-cn.mrs",
      type: "http",
      interval: 86400,
      behavior: "domain",
      format: "mrs"
    }
  });

  // 4. 设置分流规则 - 按优先级排序，从上到下匹配
  config.rules = [
    "RULE-SET,category-ads-all,REJECT", // 拦截广告
    "DOMAIN-SUFFIX,qichiyu.com,🚀 默认代理", // 自定义域名代理
    "RULE-SET,custom_direct,🎯 全球直连", // 自定义直连规则
    "RULE-SET,private_domain,🎯 全球直连", // 私有域名直连
    "GEOIP,LAN,🎯 全球直连,no-resolve", // 局域网直连
    "RULE-SET,apple_domain,🍎 Apple", // Apple服务
    "RULE-SET,proxylite,🚀 默认代理", // 代理精简规则
    "RULE-SET,ai,🤖 ChatGPT", // AI相关服务
    "RULE-SET,github_domain,👨🏿‍💻 GitHub", // GitHub服务
    "RULE-SET,youtube_domain,📹 YouTube", // YouTube服务
    "RULE-SET,google_cn_domain,🍀 Google", // Google中国服务
    "RULE-SET,google_domain,🍀 Google", // Google服务
    "RULE-SET,onedrive_domain,🐬 OneDrive", // OneDrive服务
    "RULE-SET,microsoft_domain,🪟 Microsoft", // Microsoft服务
    "RULE-SET,tiktok_domain,🎵 TikTok", // TikTok服务
    "RULE-SET,speedtest_domain,✈️ Speedtest", // Speedtest服务
    "RULE-SET,telegram_domain,📲 Telegram", // Telegram服务
    "RULE-SET,netflix_domain,🎥 NETFLIX", // Netflix服务
    "RULE-SET,paypal_domain,💶 PayPal", // PayPal服务
    "RULE-SET,gfw_domain,🚀 默认代理", // 被墙域名代理
    "RULE-SET,geolocation-!cn,🚀 默认代理", // 非中国域名代理
    "RULE-SET,cn_domain,🎯 全球直连", // 中国域名直连
    "RULE-SET,google_ip,🍀 Google,no-resolve", // Google IP
    "RULE-SET,netflix_ip,🎥 NETFLIX,no-resolve", // Netflix IP
    "RULE-SET,telegram_ip,📲 Telegram,no-resolve", // Telegram IP
    "RULE-SET,cn_ip,🎯 全球直连", // 中国IP直连
    "MATCH,🐟 漏网之鱼" // 兜底规则
  ];

  return config;
}
