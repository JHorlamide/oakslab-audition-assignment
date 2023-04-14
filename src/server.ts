import http from "http";
import { app, routes, port } from "./config/app";
import { CommonRoutesConfig } from "./common/commonRouteConfig";
import { onError } from "./config/requestLogger";

function createServer(): http.Server {
  app.set("port", port);

  const server = http.createServer(app);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
    console.log(`Server listening on ${bind}... 🚀`);

    if (process.env.NODE_ENV !== "test") {
      routes.forEach((route: CommonRoutesConfig) => {
        console.log(`Routes configured for -> ${route.getName()}`);
      });
    }
  });

  return server;
}

export default function main(): http.Server {
  const server = createServer();
  return server;
}

if (process.env.NODE_ENV !== "test") {
  main();
}
