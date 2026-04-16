import json
import re
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from pathlib import Path

import requests
from bs4 import BeautifulSoup

OUTPUT = Path("public/updates.json")


def clean_text(text):
    if not text:
        return ""
    return re.sub(r"\s+", " ", text).strip()


def parse_date(text):
    if not text:
        return datetime.now(timezone.utc).strftime("%Y-%m-%d")

    text = clean_text(text)

    # 尝试多种常见日期格式
    patterns = [
        "%Y-%m-%d",
        "%Y/%m/%d",
        "%b %d, %Y",
        "%B %d, %Y",
        "%a, %d %b %Y %H:%M:%S %Z",
        "%Y-%m-%dT%H:%M:%S.%fZ",
        "%Y-%m-%dT%H:%M:%SZ",
    ]

    for p in patterns:
        try:
            return datetime.strptime(text, p).strftime("%Y-%m-%d")
        except Exception:
            pass

    # 尝试截取 YYYY-MM-DD
    m = re.search(r"\d{4}-\d{2}-\d{2}", text)
    if m:
        return m.group(0)

    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def split_tags(text):
    if not text:
        return []
    if isinstance(text, list):
        return [clean_text(x) for x in text if clean_text(x)]

    parts = re.split(r"[、,，;；|/]+", str(text))
    return [clean_text(p) for p in parts if clean_text(p)]


def make_record(
    title="",
    publisher="",
    date="",
    region="海外",
    type_="产品发布",
    source="",
    source_type="官方",
    summary="",
    tracking_value="",
    url="",
    tags=None,
):
    return {
        "标题": clean_text(title),
        "发布方": clean_text(publisher),
        "日期": parse_date(date),
        "地区": region,
        "类型": type_,
        "来源": source,
        "来源类型": source_type,
        "一句话摘要": clean_text(summary),
        "标签": split_tags(tags or []),
        "追踪价值总结": clean_text(tracking_value),
        "链接": url,
    }


def fetch_openai():
    url = "https://openai.com/news/"
    headers = {"User-Agent": "Mozilla/5.0"}
    records = []

    try:
        r = requests.get(url, headers=headers, timeout=20)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")

        # 尝试抓取新闻卡片链接
        links = soup.find_all("a", href=True)

        seen = set()
        for a in links:
            href = a.get("href", "")
            text = clean_text(a.get_text(" ", strip=True))

            if not href:
                continue
            if not href.startswith("/news/") and "openai.com/news/" not in href:
                continue
            if href in ["/news/", "https://openai.com/news/"]:
                continue

            full_url = href if href.startswith("http") else f"https://openai.com{href}"
            if full_url in seen:
                continue
            seen.add(full_url)

            title = text
            if not title or len(title) < 8:
                continue

            summary = "OpenAI 发布新的产品、功能或公司动态。"
            tracking_value = "可用于持续追踪头部 AI 公司在产品发布、功能更新与商业推进上的最新变化。"

            tags = ["OpenAI", "产品动态"]

            lower_title = title.lower()
            if "gpt" in lower_title or "model" in lower_title:
                tags.append("模型升级")
            if "api" in lower_title or "developer" in lower_title:
                tags.append("开发者工具")

            records.append(
                make_record(
                    title=title,
                    publisher="OpenAI",
                    date="",
                    region="海外",
                    type_="产品发布",
                    source="OpenAI News",
                    source_type="官方",
                    summary=summary,
                    tracking_value=tracking_value,
                    url=full_url,
                    tags=tags,
                )
            )

        return records[:12]
    except Exception as e:
        print("OpenAI fetch failed:", e)
        return []


def fetch_anthropic():
    url = "https://www.anthropic.com/news"
    headers = {"User-Agent": "Mozilla/5.0"}
    records = []

    try:
        r = requests.get(url, headers=headers, timeout=20)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")

        links = soup.find_all("a", href=True)
        seen = set()

        for a in links:
            href = a.get("href", "")
            title = clean_text(a.get_text(" ", strip=True))

            if not href:
                continue
            if not href.startswith("/news/") and "anthropic.com/news/" not in href:
                continue
            if href in ["/news", "/news/", "https://www.anthropic.com/news"]:
                continue

            full_url = href if href.startswith("http") else f"https://www.anthropic.com{href}"
            if full_url in seen:
                continue
            seen.add(full_url)

            if not title or len(title) < 8:
                continue

            summary = "Anthropic 发布 Claude 相关产品、合作或基础设施动态。"
            tracking_value = "适合追踪 Claude 体系在产品能力、企业合作与算力布局上的最新方向。"

            tags = ["Anthropic", "Claude"]
            lower_title = title.lower()
            if "google" in lower_title or "partnership" in lower_title:
                tags.append("合作")
            if "compute" in lower_title or "infrastructure" in lower_title:
                tags.append("基础设施")

            records.append(
                make_record(
                    title=title,
                    publisher="Anthropic",
                    date="",
                    region="海外",
                    type_="企业方案",
                    source="Anthropic Newsroom",
                    source_type="官方",
                    summary=summary,
                    tracking_value=tracking_value,
                    url=full_url,
                    tags=tags,
                )
            )

        return records[:12]
    except Exception as e:
        print("Anthropic fetch failed:", e)
        return []


def fetch_google_blog():
    rss_url = "https://blog.google/rss/"
    headers = {"User-Agent": "Mozilla/5.0"}
    records = []

    try:
        r = requests.get(rss_url, headers=headers, timeout=20)
        r.raise_for_status()

        root = ET.fromstring(r.text)
        items = root.findall(".//item")

        for item in items[:20]:
            title = clean_text(item.findtext("title", default=""))
            link = clean_text(item.findtext("link", default=""))
            pub_date = clean_text(item.findtext("pubDate", default=""))
            description = clean_text(item.findtext("description", default=""))

            # 只保留与 AI 比较相关的条目
            text_blob = f"{title} {description}".lower()
            keywords = ["ai", "gemini", "model", "deepmind", "agent", "workspace"]
            if not any(k in text_blob for k in keywords):
                continue

            summary = "Google 发布与 AI、Gemini 或相关产品能力有关的官方动态。"
            tracking_value = "适合持续观察 Google 在 AI 产品整合、平台能力与生态推进上的方向变化。"

            tags = ["Google", "AI"]
            if "gemini" in text_blob:
                tags.append("Gemini")
            if "workspace" in text_blob:
                tags.append("办公场景")

            records.append(
                make_record(
                    title=title,
                    publisher="Google",
                    date=pub_date,
                    region="海外",
                    type_="功能更新",
                    source="Google Blog",
                    source_type="官方",
                    summary=summary,
                    tracking_value=tracking_value,
                    url=link,
                    tags=tags,
                )
            )

        return records[:12]
    except Exception as e:
        print("Google Blog fetch failed:", e)
        return []


def deduplicate(records):
    seen = set()
    result = []

    for r in records:
        key = (r.get("标题", ""), r.get("链接", ""))
        if key in seen:
            continue
        seen.add(key)
        result.append(r)

    return result


def enrich_type(record):
    title = (record.get("标题") or "").lower()
    summary = (record.get("一句话摘要") or "").lower()
    text = f"{title} {summary}"

    if any(k in text for k in ["agent", "agents"]):
        record["类型"] = "Agent"
    elif any(k in text for k in ["api", "developer", "sdk"]):
        record["类型"] = "开发者工具"
    elif any(k in text for k in ["model", "gpt", "claude", "gemini"]):
        record["类型"] = "模型升级"
    elif any(k in text for k in ["partnership", "enterprise", "business", "compute", "infrastructure"]):
        record["类型"] = "企业方案"
    return record


def main():
    records = []
    records.extend(fetch_openai())
    records.extend(fetch_anthropic())
    records.extend(fetch_google_blog())

    records = [enrich_type(r) for r in records]
    records = deduplicate(records)

    # 按日期倒序
    def sort_key(x):
        try:
            return datetime.strptime(x["日期"], "%Y-%m-%d")
        except Exception:
            return datetime(1970, 1, 1)

    records.sort(key=sort_key, reverse=True)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with OUTPUT.open("w", encoding="utf-8") as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(records)} records to {OUTPUT}")


if __name__ == "__main__":
    main()
