import { db } from "@/utils/db";
import { encrypt } from "@/utils/encryption";
import { ResultSetHeader } from "mysql2";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        { success: false, message: "Product ID is required" },
        { status: 400 },
      );
    }

    const body = await req.json();

    const { name, price, description } = body;

    if (!name || price === undefined) {
      return Response.json(
        { success: false, message: "Name and price are required" },
        { status: 400 },
      );
    }

    const [result] = await db.execute<ResultSetHeader>(
      "UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?",
      [encrypt(name), price, encrypt(description ?? ""), id],
    );

    if (result.affectedRows === 0) {
      return Response.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    return Response.json(
      { success: true, message: "Product updated successfully", data: { id } },
      { status: 200 },
    );
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return Response.json(
        { success: false, message: "Product ID is required" },
        { status: 400 },
      );
    }

    const [result] = await db.execute<ResultSetHeader>(
      "DELETE FROM products WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return Response.json(
        { success: false, message: "Product not found" },
        { status: 404 },
      );
    }

    return Response.json(
      { success: true, message: "Product deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
