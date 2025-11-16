import jwt from "jsonwebtoken";
import ExpressError from "./ExpressError.js";

const JWT_SECRET = "yourSecretKey"; // move to .env

export const authmiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "Token missing. Login required." });

  try {
    // Decode token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // contains id, email, username
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
{
    "message": "User registered successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTliODJlZWUzMjFiMGY4MjRlMmZjMSIsImVtYWlsIjoiYWFhYWFhYWFoaGFiaGFoYmFodmF2aHZhaGFhQGEuY29tIiwidXNlcm5hbWUiOiJhYWFhYWEiLCJpYXQiOjE3NjMyOTMyMzAsImV4cCI6MTc2Mzg5ODAzMH0.DsoXb3SwxmejxkNVxwh_Wh-d0XVq5BNmnvV3LPwF2oI",
    "user": {
        "email": "aaaaaaaahhabhahbahvavhvahaa@a.com",
        "_id": "6919b82eee321b0f824e2fc1",
        "username": "aaaaaa",
        "__v": 0
    }
}