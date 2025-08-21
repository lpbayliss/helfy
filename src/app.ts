import { serve } from "@hono/node-server";
import { Context as RequestContext, Hono, Next } from "hono";
import { compress } from "hono/compress";
import { logger as honoLogger } from "hono/logger";
import { poweredBy } from "hono/powered-by";

import { Logger } from "./lib/logger.js";
import health from "./routes/health.js";
import env from "./lib/env.js";
import { Context, runWithContext } from "./lib/context.js";

const app = new Hono();

app.use(async (c: RequestContext, next: Next) => {
  await runWithContext(async () => {
    const requestId = crypto.randomUUID();

    // Set initial context values
    Context.set("requestId", requestId);
    Context.set("requestPath", c.req.path);
    Context.set("method", c.req.method);
    Context.set("startTime", Date.now());

    // Add request ID to response headers
    c.header("X-Request-ID", requestId);

    try {
      await next();
    } finally {
      Context.set("statusCode", c.res.status);
    }
  });
});

app.use(poweredBy());
app.use(honoLogger((str) => Logger.info(str)));
app.use(compress());

app.route("/api/health", health);

const startServer = () => {
  serve(
    {
      fetch: app.fetch,
      port: env.PORT,
    },
    (info) => {
      Logger.info(`Server is running on http://localhost:${info.port}`);
    }
  );
};

export default app;
export { startServer };
