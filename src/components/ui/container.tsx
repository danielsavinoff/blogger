import { cn } from "@/lib/utils"

export const Container = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <main
    className={cn(["container flex max-w-3xl py-16 min-h-full", className])}
    {...props}
  />
)