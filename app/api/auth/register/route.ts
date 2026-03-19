import { db } from "@/utils/db";
import { encrypt, hashEmail } from "@/utils/encryption";
import { hashPassword } from "@/utils/password";
import { NextResponse, NextRequest } from "next/server";

interface User {
  id: number | string;
  name: string;
  email: string;
  password: string;
}

type role = "admin" | "customer";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();
  const numberOrSymbolRegex = /[^a-zA-Z]/;

  console.log(name, email, password);

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "All Fields Are Required", isSuccess: false },
      { status: 400 },
    );
  }

  if (!email.includes("@")) {
    return NextResponse.json(
      { message: "Please enter a valid Email", isSuccess: false },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { message: "Password must be at least 8 characters", isSuccess: false },
      { status: 400 },
    );
  }

  if (!numberOrSymbolRegex.test(password)) {
    return NextResponse.json(
      { message: "Password must contain a number or symbol", isSuccess: false },
      { status: 400 },
    );
  }

  const hashedPassword = await hashPassword(password);

  const encryptedName = encrypt(name);
  const encryptedEmail = hashEmail(email);

  // check if existing
  const [existing] = await db.execute("SELECT * FROM users WHERE email = ?", [
    encryptedEmail,
  ]);

  if ((existing as User[]).length > 0) {
    return NextResponse.json(
      { message: "Email already exists", isSuccess: false },
      { status: 409 },
    );
  }

  const default_role: role = "customer";

  await db.execute(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [encryptedName, encryptedEmail, hashedPassword, default_role],
  );

  return NextResponse.json(
    { message: "User created successfully", isSuccess: true },
    { status: 201 },
  );
}
