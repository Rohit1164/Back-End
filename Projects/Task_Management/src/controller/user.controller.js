import { User } from "../models/Users.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // console.log(user);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  console.log(username, email, password);

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.create({ username, email, password });
    res.redirect("/users/login");
    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res
      .status(500)
      .send("An error occurred during signup. Please try again.");
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new Error("All field are required");
  }

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await user.isPasswordCorrect(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateAccessAndRefreshToken(
      user._id
    );
    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: false,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged In Successfully"
        )
      );
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logout = async (req, res) => {
  return res
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .clearCookie("userData")
    .json(
      new ApiResponse(
        200,

        "User logged out In Successfully"
      )
    );
};
