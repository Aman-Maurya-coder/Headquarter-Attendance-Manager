import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { jwt } from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (user) => {
try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
  
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
  
    return { accessToken, refreshToken };
} catch (error) {
    throw new ApiError(500, "Error generating tokens: " + error.message);
  }
}


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


const loginUser = asyncHandler( async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and Password are required");
  }
  const existingUser = await User.findOne({
      $where: {email}
  });

  if( !existingUser ) {
    throw new ApiError(404, "User not found");
  }
  
  if(!existingUser.comparePassword(password)){
    throw new ApiError(401, "Invalid Email or Password");
  }
  const [ accessToken, refreshToken ] = await generateAccessAndRefreshTokens(existingUser);
  const loggedInUser = await User.findById(existingUser._id).select(" -password -refreshToken");
  const options ={
    httpOnly: true,
    secure: true
  }
  res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(200,{
      user: loggedInUser, accessToken, refreshToken
    },
    "Login Successful"
    )
  )
})


const logout = asyncHandler( async (req, res) => {
  const user = User.findByIdAndUpdate(req.user._id, 
    {
      $unset: {
        refreshToken: 1
      },
    },
    {
      new: true,
    }
  )
  const options = {
    httpOnly: true,
    secure: true,
  }

  return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(
    new ApiResponse( 200, {}, "Logout Successful")
  ) 
  
})

const refreshAccessToken = asyncHandler(async (req, res) => {
try {
    const refreshToken = req.cookies.refreshToken || req.headers["Authorization"]?.replace("Bearer ", "");
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required");
    }
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  
    const user = await User.findById(decoded._id);
  
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
  
    if(refreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token invalid or used");
    }
  
    const [ accessToken, newRefreshToken ] = await generateAccessAndRefreshTokens(user);
  
    const options = {
      httpOnly: true,
      secure: true,
    };
  
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully")
    );
} catch (error) {
    throw new ApiError(401, "Invalid refresh token: " + error.message);
  }
})
// const existingUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const existedUser = User.find({email})

//   if (!existedUser) {
//     return res.status(401).json({ message: "Invalid email or password" });
//   }

//   res.status(200).json({ message: "Login Successful" });
// });

export { registerUser, loginUser, logout, refreshAccessToken };
