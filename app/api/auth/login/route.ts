import { db } from "@/utils/db";
import { decrypt, hashEmail } from "@/utils/encryption";
import { decodePassword } from "@/utils/password";
import { NextRequest, NextResponse } from "next/server";
import { createToken } from "@/utils/jwt";

import { UAParser } from "ua-parser-js";
import { sendOtpEmail } from "@/utils/mailer";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  password: string;
}

type PublicUser = Omit<User, "password">;

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "All Fields are required", isSuccess: false },
      { status: 400 },
    );
  }

  const hashedEmail = hashEmail(email);
  const [users] = await db.execute(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [hashedEmail],
  );

  if ((users as User[]).length > 0) {
    const user: User[] = users as User[];

    const foundUser = user[0];

    const isPasswordValid = await decodePassword(password, foundUser.password);

    if (isPasswordValid) {
      const userAgent = req.headers.get("user-agent") || "Unknown";

      const parser = new UAParser(userAgent);
      const deviceName = `${parser.getOS().name} ${parser.getBrowser().name}`;

      console.log(deviceName);

      const [knowDevices] = await db.execute(
        "SELECT * FROM user_devices WHERE user_id = ? AND device_name = ?",
        [foundUser.id, deviceName],
      );

      const isKnownDevice = (knowDevices as any[]).length > 0;

      if (!isKnownDevice) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        console.log("Generated OTP : ", otp);

        await db.execute(
          "INSERT INTO otp_verifications (user_id, otp, device_name, expires_at) VALUES (?, ?, ?, ?)",
          [foundUser.id, otp, deviceName, expiresAt],
        );

        await sendOtpEmail(email, otp);

        return NextResponse.json(
          {
            message: "New Device Detected. OTP sent to your email.",
            isSuccess: false,
            requiresOTP: true,
          },
          { status: 200 },
        );
      }

      await db.execute(
        "UPDATE user_devices SET last_seen = NOW() WHERE user_id = ? AND device_name = ?",
        [foundUser.id, deviceName], // 👈 add this before createToken
      );

      const token = createToken({
        id: foundUser.id,
        role: foundUser.role,
      });

      const userToReturn: PublicUser = {
        id: foundUser.id,
        name: decrypt(foundUser.name),
        email: email,
        role: foundUser.role,
      };

      const response = NextResponse.json(
        { message: "Logged In", isSuccess: true, user: userToReturn },
        { status: 200 },
      );

      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });

      return response;
    } else {
      return NextResponse.json(
        { message: "Invalid Credentials", isSuccess: false },
        { status: 400 },
      );
    }
  } else {
    return NextResponse.json(
      { message: "User Not Found", isSuccess: false },
      { status: 400 },
    );
  }
}
