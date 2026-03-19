import { NextResponse, NextRequest } from "next/server";
import { db } from "@/utils/db";
import { decrypt } from "@/utils/encryption";
import { createToken } from "@/utils/jwt";

interface OtpRecord {
  id: number;
  user_id: number;
  otp: string;
  device_name: string;
  expires_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  password: string;
}

export async function POST(req: NextRequest) {
  const { otp, email } = await req.json();

  const [rows] = await db.execute(
    "SELECT * FROM otp_verifications WHERE otp = ? AND expires_at > NOW()",
    [otp],
  );

  if ((rows as OtpRecord[]).length === 0) {
    return NextResponse.json(
      { message: "Invalid or expired OTP", isSuccess: false },
      { status: 400 },
    );
  }

  const otpRecord = (rows as OtpRecord[])[0];

  // Register the new device so next login skips OTP
  await db.execute(
    "INSERT IGNORE INTO user_devices (user_id, device_name, last_seen) VALUES (?, ?, NOW())",
    [otpRecord.user_id, otpRecord.device_name],
  );

  // Clean up used OTP
  await db.execute("DELETE FROM otp_verifications WHERE otp = ?", [otp]);

  // Fetch user to build the token + response
  const [users] = await db.execute("SELECT * FROM users WHERE id = ? LIMIT 1", [
    otpRecord.user_id,
  ]);

  const foundUser = (users as User[])[0];

  const token = createToken({
    id: foundUser.id,
    role: foundUser.role,
  });

  const userToReturn = {
    id: foundUser.id,
    name: decrypt(foundUser.name),
    email: email,
    role: foundUser.role,
  };

  // Set the cookie exactly like your login route does
  const response = NextResponse.json({
    message: "OTP verified successfully",
    isSuccess: true,
    user: userToReturn,
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return response;
}
