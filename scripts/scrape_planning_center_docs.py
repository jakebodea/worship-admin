#!/usr/bin/env python3
"""Scrape Planning Center API docs into markdown files."""

from __future__ import annotations

import json
import re
import sys
import time
import urllib.error
import urllib.request
import argparse
import shutil
from datetime import datetime
from pathlib import Path
from typing import Any


BASE_URL = "https://api.planningcenteronline.com"
APPS = [
    "api",
    "calendar",
    "check-ins",
    "current",
    "giving",
    "groups",
    "people",
    "publishing",
    "registrations",
    "services",
    "webhooks",
]
OUT_ROOT = Path("docs/planning-center-api")


def version_sort_key(version_id: str) -> tuple[int, datetime | str]:
    try:
        return (1, datetime.strptime(version_id, "%Y-%m-%d"))
    except ValueError:
        return (0, version_id)


def pick_versions(versions: list[dict[str, Any]], latest_only: bool) -> list[dict[str, Any]]:
    if not latest_only:
        return versions
    if not versions:
        return []
    return [max(versions, key=lambda v: version_sort_key(str(v.get("id", ""))))]


def fetch_json(url: str, retries: int = 3, backoff: float = 0.8) -> dict[str, Any]:
    last_exc: Exception | None = None
    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(url, timeout=45) as resp:
                return json.load(resp)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
            last_exc = exc
            if attempt < retries:
                time.sleep(backoff * attempt)
    assert last_exc is not None
    raise last_exc


def slug(value: str) -> str:
    value = value.strip().lower()
    value = re.sub(r"[^a-z0-9._-]+", "-", value)
    value = re.sub(r"-{2,}", "-", value)
    return value.strip("-") or "item"


def h2(text: str) -> str:
    return f"\n## {text}\n"


def render_simple_table(headers: list[str], rows: list[list[str]]) -> str:
    if not rows:
        return ""
    out = ["| " + " | ".join(headers) + " |", "| " + " | ".join(["---"] * len(headers)) + " |"]
    for row in rows:
        escaped = [cell.replace("\n", " ").replace("|", "\\|") for cell in row]
        out.append("| " + " | ".join(escaped) + " |")
    return "\n".join(out) + "\n"


def render_graph_markdown(app: str, graph: dict[str, Any]) -> str:
    data = graph.get("data", {})
    attrs = data.get("attributes", {})
    rels = data.get("relationships", {})
    versions = rels.get("versions", {}).get("data", []) or []

    title = attrs.get("title") or app.title()
    description = attrs.get("description") or ""
    lines = [f"# {title}", ""]
    if description:
        lines.append(description)
        lines.append("")

    lines.append(h2("App"))
    lines.append(f"- App slug: `{app}`")
    lines.append(f"- Base docs endpoint: `{BASE_URL}/{app}/v2/documentation`")
    lines.append("")

    if versions:
        rows: list[list[str]] = []
        for v in versions:
            v_id = str(v.get("id", ""))
            v_attrs = v.get("attributes", {}) or {}
            rows.append(
                [
                    v_id,
                    "yes" if v_attrs.get("beta") else "no",
                    str(v_attrs.get("details") or "").strip() or "-",
                ]
            )
        lines.append(h2("Versions"))
        lines.append(render_simple_table(["Version", "Beta", "Details"], rows))

    return "\n".join(lines).strip() + "\n"


def render_version_markdown(app: str, version: str, payload: dict[str, Any]) -> str:
    data = payload.get("data", {})
    attrs = data.get("attributes", {})
    rels = data.get("relationships", {})

    vertices = rels.get("vertices", {}).get("data", []) or []
    edges = rels.get("edges", {}).get("data", []) or []
    entry = rels.get("entry", {}).get("data", {}) or {}

    lines = [f"# {app} {version}", ""]
    lines.append(f"- Endpoint: `{BASE_URL}/{app}/v2/documentation/{version}`")
    lines.append(f"- Beta: `{'yes' if attrs.get('beta') else 'no'}`")
    details = str(attrs.get("details") or "").strip()
    if details:
        lines.append(f"- Details: {details}")
    if entry.get("id"):
        lines.append(f"- Entry vertex: `{entry.get('id')}`")
    lines.append("")

    lines.append(h2("Counts"))
    lines.append(f"- Vertices: `{len(vertices)}`")
    lines.append(f"- Edges: `{len(edges)}`")
    lines.append("")

    if vertices:
        lines.append(h2("Vertices"))
        rows = []
        for item in vertices:
            a = item.get("attributes", {}) or {}
            rows.append(
                [
                    str(item.get("id", "")),
                    str(a.get("name") or ""),
                    "yes" if a.get("deprecated") else "no",
                ]
            )
        lines.append(render_simple_table(["ID", "Name", "Deprecated"], rows))

    return "\n".join(lines).strip() + "\n"


def to_json_str(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, str):
        raw = value.strip()
        if not raw:
            return ""
        try:
            parsed = json.loads(raw)
            return json.dumps(parsed, indent=2, sort_keys=True)
        except json.JSONDecodeError:
            return raw
    return json.dumps(value, indent=2, sort_keys=True)


def format_type_annotation(value: Any) -> str:
    if isinstance(value, dict):
        name = value.get("name")
        example = value.get("example")
        if name and example is not None:
            return f"{name} (e.g. {example})"
        if name:
            return str(name)
        return json.dumps(value, sort_keys=True)
    if value is None:
        return ""
    return str(value)


def render_curated_examples(actions: list[dict[str, Any]], max_examples: int = 2) -> list[str]:
    examples: list[tuple[str, str, str]] = []
    for action in actions:
        attrs = action.get("attributes", {}) or {}
        example_text = to_json_str(attrs.get("example_body"))
        if not example_text:
            continue
        title = str(attrs.get("name") or "action")
        path = str(attrs.get("path") or "")
        examples.append((title, path, example_text))
        if len(examples) >= max_examples:
            break

    if not examples:
        return []

    lines: list[str] = [h2("Examples")]
    for idx, (title, path, example_text) in enumerate(examples, start=1):
        lines.append(f"### Example {idx}: {title}")
        if path:
            lines.append(f"- Path: `{path}`")
        lines.append("```json")
        lines.append(example_text)
        lines.append("```")
        lines.append("")
    return lines


def render_vertex_markdown(app: str, version: str, vertex_id: str, payload: dict[str, Any]) -> str:
    data = payload.get("data", {})
    attrs = data.get("attributes", {}) or {}
    rels = data.get("relationships", {}) or {}

    name = attrs.get("name") or vertex_id
    lines = [f"# {name}", ""]
    lines.append(f"- App: `{app}`")
    lines.append(f"- Version: `{version}`")
    lines.append(f"- Vertex ID: `{vertex_id}`")
    lines.append(f"- Endpoint: `{BASE_URL}/{app}/v2/documentation/{version}/vertices/{vertex_id}`")
    path = attrs.get("path")
    if path:
        lines.append(f"- Resource path: `{path}`")
    if attrs.get("collection_only") is not None:
        lines.append(f"- Collection only: `{'yes' if attrs.get('collection_only') else 'no'}`")
    if attrs.get("deprecated") is not None:
        lines.append(f"- Deprecated: `{'yes' if attrs.get('deprecated') else 'no'}`")
    lines.append("")

    description = str(attrs.get("description") or "").strip()
    if description:
        lines.append(h2("Description"))
        lines.append(description + "\n")

    actions = rels.get("actions", {}).get("data", []) or []
    if actions:
        lines.append(h2("Actions"))
        rows: list[list[str]] = []
        for a in actions:
            aa = a.get("attributes", {}) or {}
            rows.append(
                [
                    str(aa.get("name") or ""),
                    str(aa.get("path") or ""),
                    str(aa.get("description") or "").strip() or "-",
                    str(aa.get("return_type") or "").strip() or "-",
                    "yes" if aa.get("deprecated") else "no",
                ]
            )
        lines.append(render_simple_table(["Name", "Path", "Description", "Return Type", "Deprecated"], rows))

    attributes = rels.get("attributes", {}).get("data", []) or []
    if attributes:
        lines.append(h2("Attributes"))
        rows = []
        for a in attributes:
            aa = a.get("attributes", {}) or {}
            rows.append(
                [
                    str(aa.get("name") or ""),
                    format_type_annotation(aa.get("type_annotation")),
                    str(aa.get("description") or "").strip() or "-",
                    str(aa.get("permission_level") or "").strip() or "-",
                ]
            )
        lines.append(render_simple_table(["Name", "Type", "Description", "Permission"], rows))

    for section_name, rel_key in [
        ("Relationships", "relationships"),
        ("Outbound Edges", "outbound_edges"),
        ("Inbound Edges", "inbound_edges"),
        ("Can Include", "can_include"),
        ("Can Order", "can_order"),
        ("Can Query", "can_query"),
    ]:
        items = rels.get(rel_key, {}).get("data", []) or []
        if not items:
            continue
        lines.append(h2(section_name))
        rows = []
        for item in items:
            a = item.get("attributes", {}) or {}
            rows.append(
                [
                    str(item.get("id") or ""),
                    str(
                        a.get("name")
                        or a.get("path")
                        or a.get("description")
                        or item.get("id")
                        or ""
                    ),
                    str(a.get("description") or a.get("details") or "").strip() or "-",
                ]
            )
        lines.append(render_simple_table(["ID", "Name/Path", "Details"], rows))

    lines.extend(render_curated_examples(actions, max_examples=2))
    return "\n".join(lines).strip() + "\n"


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Scrape Planning Center API docs into markdown files.")
    parser.add_argument(
        "--latest-only",
        action="store_true",
        help="Only export the latest version for each app.",
    )
    parser.add_argument(
        "--clean",
        action="store_true",
        help="Delete the output directory before writing new files.",
    )
    parser.add_argument(
        "--out-root",
        default=str(OUT_ROOT),
        help=f"Output directory (default: {OUT_ROOT}).",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    out_root = Path(args.out_root)
    if args.clean and out_root.exists():
        shutil.rmtree(out_root)
    out_root.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, Any] = {"generated_at_epoch": int(time.time()), "apps": {}}
    total_vertices = 0

    for app in APPS:
        print(f"[app] {app}")
        app_url = f"{BASE_URL}/{app}/v2/documentation"
        graph = fetch_json(app_url)
        write_text(out_root / app / "index.md", render_graph_markdown(app, graph))

        all_versions = (
            graph.get("data", {})
            .get("relationships", {})
            .get("versions", {})
            .get("data", [])
            or []
        )
        versions = pick_versions(all_versions, latest_only=args.latest_only)
        manifest["apps"][app] = {"versions": {}}

        for v in versions:
            version = str(v.get("id", ""))
            if not version:
                continue
            print(f"  [version] {version}")
            v_url = f"{BASE_URL}/{app}/v2/documentation/{version}"
            version_payload = fetch_json(v_url)
            write_text(out_root / app / version / "index.md", render_version_markdown(app, version, version_payload))

            vertices = (
                version_payload.get("data", {})
                .get("relationships", {})
                .get("vertices", {})
                .get("data", [])
                or []
            )
            vertex_ids: list[str] = [str(x.get("id", "")) for x in vertices if x.get("id")]
            manifest["apps"][app]["versions"][version] = {"vertex_count": len(vertex_ids)}
            total_vertices += len(vertex_ids)

            for vertex_id in vertex_ids:
                vertex_url = f"{BASE_URL}/{app}/v2/documentation/{version}/vertices/{vertex_id}"
                try:
                    vertex_payload = fetch_json(vertex_url)
                except Exception as exc:
                    print(f"    [warn] failed vertex {vertex_id}: {exc}", file=sys.stderr)
                    continue
                out_path = out_root / app / version / "vertices" / f"{slug(vertex_id)}.md"
                write_text(out_path, render_vertex_markdown(app, version, vertex_id, vertex_payload))

    write_text(
        out_root / "README.md",
        "# Planning Center API Docs Export\n\n"
        f"- Generated by `scripts/scrape_planning_center_docs.py`\n"
        f"- Mode: `{'latest-only' if args.latest_only else 'all-versions'}`\n"
        f"- Apps: `{len(APPS)}`\n"
        f"- Total vertices exported: `{total_vertices}`\n",
    )
    write_text(out_root / "manifest.json", json.dumps(manifest, indent=2, sort_keys=True) + "\n")
    print(f"\nDone. Markdown docs written to: {out_root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
