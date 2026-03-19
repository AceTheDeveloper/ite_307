import { NextResponse, NextRequest } from "next/server";
import { db } from "@/utils/db";
import { encrypt, decrypt } from "@/utils/encryption";

interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  created_at: string;
}

// ---- Helpers ----

function isValidPrice(value: unknown): boolean {
  const num = Number(value);
  return !isNaN(num) && num >= 0;
}

function validateProduct(body: Record<string, unknown>) {
  const errors: string[] = [];

  if (!body.name || typeof body.name !== "string" || body.name.trim() === "") {
    errors.push("Name is required and must be a non-empty string.");
  }

  if (
    !body.description ||
    typeof body.description !== "string" ||
    body.description.trim() === ""
  ) {
    errors.push("Description is required and must be a non-empty string.");
  }

  if (
    body.price === undefined ||
    body.price === null ||
    !isValidPrice(body.price)
  ) {
    errors.push("Price is required and must be a valid non-negative number.");
  }

  return errors;
}

// ---- GET ---- //
export async function GET() {
  try {
    const [products] = await db.execute("SELECT * FROM products");

    const decryptedProducts = (products as Product[]).map((product) => ({
      ...product,
      name: product.name ? decrypt(product.name) : null,
      description: product.description ? decrypt(product.description) : null,
    }));

    return NextResponse.json({ data: decryptedProducts }, { status: 200 });
  } catch (error) {
    console.error("GET /products error:", error);
    return NextResponse.json(
      { message: "Failed to fetch products." },
      { status: 500 },
    );
  }
}

// ---- POST ---- //
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const errors = validateProduct(body);
    if (errors.length > 0) {
      return NextResponse.json(
        { message: "Validation failed.", errors },
        { status: 422 },
      );
    }

    const { name, description, price } = body;

    const [result]: any = await db.execute(
      "INSERT INTO products (name, description, price) VALUES (?, ?, ?)",
      [encrypt(name.trim()), encrypt(description.trim()), price],
    );

    const insertedId = result.insertId;

    return NextResponse.json(
      {
        message: "Product added successfully.",
        data: {
          id: insertedId,
          name: name.trim(),
          description: description.trim(),
          price: Number(price),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /products error:", error);
    return NextResponse.json(
      { message: "Failed to add product." },
      { status: 500 },
    );
  }
}
