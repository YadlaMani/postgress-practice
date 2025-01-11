import { Client } from "pg";
import express from "express";
import "dotenv/config";

const app = express();
app.use(express.json());

const pgClient = new Client(process.env.DB_URI as string);
app.listen(4444, async () => {
  try {
    await pgClient.connect();
    console.log("Server is running on port 4444");
  } catch (err) {
    console.error("Failed to connect to database:", err);
  }
});
//@ts-ignore
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Received body:", req.body);

  if (!username || !email || !password) {
    return res.status(400).send("Missing required fields");
  }

  const result = await pgClient.query(
    `INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *`,
    [username, email, password]
  );
  res.status(201).send(result.rows[0]);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});
//@ts-ignore
app.post("/address", async (req, res) => {
  const { user_id, city, country, street, pincode } = req.body;
  if (!user_id || !city || !country || !street || !pincode) {
    return res.status(400).send("Missing required fields");
  }
  const result = await pgClient.query(
    `INSERT INTO addresses(user_id, city, country, street, pincode) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [user_id, city, country, street, pincode]
  );
  res.status(201).send(result.rows[0]);
});
//@ts-ignore
app.get("/metadata", async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).send("Missing required fields");
  }
  const query = `SELECT u.id,u.username,u.email,a.city,a.country,a.street,a.pincode from users u join addresses a on u.id=a.user_id where u.id=$1`;
  const result = await pgClient.query(query, [id]);
  res.status(200).send(result.rows[0]);
});
