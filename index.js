const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15";

const ANTHROPIC_HOSTS = new Set([
  "api.anthropic.com",
  "console.anthropic.com",
  "claude.ai",
]);

let patched = false;

function getUserAgent() {
  return process.env.OPENCODE_ANTHROPIC_USER_AGENT || DEFAULT_USER_AGENT;
}

function resolveUrl(input) {
  try {
    if (typeof input === "string" || input instanceof URL) {
      return new URL(input.toString());
    }
    if (input instanceof Request) {
      return new URL(input.url);
    }
  } catch {}
  return null;
}

function buildHeaders(input, init) {
  const headers = new Headers();

  if (input instanceof Request) {
    input.headers.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  if (init?.headers instanceof Headers) {
    init.headers.forEach((value, key) => {
      headers.set(key, value);
    });
  } else if (Array.isArray(init?.headers)) {
    for (const [key, value] of init.headers) {
      if (typeof value !== "undefined") headers.set(key, String(value));
    }
  } else if (init?.headers) {
    for (const [key, value] of Object.entries(init.headers)) {
      if (typeof value !== "undefined") headers.set(key, String(value));
    }
  }

  return headers;
}

function patchFetch() {
  if (patched) return;
  patched = true;

  const originalFetch = globalThis.fetch.bind(globalThis);

  globalThis.fetch = async function patchedFetch(input, init) {
    const url = resolveUrl(input);
    if (!url || !ANTHROPIC_HOSTS.has(url.hostname)) {
      return originalFetch(input, init);
    }

    const headers = buildHeaders(input, init);
    headers.set("user-agent", getUserAgent());

    return originalFetch(input, {
      ...(init ?? {}),
      headers,
    });
  };
}

/**
 * Portable OpenCode plugin that injects a configurable User-Agent into fetch
 * requests targeting Anthropic endpoints.
 *
 * Configuration:
 *   OPENCODE_ANTHROPIC_USER_AGENT='your user agent'
 */
export const AnthropicUserAgentPlugin = async () => {
  patchFetch();
  return {};
};

export default AnthropicUserAgentPlugin;
