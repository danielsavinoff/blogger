import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return(
    <div className="h-full flex justify-center items-center">
      <div className="flex flex-col items-center space-y-2">
        <h5 className="text-lg font-medium">
          This page does not exist
        </h5>
        <Button size={"sm"} asChild>
          <Link href={'/'}>
            Back to home page
          </Link>
        </Button>
      </div>
    </div>
  )
}