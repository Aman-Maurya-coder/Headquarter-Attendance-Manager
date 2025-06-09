import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
  const {first_name, last_name, email, e_pw, c_pw } = req.body;
  console.log(req.body);

  if (!first_name || !last_name || !email || !e_pw || !c_pw) {
    throw new ApiError(400,"All fields are Required")
  }

  if (!email.endsWith("@gmail.com")) {
    throw new ApiError(400,"Invalid Email")
  }

  if (e_pw.length < 8) {
    throw new ApiError(400,"Password must be at least 8 characters long")
  }

  const userExists = await User.findOne({email});
  if (userExists) {
    throw new ApiError(409,"Email already registered")
  }

  const user= await User.create({
    first_name,
    last_name,
    email,
    password:e_pw,
  })

  const createdUser= await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createdUser){
    throw new ApiError(500,"Something went wrong")
  }

  return res.status(201).json(
    new ApiResponse(200,createdUser,"User Registered Successfully")
  )
})


// const existingUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const existedUser = User.find({email})

//   if (!existedUser) {
//     return res.status(401).json({ message: "Invalid email or password" });
//   }

//   res.status(200).json({ message: "Login Successful" });
// });

export { registerUser };
