import express from "express";
import cors from "cors";
import Auth from "middleware/passport";
import passport from "passport";
import config from "@config/index";
import { errorHandler, notFound } from "middleware/error";
import builder_route from "@routes/builders";
import project_route from "@routes/projects";
import auth_route from "@routes/auth";

const app = express();

// Initialize passport strategies
// Uncomment if you want to use the custom login strategy
// Auth(passport);

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

// app.use("/api", routes);

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Creators API Server",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Uncomment to enable auth routes
// app.use("/", auth_route);

// Unprotected route to create builders for testing
app.use(
  "/api/builders",
  // passport.authenticate("jwt", { session: false }),
  builder_route
);

// Unprotected route to create projects for testing
app.use(
  "/api/projects",
  // passport.authenticate("jwt", { session: false }),
  project_route
);

app.use(errorHandler);

app.use(notFound);

export default app;
