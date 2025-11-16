import { Router } from "express";
import User from "../models/users.js";
import { userschema } from "../utils/Schema.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const usersrouter = Router();
const JWT_SECRET = "yourSecretKey"; // Always store in .env!!!

// Generate JWT
function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// REGISTER
usersrouter.post(
  "/register",
  wrapAsync(async (req, res) => {
    const { error } = userschema.validate(req.body);
    if (error) {
      const msg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    }

    const { email, username, password } = req.body;

    // Check duplicate
    const exists = await User.findOne({ email });
    if (exists) throw new ExpressError("Email already taken", 400);

    // Hash password
    const hashed = await bcrypt.hash(password, 12);

    const user = new User({ email, username, password: hashed });
    await user.save();

    const token = generateToken(user);

    res.status(201).send({
      message: "User registered successfully",
      token,
      user: user.toJSON(),
    });
  })
);

// LOGIN
usersrouter.post(
  "/login",
  wrapAsync(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new ExpressError("Invalid credentials", 401);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ExpressError("Invalid credentials", 401);

    const token = generateToken(user);

    res.send({
      message: "Login successful",
      token,
    });
  })
);

// LOGOUT (client will delete token)
usersrouter.get("/logout", (req, res) => {
  res.send({ message: "Logout successful (delete token on client)" });
});

export default usersrouter;
