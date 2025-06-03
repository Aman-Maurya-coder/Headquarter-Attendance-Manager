import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
    cors({
      credentials: true,
      origin: "*",
    })
  );

const users = [];

app.post("/signup", (req, res) => {
    // const { firstName, lastName, email, password, confirm_pass } = req.body;
    console.log(req.body);

//   if (!firstName || !lastName || !email || !password) {
//     return res.status(400).json({ message: "All fields are required" });
//   }
//   if (!email.endsWith("@gmail.com")) {
//     return res.status(400).json({ messgae: "Invalid Email" });
//   }
//   if (password.length < 8) {
//     return res.status(400)({
//       messgae: "Password must be at least 8 character long",
//     });
//   }
//   const userExists = users.find((user) => user.email === email);

//   if (userExists) {
//     return res.status(400).json({ messgae: "Email already registered" });
//   }
//   const newUser = { firstName, lastName, email, password };
//   users.push(newUser);

  res.status(201).json({ message: "Signup Successful" });  //, user: newUser
});

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   const existingUser = users.find(
//     (user) => user.email === email && user.password === password
//   );

//   if (!existingUser) {
//     return res.status(401).json({ messgae: "Invalid email or password" });
//   }
//   res.status(200).json({ message: "Login Successful", user: existingUser });
// });

app.listen(process.env.PORT || 8000, () => {
  console.log(`Server is running on local host ${process.env.PORT}`);
});



app.use(cookieParser());
