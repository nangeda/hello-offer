import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function collectTextFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (["lib", "image", "webfonts"].includes(entry.name)) return [];
      return collectTextFiles(target);
    }
    return /\.(?:css|html|js|json|md)$/.test(entry.name) ? [target] : [];
  });
}

test("运行代码与公开文档不包含旧品牌标识", () => {
  const forbidden = [
    String.fromCodePoint(0x6c42, 0x804c, 0x65b9, 0x821f),
    "Muc" + "Offer",
    ["muc", "offer.local"].join(""),
    "ark" + "Content",
    "resume" + "Interface",
    "ark" + "-ai",
    "ark" + "-color-",
    "arc" + "ButtonMode",
  ];
  const files = collectTextFiles(root).filter((file) => !file.endsWith("branding.test.js"));
  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    for (const marker of forbidden) {
      assert.equal(source.includes(marker), false, `${path.relative(root, file)}: ${marker}`);
    }
  }
});

test("Manifest 引用的本地文件均存在", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
  const references = [
    manifest.action?.default_popup,
    manifest.background?.service_worker,
    ...manifest.content_scripts.flatMap((entry) => [...(entry.js || []), ...(entry.css || [])]),
    ...manifest.web_accessible_resources.flatMap((entry) => entry.resources || []),
  ].filter((item) => item && !item.includes("*"));

  for (const reference of references) {
    assert.equal(fs.existsSync(path.join(root, reference)), true, reference);
  }
});
