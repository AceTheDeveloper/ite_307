"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { api } from "@/utils/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  created_at: string;
}

export default function Page() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("api/products/");
      return res.data.data;
    },
  });

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
        <div className="p-6">
          {isLoading ? (
            // Skeleton loading state
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="flex flex-col gap-3 p-4">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/3" />
                </Card>
              ))}
            </div>
          ) : data && data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data.map((product) => (
                <Card
                  key={product.id}
                  className="flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">
                        {product.name}
                      </CardTitle>
                      <Badge variant="secondary" className="shrink-0">
                        ${product.price}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {product.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="text-xs text-muted-foreground">
                    Added {new Date(product.created_at).toLocaleDateString()}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-muted-foreground">
              No products available.
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
