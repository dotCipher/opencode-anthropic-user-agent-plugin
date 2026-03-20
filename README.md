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

This project is not published to npm yet.

Right now, the supported way to use it is as a local plugin.

### Local plugin setup

1. Clone this repo somewhere on your machine.
2. Create the OpenCode global plugins directory if it does not already exist:

```sh
mkdir -p ~/.config/opencode/plugins
```

3. Add a wrapper plugin file like this:

```js
process.env.OPENCODE_ANTHROPIC_USER_AGENT =
  process.env.OPENCODE_ANTHROPIC_USER_AGENT ||
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15";

export { AnthropicUserAgentPlugin as default } from "/absolute/path/to/opencode-anthropic-user-agent-plugin/index.js";
```

4. Save that wrapper as:

```text
~/.config/opencode/plugins/anthropic-user-agent-plugin.js
```

5. Restart OpenCode.

OpenCode will automatically load plugins from:

- `~/.config/opencode/plugins/`
- or `.opencode/plugins/`

## Default behavior

By default, the plugin uses this Safari/macOS user-agent automatically:

```text
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15
```

No environment variable is required.

## Override

If you want a different value, override it with an environment variable:

```sh
export OPENCODE_ANTHROPIC_USER_AGENT='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15'
```

## Notes

- The plugin targets `api.anthropic.com`, `console.anthropic.com`, and `claude.ai`.
- It intentionally avoids patching unrelated hosts.
- Because it patches `fetch`, it should be compatible with OpenCode's built-in
  Anthropic auth plugin instead of replacing it.
- This repo currently ships the plugin source only; it does not publish an npm package yet.
