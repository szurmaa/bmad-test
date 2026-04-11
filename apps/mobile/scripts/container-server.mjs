import http from "node:http";
import { spawn } from "node:child_process";

const GATEWAY_PORT = Number(process.env.PORT ?? 8080);
const EXPO_PORT = Number(process.env.EXPO_PORT ?? 8081);
const EXPO_HOST = "127.0.0.1";

const expo = spawn("npx", ["expo", "start", "--web", "--port", String(EXPO_PORT), "--host", "localhost"], {
  stdio: "inherit",
  env: {
    ...process.env,
    CI: "1",
  },
});

const server = http.createServer(async (req, res) => {
  if (req.url === "/healthz") {
    const healthy = !expo.killed && expo.exitCode === null;
    res.writeHead(healthy ? 200 : 503, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: healthy ? "ok" : "down" }));
    return;
  }

  if (req.url === "/readyz") {
    const ready = !expo.killed && expo.exitCode === null;
    res.writeHead(ready ? 200 : 503, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: ready ? "ready" : "not_ready" }));
    return;
  }

  const proxyReq = http.request(
    {
      host: EXPO_HOST,
      port: EXPO_PORT,
      path: req.url,
      method: req.method,
      headers: req.headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode ?? 502, proxyRes.headers);
      proxyRes.pipe(res);
    },
  );

  proxyReq.on("error", () => {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "upstream_unavailable" }));
  });

  req.pipe(proxyReq);
});

server.listen(GATEWAY_PORT, () => {
  console.log(`mobile container gateway listening on ${GATEWAY_PORT}`);
});

function shutdown(signal) {
  console.log(`received ${signal}, shutting down`);
  expo.kill(signal);
  server.close(() => process.exit(0));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
