import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { name, price, description } = await req.json();

  return NextResponse.json({
    name,
    price,
    description,
  });
}

