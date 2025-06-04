import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"

dotenv.config({
  path:"./env"
})

const app = express();

app.use(
    cors({
      credentials: true,
      origin: "*",
    })
  );
app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({extended:true}));

const users = [];

app.post("/signup", (req, res) => {
    const { first_name, last_name, Email, e_pw, c_pw } = req.body;
    console.log(req.body);

  if (!first_name || !last_name || !Email || !e_pw || !c_pw) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!Email.endsWith("@gmail.com")) {
    return res.status(400).json({ messgae: "Invalid Email" });
  }
  if (e_pw.length < 8) {
    return res.status(400)({
      messgae: "Password must be at least 8 character long",
    });
  }
  const userExists = users.find((user) => user.Email === Email);

  if (userExists) {
    return res.status(400).json({ messgae: "Email already registered" });
  }
  const newUser = { first_name, last_name, Email, e_pw, c_pw };
  users.push(newUser);

  res.status(201).json({ message: "Signup Successful" });  //, user: newUser
});

app.post("/login", (req, res) => {
  const { Email, e_pw } = req.body;

  const existingUser = users.find(
    (user) => user.Email === email && user.password === password
  );

  if (!existingUser) {
    return res.status(401).json({ messgae: "Invalid email or password" });
  }
  res.status(200).json({ message: "Login Successful", user: existingUser });
});

app.listen(process.env.PORTPORT || 8000, () => {
  console.log(`Server is running on local host ${process.env.PORT||8000}`);
});




