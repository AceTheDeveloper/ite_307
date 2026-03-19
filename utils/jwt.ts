import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  id: number | string;
  role: string;
}

export function createToken(payload: TokenPayload) {
  return jwt.sign(payload, process.env.SECRET_KEY!, {
    expiresIn: "1d",
  });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, process.env.SECRET_KEY!) as TokenPayload;
  } catch (error) {
    return null;
  }
}
