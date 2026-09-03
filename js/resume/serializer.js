function getByPath(object, path) {
  return String(path || "")
    .split(".")
    .filter(Boolean)
    .reduce((value, key) => (value == null ? undefined : value[key]), object);
}

function hasValue(value) {
  if (Array.isArray(value)) return value.some(hasValue);
  if (typeof value === "number") return Number.isFinite(value) && value !== 0;
  if (typeof value === "boolean") return true;
  return value != null && String(value).trim() !== "";
}

function formatValue(value) {
  if (Array.isArray(value)) {
    return value.filter(hasValue).map(formatValue).join("；");
  }
  if (typeof value === "object" && value !== null) {
    return Object.values(value).filter(hasValue).map(formatValue).join(" 至 ");
  }
  return String(value).trim().replace(/\r\n?/g, "\n").replace(/\n/g, "\n  ");
}

function renderFields(source, definitions) {
  return (definitions || []).flatMap((definition) => {
    const value = getByPath(source, definition.path);
    return hasValue(value)
      ? [`- ${definition.label}：${formatValue(value)}`]
      : [];
  });
}

export function resumeToMarkdown(
  resume,
  resumeName,
  moduleConfig,
  fieldDefinitions,
) {
  const title = String(resumeName || "本地简历").trim() || "本地简历";
  const lines = [`# ${title}`];

  for (const module of moduleConfig || []) {
    const definitions = fieldDefinitions?.[module.id] || [];
    if (module.type === "object") {
      const fields = renderFields(resume, definitions);
      if (fields.length) lines.push("", `## ${module.title}`, ...fields);
      continue;
    }

    const entries = Array.isArray(resume?.[module.listKey])
      ? resume[module.listKey]
      : [];
    const renderedEntries = entries
      .map((entry) => renderFields(entry, definitions))
      .filter((fields) => fields.length);
    if (!renderedEntries.length) continue;

    lines.push("", `## ${module.title}`);
    renderedEntries.forEach((fields, index) => {
      lines.push("", `### ${module.itemTitle} ${index + 1}`, ...fields);
    });
  }

  return `${lines.join("\n")}\n`;
}
