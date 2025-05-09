import os

def generate_direct_rules(input_file, output_file):
    """
    读取输入文件中的每一行，并将其生成为 Clash 的直连规则，
    然后将这些规则写入到输出文件中。

    Args:
        input_file (str): 包含需要直连的域名或 IP 地址的输入文件路径。
        output_file (str): 用于存储生成的 Clash 直连规则的输出文件路径。
    """
    direct_rules = []
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line:
                    # 判断是否为 IP 地址 (简单的判断，更精确的判断需要使用 ipaddress 模块)
                    if all(part.isdigit() or part == "." for part in line.split(".")):
                        direct_rules.append(f"- IP-CIDR, {line}, DIRECT")
                    else:
                        direct_rules.append(f"- DOMAIN, {line}, DIRECT")
    except FileNotFoundError:
        print(f"错误: 输入文件 '{input_file}' 未找到。")
        return

    if direct_rules:
        with open(output_file, 'w', encoding='utf-8') as outfile:
            outfile.write("# Generated direct rules from {}\n".format(input_file))
            for rule in direct_rules:
                outfile.write(rule + "\n")
        print(f"成功生成直连规则到 '{output_file}' 文件。")
    else:
        print(f"输入文件 '{input_file}' 为空或不包含有效条目。")

if __name__ == "__main__":
    input_filename = "Direct.txt"  # 输入文件名，与您的 GitHub 仓库中的文件名一致
    output_filename = "direct_rules.yaml"  # 输出文件名，Clash 规则片段文件名
    generate_direct_rules(input_filename, output_filename)
