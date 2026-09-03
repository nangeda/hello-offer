export function maskSensitiveInfo(rawText) {
  if (typeof rawText !== "string") return { maskedText: "", piiMap: {} };

  const piiMap = {};
  let counter = 1;
  let text = rawText;

  const replace = (kind) => (value) => {
    const placeholder = `{{MASK_${kind}_${counter++}}}`;
    piiMap[placeholder] = value;
    return placeholder;
  };

  text = text.replace(
    /\b[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]\b/g,
    replace("ID"),
  );
  text = text.replace(/\b1[3-9]\d{9}\b/g, replace("PHONE"));
  text = text.replace(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
    replace("EMAIL"),
  );

  return { maskedText: text, piiMap };
}

export function restoreSensitiveInfo(target, piiMap) {
  if (!target || typeof target !== "object" || !piiMap) return target;
  let serialized = JSON.stringify(target);
  for (const [placeholder, original] of Object.entries(piiMap)) {
    serialized = serialized.replaceAll(placeholder, original);
  }
  try {
    return JSON.parse(serialized);
  } catch (_) {
    return target;
  }
}
