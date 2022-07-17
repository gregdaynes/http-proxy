HTTP Proxy with CLI Configuration

# What

Provides a single file executable with command line flags and
environment variable support for configuration.

# Why

Rapid prototyping and development of a services architecture without
having to switch to other languages/environments/configuration dsls to
handle routing and proxying.

__What about Nginx, HAProxy?__

You should use those instead.

# How

1. Install dependencies with `npm install`
2. Run development build `npm run build`
3. Run build locally `node build/build.js`
4. Package into executables `npm run dist`

---

| Flag         | Description                                 | Default     |
| ------------ | ------------------------------------------- | ----------- |
| `-p, --port` | Port number to listen on.                   | `3000`      |
| `-h, --host` | Host address to listen on.                  | `127.0.0.1` |
| `-c, --cert` | Certififate to enable TLS                   |             |
| `-k, --key`  | Key to enable TLS                           |             |
| `--proxy`    | Configure proxying route, supports rewrite. |             |

> Note: TLS requires both cert and key to be specifed

_Proxy Examples_

- `--proxy /api:http://example.com` will proxy requests to `http://example.com/api`
- `--proxy /api,/:http://example.com` will proxy requests to `http://example.com/`
