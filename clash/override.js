/**
 * Clash JavaScript 配置覆写扩展 - 最终修复版 (v2.1)
 * * 修复：将所有 '直连' 替换为系统核心关键字 'DIRECT'，解决启动报错
 * * 功能：包含 aTrust VPN 修复、游戏/流媒体/AI 增强分流
 */

function main(config) {
    // --- 1. 基础全局配置 ---
    const globalOverrides = {
        'mixed-port': 7890,
        'allow-lan': true,
        'bind-address': '*',
        ipv6: false,
        'unified-delay': true,
        'tcp-concurrent': true,
        'log-level': 'info',
        'find-process-mode': 'strict',
        'global-client-fingerprint': 'chrome',
        'keep-alive-idle': 600,
        'keep-alive-interval': 15
    };
    Object.assign(config, globalOverrides);

    // --- 2. 外部资源镜像 ---
    const mirrorUrl = 'https://mirror.ghproxy.com/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest';
    config['geox-url'] = {
        geoip: `${mirrorUrl}/geoip-lite.dat`,
        geosite: `${mirrorUrl}/geosite.dat`,
        mmdb: `${mirrorUrl}/country-lite.mmdb`,
        asn: `${mirrorUrl}/GeoLite2-ASN.mmdb`
    };
    config['geo-auto-update'] = true;
    config['geo-update-interval'] = 24;

    // --- 3. 增强型 DNS 配置 ---
    config.dns = {
        enable: true,
        listen: '0.0.0.0:1053',
        ipv6: false,
        'respect-rules': true,
        'enhanced-mode': 'fake-ip',
        'fake-ip-range': '198.18.0.1/16',
        'fake-ip-filter': [
            // === VPN 防劫持 ===
            '+.sangfor.com.cn',
            '+.sangfor.com',
            '+.vpn.crceg.cn', // 你提供的公司VPN域名
            // 基础过滤
            'rule-set:private_domain,cn_domain',
            '*.lan', '*.local',
            'login.microsoftonline.com', 
            '*.msftconnecttest.com', 
            '*.msftncsi.com'
        ],
        'default-nameserver': ['223.5.5.5', '119.29.29.29'],
        nameserver: [
            'https://dns.alidns.com/dns-query',
            'https://doh.pub/dns-query'
        ],
        fallback: [
            'https://dns.google/dns-query',
            'https://1.1.1.1/dns-query',
            'tls://8.8.4.4'
        ],
        'fallback-filter': {
            geoip: true,
            'geoip-code': 'CN',
            ipcidr: ['240.0.0.0/4']
        },
        'nameserver-policy': {
            'geosite:cn,private,apple-cn': ['https://dns.alidns.com/dns-query', 'https://doh.pub/dns-query'],
            '*.sangfor.com.cn': ['https://dns.alidns.com/dns-query'],
            '*.vpn.crceg.cn': ['https://dns.alidns.com/dns-query'],
            'geosite:google,youtube,telegram,gfw,netflix': ['https://dns.google/dns-query']
        }
    };

    // --- 4. TUN 与嗅探 ---
    config.tun = {
        enable: true,
        stack: 'mixed',
        'dns-hijack': ['any:53'],
        'auto-route': true,
        'auto-detect-interface': true
    };

    config.sniffer = {
        enable: true,
        parsePTS: true,
        sniff: {
            HTTP: { ports: [80, '8080-8880'], 'override-destination': true },
            TLS: { ports: [443, 8443] },
            QUIC: { ports: [443, 8443] }
        }
    };

    // --- 5. 策略组生成 ---
    config['proxy-groups'] = generateProxyGroups();

    // --- 6. 规则生成 ---
    config.rules = generateRules();

    // --- 7. 规则提供者 ---
    config['rule-providers'] = generateRuleProviders();

    return config;
}

// ---------------- 辅助函数 ----------------

function generateProxyGroups() {
    // 关键修复：这里的 'DIRECT' 必须是大写英文，不能是 '直连'
    const baseProxies = [
        '🚀 默认代理',
        '🇭🇰 香港-场景',
        '🇯🇵 日本-场景',
        '🇺🇲 美国-场景',
        '🇸🇬 新加坡-场景',
        '🇹🇼 台湾-场景',
        '♻️ 自动选择',
        '🌐 全部节点',
        'DIRECT' 
    ];

    return [
        {
            name: '🚀 默认代理',
            type: 'select',
            proxies: ['♻️ 自动选择', '🇭🇰 香港-场景', '🇯🇵 日本-场景', '🇺🇲 美国-场景', '🇸🇬 新加坡-场景', '🇹🇼 台湾-场景', '🌐 全部节点', 'DIRECT']
        },
        {
            name: '♻️ 自动选择',
            type: 'url-test',
            url: 'https://www.gstatic.com/generate_204',
            interval: 300,
            tolerance: 50,
            'include-all': true,
            // 过滤掉 DIRECT 关键字
            filter: '^(?!.*(直连|DIRECT|重置|流量|官网|套餐|剩余)).*$'
        },
        {
            name: '🌐 全部节点',
            type: 'select',
            'include-all': true,
            filter: '^(?!.*(直连|DIRECT|重置|流量|官网|套餐|剩余)).*$'
        },

        // 应用分流组
        ...generateAppProxyGroups(baseProxies),

        // 地区场景组
        ...generateRegionProxyGroups(),

        // 兜底组
        { name: '🎯 全球直连', type: 'select', proxies: ['DIRECT'] },
        { name: '🐟 漏网之鱼', type: 'select', proxies: ['🚀 默认代理', 'DIRECT'] }
    ];
}

function generateAppProxyGroups(baseProxies) {
    const apps = [
        { name: '🤖 ChatGPT', icon: '🤖' },
        { name: '📹 YouTube', icon: '📹' },
        { name: '🍀 Google', icon: '🍀' },
        { name: '👨🏿‍💻 GitHub', icon: '👨🏿‍💻' },
        { name: '📲 Telegram', icon: '📲' },
        { name: '🎥 NETFLIX', icon: '🎥' },
        { name: '🐭 Disney+', icon: '🐭' },
        { name: '🎧 Spotify', icon: '🎧' },
        { name: '📺 Prime Video', icon: '📺' },
        { name: '🎮 Steam', icon: '🎮' },
        { name: '🐬 OneDrive', icon: '🐬' },
        { name: '🪟 Microsoft', icon: '🪟' },
        { name: '🎵 TikTok', icon: '🎵' },
        { name: '🍎 Apple', icon: '🍎' },
        { name: '✈️ Speedtest', icon: '✈️' },
        { name: '💶 PayPal', icon: '💶' }
    ];

    return apps.map(app => ({
        name: app.name,
        type: 'select',
        proxies: baseProxies
    }));
}

function generateRegionProxyGroups() {
    const regions = [
        { name: '香港', emoji: '🇭🇰', filter: '(?i)港|香港|hk|hong' },
        { name: '台湾', emoji: '🇹🇼', filter: '(?i)台|tw|台湾|taiwan' },
        { name: '日本', emoji: '🇯🇵', filter: '(?i)日|东京|大阪|jp|japan' },
        { name: '新加坡', emoji: '🇸🇬', filter: '(?i)新|新加坡|sg|singapore' },
        { name: '美国', emoji: '🇺🇲', filter: '(?i)美|美国|洛杉矶|旧金山|us|united' }
    ];

    const groups = [];
    regions.forEach(r => {
        groups.push({
            name: `${r.emoji} ${r.name}-场景`,
            type: 'url-test',
            url: 'https://www.gstatic.com/generate_204',
            interval: 300,
            tolerance: 50,
            'include-all': true,
            filter: r.filter
        });
    });
    return groups;
}

function generateRules() {
    return [
        'RULE-SET,category-ads-all,REJECT',

        // === VPN 与 内网 直连 ===
        'DOMAIN-SUFFIX,sangfor.com.cn,🎯 全球直连', 
        'DOMAIN-SUFFIX,sangfor.com,🎯 全球直连',
        'DOMAIN-KEYWORD,sangfor,🎯 全球直连',
        'DOMAIN-KEYWORD,atrust,🎯 全球直连',
        // 你的公司 VPN 关键词
        'DOMAIN-KEYWORD,crceg,🎯 全球直连', 
        'DOMAIN-SUFFIX,vpn.crceg.cn,🎯 全球直连',

        'RULE-SET,private_domain,🎯 全球直连',
        'GEOIP,LAN,🎯 全球直连,no-resolve',

        // === 应用分流 ===
        'RULE-SET,ai,🤖 ChatGPT',
        'RULE-SET,youtube_domain,📹 YouTube',
        'RULE-SET,google_domain,🍀 Google',
        'RULE-SET,github_domain,👨🏿‍💻 GitHub',
        'RULE-SET,telegram_domain,📲 Telegram',
        'RULE-SET,netflix_domain,🎥 NETFLIX',
        'RULE-SET,disney_domain,🐭 Disney+',
        'RULE-SET,spotify_domain,🎧 Spotify',
        'RULE-SET,primevideo_domain,📺 Prime Video',
        'RULE-SET,steam_domain,🎮 Steam',
        'RULE-SET,games_domain,🎮 Steam',
        'RULE-SET,tiktok_domain,🎵 TikTok',
        'RULE-SET,onedrive_domain,🐬 OneDrive',
        'RULE-SET,microsoft_domain,🪟 Microsoft',
        'RULE-SET,apple_domain,🍎 Apple',
        'RULE-SET,speedtest_domain,✈️ Speedtest',
        'RULE-SET,paypal_domain,💶 PayPal',

        // === 兜底 ===
        'RULE-SET,gfw_domain,🚀 默认代理',
        'RULE-SET,geolocation-!cn,🚀 默认代理',
        'RULE-SET,cn_domain,🎯 全球直连',
        'RULE-SET,cn_ip,🎯 全球直连',
        
        'RULE-SET,google_ip,🍀 Google,no-resolve',
        'RULE-SET,netflix_ip,🎥 NETFLIX,no-resolve',
        'RULE-SET,telegram_ip,📲 Telegram,no-resolve',
        
        'MATCH,🐟 漏网之鱼'
    ];
}

function generateRuleProviders() {
    const mirror = 'https://mirror.ghproxy.com/https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo';
    const provider = (path, type = 'domain') => ({
        type: 'http',
        interval: 86400,
        behavior: type,
        format: 'mrs',
        url: `${mirror}/${path}.mrs`
    });

    return {
        private_domain: provider('geosite/private'),
        'category-ads-all': provider('geosite/category-ads-all'),
        ai: provider('geosite/category-ai-chat-!cn'),
        youtube_domain: provider('geosite/youtube'),
        google_domain: provider('geosite/google'),
        github_domain: provider('geosite/github'),
        telegram_domain: provider('geosite/telegram'),
        tiktok_domain: provider('geosite/tiktok'),
        onedrive_domain: provider('geosite/onedrive'),
        microsoft_domain: provider('geosite/microsoft'),
        apple_domain: provider('geosite/apple-cn'),
        speedtest_domain: provider('geosite/ookla-speedtest'),
        paypal_domain: provider('geosite/paypal'),
        netflix_domain: provider('geosite/netflix'),
        disney_domain: provider('geosite/disney'),
        spotify_domain: provider('geosite/spotify'),
        primevideo_domain: provider('geosite/primevideo'),
        steam_domain: provider('geosite/steam'),
        games_domain: provider('geosite/category-games'),
        gfw_domain: provider('geosite/gfw'),
        'geolocation-!cn': provider('geosite/geolocation-!cn'),
        cn_domain: provider('geosite/cn'),
        cn_ip: provider('geoip/cn', 'ipcidr'),
        google_ip: provider('geoip/google', 'ipcidr'),
        telegram_ip: provider('geoip/telegram', 'ipcidr'),
        netflix_ip: provider('geoip/netflix', 'ipcidr')
    };
}
