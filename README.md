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

Install the package:

```sh
npm install opencode-anthropic-user-agent-plugin
```

Then add it to your OpenCode config:

```json
{
  "plugin": ["opencode-anthropic-user-agent-plugin"]
}
```

Restart OpenCode.

## Default behavior

By default, the plugin uses this Safari/macOS user-agent automatically:

```text
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15
```

No environment variable is required.

## Optional override

If you want a different value, override it with an environment variable:

```sh
export OPENCODE_ANTHROPIC_USER_AGENT='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15'
```

Then restart OpenCode.

## Notes

- The plugin targets `api.anthropic.com`, `console.anthropic.com`, and `claude.ai`.
- It intentionally avoids patching unrelated hosts.
- Because it patches `fetch`, it should be compatible with OpenCode's built-in
  Anthropic auth plugin instead of replacing it.

## Development / publishing

This repo includes a GitHub Actions workflow that publishes to npm on tags like:

```sh
git tag v0.1.0
git push origin v0.1.0
```

To enable publishing, add this repository secret:

- `NPM_TOKEN`: an npm automation token with publish access for this package
