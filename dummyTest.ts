const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const port = 3030;

app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get("/", (req: Request, res: Response) => {
    console.log("Cookies: ", req.cookies);
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});