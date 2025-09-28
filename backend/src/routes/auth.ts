import express, { Request, Response } from "express";
import passport from "passport";

const router = express.Router();

router.post(
  "/login",
  passport.authenticate("login-custom", { session: false }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    if (user.status) {
      return res.status(200).json({
        resultShort: "success",
        resultLong: "Login successful",
        data: {
          token: user.jwt,
          details: user.data,
        },
      });
    } else {
      res.status(400).json({
        resultLong: user["message"] || "Login failed",
        resultShort: "failure",
      });
    }
  }
);

export default router;
