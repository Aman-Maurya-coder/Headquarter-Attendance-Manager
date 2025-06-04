import express from "express"
const router=express.Router()

const users=[];
router.post("/login", (req, res) => {
  const { Email, e_pw } = req.body;

  const existingUser = users.find(
    (user) => user.Email === Email && user.e_pw === e_pw
  );

  if (!existingUser) {
    return res.status(401).json({ messgae: "Invalid email or password" });
  }
  res.status(200).json({ message: "Login Successful", user: existingUser });
});
export default router