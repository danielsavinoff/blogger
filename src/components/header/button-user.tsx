import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { auth } from "@/auth";
 
export async function User() {
  const data = await auth()

  return(
    <DropdownMenu>
        <DropdownMenuTrigger className="h-12 px-4 flex items-center">
          <Avatar className="h-6">
            <AvatarFallback>
              {data?.user?.email?.[0] ?? data?.user?.name?.[0]}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="min-w-48"
        align="end"
      >
        <DropdownMenuItem asChild>
          <Link href={'/api/auth/signout'}>
            Sign Out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}  
