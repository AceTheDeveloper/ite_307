"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontalIcon, PlusCircle, PencilIcon } from "lucide-react";

import { useState } from "react";
import { api } from "@/utils/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  created_at: string;
}

export default function Page() {
  const queryClient = useQueryClient();

  // Add dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Edit dialog state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("api/products/");
      return res.data.data;
    },
  });

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name"),
      price: formData.get("price"),
      description: formData.get("description"),
    };

    try {
      await api.post("api/products", payload);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setAddDialogOpen(false);
    } catch (err) {
      console.error("Failed to add product:", err);
    }
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editProduct) return;

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name"),
      price: formData.get("price"),
      description: formData.get("description"),
    };

    try {
      await api.put(`api/products/${editProduct.id}`, payload);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditDialogOpen(false);
      setEditProduct(null);
    } catch (err) {
      console.error("Failed to update product:", err);
    }
  }

  async function handleDelete() {
    if (!deleteProduct) return;

    try {
      await api.delete(`api/products/${deleteProduct.id}`);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeleteDialogOpen(false);
      setDeleteProduct(null);
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {/* Add Product Button + Dialog */}
            <div className="text-right mt-4 px-3">
              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Products
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                    <DialogDescription>
                      Add Products on your counter 🤑🤑
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAdd}>
                    <FieldGroup>
                      <Field>
                        <Label htmlFor="add-name">Name</Label>
                        <Input
                          id="add-name"
                          name="name"
                          defaultValue="Sample Product 001"
                          required
                        />
                      </Field>
                      <Field>
                        <Label htmlFor="add-price">Price</Label>
                        <Input
                          id="add-price"
                          name="price"
                          defaultValue="0.00"
                          type="number"
                          step="0.01"
                          min="0"
                          required
                        />
                      </Field>
                      <Field>
                        <Label htmlFor="add-description">Description</Label>
                        <Textarea
                          id="add-description"
                          name="description"
                          className="resize-none"
                          placeholder="Enter Description Here"
                        />
                      </Field>
                    </FieldGroup>
                    <DialogFooter className="mt-4">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit">Add Product</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Products Table */}
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Table className="text-center">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center">Product</TableHead>
                    <TableHead className="text-center">Price</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : data && data.length > 0 ? (
                    data.map((product: Product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                              >
                                <MoreHorizontalIcon />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center">
                              {/* No Dialog here — just set state */}
                              <DropdownMenuItem
                                onSelect={() => {
                                  setEditProduct(product);
                                  setEditDialogOpen(true);
                                }}
                              >
                                <PencilIcon className="mr-2 h-4 w-4" />
                                Modify
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => {
                                  setDeleteProduct(product);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No Products Available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Edit Dialog — rendered OUTSIDE the table/dropdown */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Modify Product</DialogTitle>
              <DialogDescription>
                Modify Products on your counter 🤑🤑
              </DialogDescription>
            </DialogHeader>
            {/* key forces remount when product changes, fixing stale defaultValues */}
            <form key={editProduct?.id} onSubmit={handleEdit}>
              <FieldGroup>
                <Field>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    defaultValue={editProduct?.name}
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    defaultValue={editProduct?.price}
                    type="number"
                    step="0.01"
                    min="0"
                    required
                  />
                </Field>
                <Field>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    name="description"
                    className="resize-none"
                    placeholder="Enter Description Here"
                    defaultValue={editProduct?.description}
                  />
                </Field>
              </FieldGroup>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Update Product</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog — also outside the table */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-semibold">{deleteProduct?.name}</span>?
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
