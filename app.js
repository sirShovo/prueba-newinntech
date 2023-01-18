const express = require("express");
const app = express();

app.set("port", process.env.PORT || 3000);
app.set("json spaces", 2);

app.use(express.json());

app.use(require("./src/routes/users.routes"));
app.use(require("./src/routes/files.routes"));

app.listen(app.get("port"), () => {
  console.log(`Server is starting correctly on port ${app.get("port")}`);
});
