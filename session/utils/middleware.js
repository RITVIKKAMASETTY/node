export const authmiddleware = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    return res.status(401).json({ message: "Login required" });
  }
  next();
};
