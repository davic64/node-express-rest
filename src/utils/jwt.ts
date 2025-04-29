import jwt from "jsonwebtoken";
import config from "../config/config";

interface TokenPayload {
  sub: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const options: jwt.SignOptions = {
    expiresIn: config.JWT_EXPIRATION || "1h",
  };

  return jwt.sign(payload, config.JWT_SECRET, options);
};
