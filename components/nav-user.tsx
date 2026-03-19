"use client";

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface Props {
  user: {
    name: string;
    email: string;
  };
  logout: () => void;
}

export function NavUser({ user, logout }: Props) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage
                  src={`data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAugMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAwQFAQIH/8QAKxABAAICAQMCBAYDAAAAAAAAAAECAxEEITFhEkEiMlFxBTRSgZGhEyNy/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/APqgCoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPGTLXFG7zEeJVeTy9fDhn727/wAKUzNp3MzM/WQXb879FP5Rzzs30pEfZWFwWo52TfWKz9k2Pm0tMRasx/bPDBtRMT1idwMrDyL4p77r+lp4r1yUi1Z3CD0AAAAAAAAAAAAAAg5t/RhnU6m3SE6h+I2mb1rHaIBUAUAAAAFz8Pt1vTxtTWODOuRHmJKNKAEAAAAAAAAAAAABm8/8xrxDSZ3Pj/dE/WAVgFAAAABLxJ1yKeZ0iS8WN8jH9yjVgIEAAAAAAAAAAAACde/Zk8i9r5beu0zMTMdfZrT2ZPJjXIyf9AjAUAAAAHa2mk+qs6mO0uERudfUo2azusb32h0gQAAAAAAAAAAAAPeGfzsc/wCT1xE+nXWfo0HnJG6Wr7TEgxwmNTqRQAAAATcXHa2ak+mfTE737IZ7NbjVmmCtfCCQAAAAAAAAAAAAAA/YAZvNwzjv64j4Lf1Ku0+b+XtP00zDQAUACiXjYpy5YjUaierVj28KP4dHXJ+y8gAAAAAAAAAAAAA6Dge2/byz+bni+q47biO8Ak52ak0nHWdzM9dKIKAAAALHCzUxZLeudRMd2lFomImJ3EsVLxssYsm5mYp7xCDVHml62jdZ3Hh6AAAAAAAAmY95AFTNzK1nWOPV5meirfk5r97z9o6A075KU+e8VjyrZOdSPkj1eZ6Qobmes9wEmXNfLPx3n7R2RgoAAAAAAAA7S9sc7paYlbxc72yxvzVTEGtTPiyfJeJ8e73tjJKZstPlvMfvsGsKOHnT2yxvzWF2l63r6q23E/QHQAFTn3tGOsR033AGfHZ0FAAAAAAAAAAAAAAAABZ4F7Rn9G/hmOwFGiAg/9k=`}
                  alt={user?.name}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user?.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={`data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAugMBIgACEQEDEQH/xAAaAAEAAwEBAQAAAAAAAAAAAAAAAwQFAQIH/8QAKxABAAICAQMCBAYDAAAAAAAAAAECAxEEITFhEkEiMlFxBTRSgZGhEyNy/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAWEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/APqgCoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPGTLXFG7zEeJVeTy9fDhn727/wAKUzNp3MzM/WQXb879FP5Rzzs30pEfZWFwWo52TfWKz9k2Pm0tMRasx/bPDBtRMT1idwMrDyL4p77r+lp4r1yUi1Z3CD0AAAAAAAAAAAAAAg5t/RhnU6m3SE6h+I2mb1rHaIBUAUAAAAFz8Pt1vTxtTWODOuRHmJKNKAEAAAAAAAAAAAABm8/8xrxDSZ3Pj/dE/WAVgFAAAABLxJ1yKeZ0iS8WN8jH9yjVgIEAAAAAAAAAAAACde/Zk8i9r5beu0zMTMdfZrT2ZPJjXIyf9AjAUAAAAHa2mk+qs6mO0uERudfUo2azusb32h0gQAAAAAAAAAAAAPeGfzsc/wCT1xE+nXWfo0HnJG6Wr7TEgxwmNTqRQAAAATcXHa2ak+mfTE737IZ7NbjVmmCtfCCQAAAAAAAAAAAAAA/YAZvNwzjv64j4Lf1Ku0+b+XtP00zDQAUACiXjYpy5YjUaierVj28KP4dHXJ+y8gAAAAAAAAAAAAA6Dge2/byz+bni+q47biO8Ak52ak0nHWdzM9dKIKAAAALHCzUxZLeudRMd2lFomImJ3EsVLxssYsm5mYp7xCDVHml62jdZ3Hh6AAAAAAAAmY95AFTNzK1nWOPV5meirfk5r97z9o6A075KU+e8VjyrZOdSPkj1eZ6Qobmes9wEmXNfLPx3n7R2RgoAAAAAAAA7S9sc7paYlbxc72yxvzVTEGtTPiyfJeJ8e73tjJKZstPlvMfvsGsKOHnT2yxvzWF2l63r6q23E/QHQAFTn3tGOsR033AGfHZ0FAAAAAAAAAAAAAAAABZ4F7Rn9G/hmOwFGiAg/9k=`}
                    alt={user?.name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconCreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
