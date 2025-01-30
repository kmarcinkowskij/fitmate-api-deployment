import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import fitmate_router from "./routes/router.js";
import users_router from "./routes/users.js";
import devs_router from "./routes/dev.js";
import sports_router from "./routes/sports.js";

const app = express();
const PORT = process.env.PORT;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true} };

app.use(bodyParser.json());
app.use(fitmate_router);
app.use('/users/', users_router);
app.use('/dev/', devs_router);
app.use('/sports/', sports_router);

try {
    console.log("database connecting");
    await mongoose.connect(process.env.MONGODB_CONNECT_URI, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1});
    console.log("database connected");
} catch (e) {
    console.error(e);
}

app.listen(async () => {
    console.log(`api listening on ${PORT}`);
})

export default app;