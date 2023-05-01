const router = require("express").Router();
const apiRoutes = require("./api");

router.use("/api", apiRoutes);

router.use((req, res) =>
  res.send("You did something wrong :( It is alright. Try again!")
);

module.exports = router;
