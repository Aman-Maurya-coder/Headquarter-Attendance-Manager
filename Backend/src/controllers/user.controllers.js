import {asyncHandler} from "../utils/asyncHandler.js"
const user=[];
const registerUser = asyncHandler( async (req,res)=>{
    console.log(req.body);
  const { first_name, last_name, Email, e_pw, c_pw } = req.body;
  

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

  res.status(201).json({ message: "Signup Successful" }); //, user: newUser
})

export {registerUser}