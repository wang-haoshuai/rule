/**
 * Clash JavaScript 配置覆写扩展
 * 该文件提供动态配置修改和扩展功能
 */

// 主配置覆写函数
function main(config) {
    // 基础全局配置覆写
    const globalOverrides = {
        port: 7890,
        'socks-port': 7891,
        'redir-port': 7892,
        'mixed-port': 7893,
        'tproxy-port': 7894,
        'allow-lan': true,
        'bind-address': '*',
        ipv6: false,
        'unified-delay': true,
        'tcp-concurrent': true,
        'log-level': 'warning',
        'find-process-mode': 'off',
        'global-client-fingerprint': 'chrome',
        'keep-alive-idle': 600,
        'keep-alive-interval': 15,
        'disable-keep-alive': false
    };

    // 应用全局配置
    Object.assign(config, globalOverrides);

    // GeoData 配置覆写
    config['geox-url'] = {
        geoip: 'https://mirror.ghproxy.com/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip-lite.dat',
        geosite: 'https://mirror.ghproxy.com/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat',
        mmdb: 'https://mirror.ghproxy.com/https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/country-lite.mmdb',
        asn: 'https://mirror.ghproxy.com/https://github.com/xishang0128/geoip/releases/download/latest/GeoLite2-ASN.mmdb'
    };
    config['geo-auto-update'] = true;
    config['geo-update-interval'] = 24;

    // Profile 配置
    config.profile = {
        'store-selected': true,
        'store-fake-ip': true
    };

    // 外部控制配置
    config['external-controller'] = '0.0.0.0:9090';
    config.secret = 'Anfeng1314!';

    // 流量嗅探配置
    config.sniffer = {
        enable: true,
        sniff: {
            HTTP: {
                ports: [80, '8080-8880'],
                'override-destination': true
            },
            TLS: {
                ports: [443, 8443]
            },
            QUIC: {
                ports: [443, 8443]
            }
        },
        'force-domain': ['+.v2ex.com'],
        'skip-domain': ['+.baidu.com']
    };

    // TUN 模式配置
    config.tun = {
        enable: true,
        stack: 'mixed',
        'dns-hijack': ['any:53', 'tcp://any:53'],
        'auto-route': true,
        'auto-redirect': true,
        'auto-detect-interface': true
    };

    // DNS 配置覆写
    config.dns = {
        enable: true,
        listen: '0.0.0.0:1053',
        ipv6: false,
        'respect-rules': true,
        'enhanced-mode': 'fake-ip',
        'cache-algorithm': 'arc',
        'use-hosts': false,
        'fake-ip-range': '28.0.0.1/8',
        'fake-ip-filter-mode': 'blacklist',
        'fake-ip-filter': [
            'rule-set:private_domain,cn_domain',
            '+.msftconnecttest.com',
            '+.msftncsi.com',
            'time.*.com',
            '+.market.xiaomi.com'
        ],
        'default-nameserver': ['223.5.5.5'],
        'proxy-server-nameserver': ['https://223.5.5.5/dns-query'],
        nameserver: ['223.5.5.5', '119.29.29.29'],
        fallback: ['1.1.1.1', '8.8.8.8', '9.9.9.9'],
        'fallback-filter': {
            geoip: true,
            'geoip-code': 'CN'
        },
        'nameserver-policy': {
            '*.gcloudsdk.com': ['223.5.5.5', '119.29.29.29'],
            '*.gcloudcs.com': ['223.5.5.5', '119.29.29.29'],
            'geosite:cn,private': ['223.5.5.5', '119.29.29.29'],
            'geosite:apple-cn': ['223.5.5.5', '119.29.29.29'],
            'geosite:category-ads-all': 'rcode://success',
            'login.microsoft.com': ['1.1.1.1'],
            'login.microsoftonline.com': ['1.1.1.1'],
            '*.microsoftonline.com': ['1.1.1.1'],
            '*.msidentity.com': ['1.1.1.1'],
            '*.privatelink.msidentity.com': ['1.1.1.1'],
            '*.trafficmanager.net': ['1.1.1.1'],
            '*.akadns.net': ['1.1.1.1']
        }
    };

    // // 代理提供者配置
    // config['proxy-providers'] = {
    //     Halo: {
    //         url: '',
    //         type: 'http'
    //         interval: 86400,
    //         'health-check': {
    //             enable: true,
    //             url: 'https://www.gstatic.com/generate_204',
    //             interval: 300
    //         },
    //         proxy: '直连',
    //         override: {
    //             udp: true
    //         }
    //     }
    // };

    // 确保基础代理存在
    if (!config.proxies) {
        config.proxies = [];
    }

    // 添加直连代理（如果不存在）
    const hasDirectProxy = config.proxies.some(proxy => proxy.name === '直连');
    if (!hasDirectProxy) {
        config.proxies.push({ name: '直连', type: 'direct' });
    }

    // 代理组配置
    config['proxy-groups'] = generateProxyGroups();

    // 规则配置
    config.rules = generateRules();

    // 规则提供者配置
    config['rule-providers'] = generateRuleProviders();

    return config;
}

// 生成代理组配置
function generateProxyGroups() {
    const baseProxies = [
        '🚀 默认代理',
        '🇭🇰 香港-场景',
        '🇹🇼 台湾-场景',
        '🇯🇵 日本-场景',
        '🇸🇬 新加坡-场景',
        '🇺🇲 美国-场景',
        '🌐 其他地区-场景',
        '♻️ 自动选择',
        '🌐 全部节点',
        '直连'
    ];

    return [
        // 核心默认代理组
        {
            name: '🚀 默认代理',
            type: 'select',
            proxies: [
                '♻️ 自动选择',
                '🇭🇰 香港-场景',
                '🇯🇵 日本-场景',
                '🇺🇲 美国-场景',
                '🇸🇬 新加坡-场景',
                '🇹🇼 台湾-场景',
                '🌐 其他地区-场景',
                '🌐 全部节点',
                '直连'
            ]
        },

        // 全局自动选择
        {
            name: '♻️ 自动选择',
            type: 'url-test',
            url: 'https://www.gstatic.com/generate_204',
            interval: 300,
            tolerance: 50,
            'include-all': true,
            filter: '^((?!(直连|流量|套餐|重置|官网|剩余|月末福利)).)*$'
        },

        // 全部节点
        {
            name: '🌐 全部节点',
            type: 'select',
            'include-all': true,
            filter: '^((?!(直连|流量|套餐|重置|官网|剩余|月末福利)).)*$'
        },

        // 应用分流策略组
        ...generateAppProxyGroups(baseProxies),

        // 地区场景策略组
        ...generateRegionProxyGroups(),

        // 全球直连和漏网之鱼
        {
            name: '🎯 全球直连',
            type: 'select',
            proxies: ['直连']
        },
        {
            name: '🐟 漏网之鱼',
            type: 'select',
            proxies: baseProxies
        }
    ];
}

// 生成应用分流策略组
function generateAppProxyGroups(baseProxies) {
    const apps = [
        '📹 YouTube',
        '🍀 Google',
        '🤖 ChatGPT',
        '👨🏿‍💻 GitHub',
        '🐬 OneDrive',
        '🪟 Microsoft',
        '🎵 TikTok',
        '📲 Telegram',
        '🎥 NETFLIX',
        '✈️ Speedtest',
        '💶 PayPal',
        '🍎 Apple'
    ];

    return apps.map(app => ({
        name: app,
        type: 'select',
        proxies: baseProxies
    }));
}

// 生成地区策略组
function generateRegionProxyGroups() {
    const regions = [
        {
            name: '香港',
            emoji: '🇭🇰',
            filter: '(?=.*(港|HK|(?i)Hong))^((?!(台|日|韩|新|深|美)).)*$',
            manualFilter: '(?i)港|hk|hongkong|hong kong'
        },
        {
            name: '台湾',
            emoji: '🇹🇼',
            filter: '(?i)台|tw|taiwan|formosa|台湾|台灣|tai wan|🇨🇳',
            manualFilter: '(?i)台|tw|taiwan|formosa|台湾|台灣|tai wan|🇨🇳'
        },
        {
            name: '日本',
            emoji: '🇯🇵',
            filter: '(?=.*(日|JP|(?i)Japan|东京))^((?!(港|台|韩|新|美)).)*$',
            manualFilter: '(?i)日|jp|japan'
        },
        {
            name: '新加坡',
            emoji: '🇸🇬',
            filter: '(?i)新|sg|singapore|狮城|lion city',
            manualFilter: '(?i)新|sg|singapore|狮城|lion city'
        },
        {
            name: '美国',
            emoji: '🇺🇲',
            filter: '(?=.*(美|US|(?i)States|America|洛杉矶|旧金山))^((?!(港|台|日|韩|新)).)*$',
            manualFilter: '(?=.*(美|US|(?i)States|America|洛杉矶|旧金山))^((?!(港|台|日|韩|新)).)*$'
        }
    ];

    const groups = [];

    regions.forEach(region => {
        const tolerance = region.name === '台湾' || region.name === '新加坡' ? 30 : 20;

        // 场景选择组
        groups.push({
            name: `${region.emoji} ${region.name}-场景`,
            type: 'select',
            proxies: [
                `${region.emoji} ${region.name}-自动`,
                `${region.emoji} ${region.name}-手动`,
                `${region.emoji} ${region.name}-故障转移`,
                `${region.emoji} ${region.name}-负载均衡`
            ]
        });

        // 自动选择组
        groups.push({
            name: `${region.emoji} ${region.name}-自动`,
            type: 'url-test',
            url: 'https://www.gstatic.com/generate_204',
            interval: 300,
            tolerance: tolerance,
            'include-all': true,
            filter: region.filter
        });

        // 手动选择组
        groups.push({
            name: `${region.emoji} ${region.name}-手动`,
            type: 'select',
            'include-all': true,
            filter: region.manualFilter
        });

        // 故障转移组
        groups.push({
            name: `${region.emoji} ${region.name}-故障转移`,
            type: 'fallback',
            url: 'https://www.gstatic.com/generate_204',
            interval: 300,
            tolerance: 20,
            'include-all': true,
            filter: region.filter
        });

        // 负载均衡组
        groups.push({
            name: `${region.emoji} ${region.name}-负载均衡`,
            type: 'load-balance',
            url: 'https://www.gstatic.com/generate_204',
            interval: 300,
            strategy: 'round-robin',
            'include-all': true,
            filter: region.filter
        });
    });

    // 其他地区
    const otherFilter = '(?i)^(?!.*(港|hk|hongkong|hong kong|台|tw|taiwan|台湾|台灣|formosa|日|jp|japan|新|sg|singapore|狮城|lion city|美|us|united states|america|直连|流量|套餐|重置|官网|剩余|月末福利|洛杉矶|东京|旧金山|Tai Wan|🇨🇳)).*$';

    groups.push(
        {
            name: '🌐 其他地区-场景',
            type: 'select',
            proxies: [
                '🌐 其他地区-自动',
                '🌐 其他地区-手动',
                '🌐 其他地区-故障转移',
                '🌐 其他地区-负载均衡'
            ]
        },
        {
            name: '🌐 其他地区-自动',
            type: 'url-test',
            url: 'https://www.gstatic.com/generate_204',
            interval: 360,
            tolerance: 100,
            'include-all': true,
            filter: otherFilter
        },
        {
            name: '🌐 其他地区-手动',
            type: 'select',
            'include-all': true,
            filter: otherFilter
        },
        {
            name: '🌐 其他地区-故障转移',
            type: 'fallback',
            url: 'https://www.gstatic.com/generate_204',
            interval: 360,
            tolerance: 20,
            'include-all': true,
            filter: otherFilter
        },
        {
            name: '🌐 其他地区-负载均衡',
            type: 'load-balance',
            url: 'https://www.gstatic.com/generate_204',
            interval: 360,
            strategy: 'round-robin',
            'include-all': true,
            filter: otherFilter
        }
    );

    return groups;
}

// 生成规则配置
function generateRules() {
    return [
        'RULE-SET,category-ads-all,REJECT',
        'DOMAIN-SUFFIX,qichiyu.com,🚀 默认代理',
        'RULE-SET,private_domain,🎯 全球直连',
        'GEOIP,LAN,🎯 全球直连,no-resolve',
        'RULE-SET,apple_domain,🍎 Apple',
        'RULE-SET,proxylite,🚀 默认代理',
        'RULE-SET,ai,🤖 ChatGPT',
        'RULE-SET,github_domain,👨🏿‍💻 GitHub',
        'RULE-SET,youtube_domain,📹 YouTube',
        'RULE-SET,google_cn_domain,🍀 Google',
        'RULE-SET,google_domain,🍀 Google',
        'RULE-SET,onedrive_domain,🐬 OneDrive',
        'RULE-SET,microsoft_domain,🪟 Microsoft',
        'RULE-SET,tiktok_domain,🎵 TikTok',
        'RULE-SET,speedtest_domain,✈️ Speedtest',
        'RULE-SET,telegram_domain,📲 Telegram',
        'RULE-SET,netflix_domain,🎥 NETFLIX',
        'RULE-SET,paypal_domain,💶 PayPal',
        'RULE-SET,gfw_domain,🚀 默认代理',
        'RULE-SET,geolocation-!cn,🚀 默认代理',
        'RULE-SET,cn_domain,🎯 全球直连',
        'RULE-SET,google_ip,🍀 Google,no-resolve',
        'RULE-SET,netflix_ip,🎥 NETFLIX,no-resolve',
        'RULE-SET,telegram_ip,📲 Telegram,no-resolve',
        'RULE-SET,cn_ip,🎯 全球直连',
        'MATCH,🐟 漏网之鱼'
    ];
}

// 生成规则提供者配置
function generateRuleProviders() {
    const baseUrl = 'https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo';

    return {
        private_domain: {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: `${baseUrl}/geosite/private.mrs`
        },
        proxylite: {
            type: 'http',
            interval: 86400,
            behavior: 'classical',
            format: 'text',
            url: 'https://raw.githubusercontent.com/qichiyuhub/rule/refs/heads/main/proxy.list'
        },
        ai: {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: 'https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/category-ai-!cn.mrs'
        },
        youtube_domain: {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: `${baseUrl}/geosite/youtube.mrs`
        },
        google_domain: {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: `${baseUrl}/geosite/google.mrs`
        },
        github_domain: {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: `${baseUrl}/geosite/github.mrs`
        },
        telegram_domain: {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: `${baseUrl}/geosite/telegram.mrs`
        },
        netflix_domain: {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: `${baseUrl}/geosite/netflix.mrs`
        },
        paypal_domain: {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: `${baseUrl}/geosite/paypal.mrs`
        },
        onedrive_domain: {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: `${baseUrl}/geosite/onedrive.mrs`
        },
        microsoft_domain: {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: `${baseUrl}/geosite/microsoft.mrs`
        },
        apple_domain: {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: `${baseUrl}/geosite/apple-cn.mrs`
        },
        speedtest_domain: {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: `${baseUrl}/geosite/ookla-speedtest.mrs`
        },
        tiktok_domain: {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: `${baseUrl}/geosite/tiktok.mrs`
        },
        gfw_domain: {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: `${baseUrl}/geosite/gfw.mrs`
        },
        'geolocation-!cn': {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: `${baseUrl}/geosite/geolocation-!cn.mrs`
        },
        cn_domain: {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: `${baseUrl}/geosite/cn.mrs`
        },
        cn_ip: {
            type: 'http',
            interval: 86400,
            behavior: 'ipcidr',
            format: 'mrs',
            url: `${baseUrl}/geoip/cn.mrs`
        },
        google_ip: {
            type: 'http',
            interval: 86400,
            behavior: 'ipcidr',
            format: 'mrs',
            url: `${baseUrl}/geoip/google.mrs`
        },
        telegram_ip: {
            type: 'http',
            interval: 86400,
            behavior: 'ipcidr',
            format: 'mrs',
            url: `${baseUrl}/geoip/telegram.mrs`
        },
        netflix_ip: {
            type: 'http',
            interval: 86400,
            behavior: 'ipcidr',
            format: 'mrs',
            url: `${baseUrl}/geoip/netflix.mrs`
        },
        'category-ads-all': {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: `${baseUrl}/geosite/category-ads-all.mrs`
        },
        google_cn_domain: {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: `${baseUrl}/geosite/google-cn.mrs`
        },
        tencent_services: {
            type: 'http',
            interval: 86400,
            behavior: 'domain',
            format: 'mrs',
            url: `${baseUrl}/geosite/tencent.mrs`
        }
    };
}

// 动态配置修改函数（可根据需要扩展）
function dynamicConfigModifications(config) {
    // 根据时间动态调整某些设置
    const currentHour = new Date().getHours();

    // 夜间模式：降低日志级别
    if (currentHour >= 22 || currentHour <= 6) {
        config['log-level'] = 'error';
    }

    // 工作时间：优化性能
    if (currentHour >= 9 && currentHour <= 18) {
        config['tcp-concurrent'] = true;
        config['unified-delay'] = true;
    }

    return config;
}
