"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const pgClient = new pg_1.Client({
    user: "postgress_owner",
    password: "2kuMJxoF9GtQ",
    port: 5432,
    host: "ep-late-cloud-a5wtemyx.us-east-2.aws.neon.tech",
    database: "postgress",
    ssl: true,
});
app.listen(4444, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pgClient.connect();
        console.log("Server is running on port 4444");
    }
    catch (err) {
        console.error("Failed to connect to database:", err);
    }
}));
//@ts-ignore
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    console.log("Received body:", req.body);
    if (!username || !email || !password) {
        return res.status(400).send("Missing required fields");
    }
    const result = yield pgClient.query(`INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *`, [username, email, password]);
    res.status(201).send(result.rows[0]);
}));
app.get("/", (req, res) => {
    res.send("Hello World");
});
