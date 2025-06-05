import { asyncHandler } from "../utils/asyncHandler.js";

const users = [];

const registerUser = asyncHandler(async (req, res) => {
  const { first_name, last_name, Email, e_pw, c_pw } = req.body;
  console.log(req.body);

  if (!first_name || !last_name || !Email || !e_pw || !c_pw) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!Email.endsWith("@gmail.com")) {
    return res.status(400).json({ message: "Invalid Email" });
  }

  if (e_pw.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long",
    });
  }
  const userExists = users.find((user) => user.Email === Email);

  if (userExists) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const newUser = { first_name, last_name, Email, e_pw, c_pw };
  users.push(newUser);

  res.status(201).json({ message: "Signup Successful" });
});

const existingUser = asyncHandler(async (req, res) => {
  const { Email, e_pw } = req.body;

  const existedUser = users.find(
    (user) => user.Email === Email && user.e_pw === e_pw
  );

  if (!existedUser) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.status(200).json({ message: "Login Successful" });
});

export { registerUser, existingUser };
