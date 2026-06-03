const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const env = require("./src/config/env");
const { handleConnectDB } = require("./src/config/db");
const requestReceived = require("./src/middlewares/requestReceived");
const errorHandler = require("./src/middlewares/errorHandler");

const authRoute = require("./src/routes/authRoute");
const articleRoutes = require("./src/routes/articleRoutes");
const exerciceRoutes = require("./src/routes/exerciceRoutes");
const exerciceProgRoutes = require("./src/routes/ExerciceProgRoutes");
const performanceRecordRoutes = require("./src/routes/PerformanceRecordRoutes");
const personalProgRoutes = require("./src/routes/PersonalProgRoutes");
const profilPlayerRoutes = require("./src/routes/ProfilPlayerRoutes");
const savedRoute = require("./src/routes/savedRoute");
const subscriptionRoutes = require("./src/routes/subscriptionRoutes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(requestReceived);

app.use("/api/auth", authRoute);
app.use("/api/articles", articleRoutes);
app.use("/api/exercices", exerciceRoutes);
app.use("/api/exercice-programmes", exerciceProgRoutes);
app.use("/api/performance-records", performanceRecordRoutes);
app.use("/api/programmes", personalProgRoutes);
app.use("/api/profile", profilPlayerRoutes);
app.use("/api/saved", savedRoute);
app.use("/api/subscriptions", subscriptionRoutes);

app.use(errorHandler);

const PORT = env.port || process.env.PORT || 5000;
handleConnectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
