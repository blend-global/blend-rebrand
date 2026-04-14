const ALLOWED_PROTOCOLS = ["http://", "https://", "mailto:", "tel:", "/", "#"];

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const isSafeHref = (href: string) => {
  const normalized = href.trim().toLowerCase();
  return ALLOWED_PROTOCOLS.some((protocol) => normalized.startsWith(protocol));
};

const sanitizeTag = (rawTag: string) => {
  const match = rawTag.match(/^<\s*(\/?)\s*([a-z0-9]+)([\s\S]*?)>$/i);

  if (!match) {
    return "";
  }

  const [, closingSlash, rawName, rawAttributes] = match;
  const isClosing = closingSlash === "/";
  const tagName = rawName.toLowerCase();

  if (tagName === "b" || tagName === "strong") {
    return isClosing ? "</strong>" : "<strong>";
  }

  if (tagName === "i" || tagName === "em") {
    return isClosing ? "</em>" : "<em>";
  }

  if (tagName === "div" || tagName === "p") {
    return isClosing ? "</p>" : "<p>";
  }

  if (tagName === "br") {
    return "<br />";
  }

  if (tagName === "u") {
    return isClosing ? "</u>" : "<u>";
  }

  if (tagName === "h1" || tagName === "h2") {
    return isClosing ? "</h2>" : "<h2>";
  }

  if (tagName === "h3") {
    return isClosing ? "</h3>" : "<h3>";
  }

  if (tagName === "ul") {
    return isClosing ? "</ul>" : "<ul>";
  }

  if (tagName === "ol") {
    return isClosing ? "</ol>" : "<ol>";
  }

  if (tagName === "li") {
    return isClosing ? "</li>" : "<li>";
  }

  if (tagName === "blockquote") {
    return isClosing ? "</blockquote>" : "<blockquote>";
  }

  if (tagName === "a") {
    if (isClosing) {
      return "</a>";
    }

    const hrefMatch = rawAttributes.match(/href\s*=\s*(['"])(.*?)\1/i);
    const href = hrefMatch?.[2]?.trim() ?? "";

    if (!href || !isSafeHref(href)) {
      return "";
    }

    return `<a href="${escapeHtml(href)}" target="_blank" rel="noreferrer">`;
  }

  return "";
};

const stripDangerousMarkup = (value: string) =>
  value
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?>[\s\S]*?<\/\1>/gi, "")
    .replace(/<\?(?:[\s\S]*?)\?>/g, "");

const convertPlainTextToHtml = (value: string) => {
  const normalized = value.replace(/\r\n?/g, "\n").trim();

  if (!normalized) {
    return "";
  }

  return normalized
    .split(/\n\s*\n/)
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br />")}</p>`)
    .join("");
};

export const normalizeRichTextHtml = (value: string) => {
  const normalized = value.replace(/\r\n?/g, "\n").trim();

  if (!normalized) {
    return "";
  }

  if (!/<[a-z][\s\S]*>/i.test(normalized)) {
    return convertPlainTextToHtml(normalized);
  }

  const sanitized = stripDangerousMarkup(normalized)
    .replace(/&nbsp;/gi, " ")
    .replace(/<[^>]+>/g, sanitizeTag)
    .replace(/\n{3,}/g, "\n\n")
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/(<br\s*\/?>\s*){3,}/gi, "<br /><br />")
    .trim();

  return sanitized || convertPlainTextToHtml(normalized);
};
