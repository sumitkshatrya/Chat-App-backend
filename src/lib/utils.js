import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development", // secure only in prod
    sameSite: process.env.NODE_ENV !== "development" ? "none" : "lax",  // ✅ Fix: allow frontend (5173/5174) to send cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};
