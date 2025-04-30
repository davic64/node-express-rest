import config, { logger, morganStream } from "./config/config";

import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import passport from "./config/passport";
import routes from "./routes/v1";

import errorMiddleware from "./middlewares/error";

// -- Config ---
const PORT = config.PORT;
const NODE_ENV = config.NODE_ENV;

// -- Express app --
const app = express();

// -- General Miiddleware --
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms", {
    stream: morganStream,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// -- Routes --
app.get("/", (_, res) => {
  res.send("Node Express Rest API");
});
app.use("/api/v1", routes);

// -- Error Handling --
app.use(errorMiddleware);

// -- Start Server --
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`✅ Environment: ${NODE_ENV}`);
  logger.info("Winston logger initialized.");
});
