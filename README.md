# opencode-anthropic-user-agent-plugin

Portable OpenCode plugin that injects a configurable Anthropic `User-Agent` for:

- Claude Pro/Max OAuth login
- OAuth token refresh
- Anthropic prompt/message requests
- Anthropic API key creation

The plugin works by patching `fetch` inside the OpenCode process for requests
to Anthropic hosts, so it can affect both auth traffic and normal model I/O
without patching OpenCode's cached plugin files by hand.

## Install

### From npm

Add the package to your OpenCode config:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-anthropic-user-agent-plugin"]
}
```

### As a local plugin

If you are developing locally, symlink or copy `index.js` into:

- `~/.config/opencode/plugins/`
- or `.opencode/plugins/`

## Configure

Set the outgoing user-agent string with an environment variable:

```sh
export OPENCODE_ANTHROPIC_USER_AGENT='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15'
```

If unset, the plugin uses the Safari string above by default.

## Notes

- The plugin targets `api.anthropic.com`, `console.anthropic.com`, and `claude.ai`.
- It intentionally avoids patching unrelated hosts.
- Because it patches `fetch`, it should be compatible with OpenCode's built-in
  Anthropic auth plugin instead of replacing it.
