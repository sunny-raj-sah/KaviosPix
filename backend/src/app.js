 const express = require("express");
const cors = require("cors");

const passport = require("./config/passport");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");
const albumRoutes = require("./routes/album.routes");


const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");


const app = express();

app.use(cors());
app.use(express.json());

app.use(passport.initialize());

app.get("/", (req, res) => {
res.json({
message: "KaviosPix API is running",
});
});




app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/test", testRoutes);

app.use("/albums", albumRoutes);

/*
 * 404 middleware
 *
 * Must come after all routes.
 */
app.use(notFound);

/*
 * Global error handler
 *
 * Must be the LAST middleware.
 */
app.use(errorHandler);

module.exports = app;
