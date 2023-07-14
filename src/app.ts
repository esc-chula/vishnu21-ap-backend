import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import updateData from "./utils/updateData.util";

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "*",
    })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    const data = await updateData("Sheet1");
    res.send(data);
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
