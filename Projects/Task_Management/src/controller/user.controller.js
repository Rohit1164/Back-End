import { User } from "../models/Users.models.js";
import { ApiError } from "../utils/ApiError.js";

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

  if (!email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.isPasswordCorrect(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    // Save to session
    req.session.user = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    const options = { httpOnly: true, secure: false };

    res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .redirect("/task");
  } catch (error) {
    console.error("Login error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({ message: "Logout failed", error: err });
      }

      res
        .clearCookie("connect.sid")
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .redirect("/");
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
