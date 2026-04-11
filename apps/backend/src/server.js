import http from "node:http";

const PORT = Number(process.env.PORT ?? 3000);

function jsonResponse(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

export function createServer() {
  return http.createServer((req, res) => {
    if (req.url === "/healthz") {
      return jsonResponse(res, 200, { status: "ok" });
    }

    if (req.url === "/readyz") {
      return jsonResponse(res, 200, { status: "ready" });
    }

    if (req.url === "/") {
      return jsonResponse(res, 200, { service: "habit-dice-backend" });
    }

    return jsonResponse(res, 404, { error: "not_found" });
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = createServer();
  server.listen(PORT, () => {
    // Keep startup logs concise for container logs and local runs.
    console.log(`backend listening on ${PORT}`);
  });
}
