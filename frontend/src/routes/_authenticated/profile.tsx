import { userQueryOptions } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
})

function Profile() {
  const { isPending, error, data } = useQuery(userQueryOptions)

  if (isPending) return "loading"
  if (error) return "not logged in"

  return (
    <div className="p-2">
      <div className="flex items-center gap-6 mb-10">
        <Avatar>
          {data.user.picture && (
            <AvatarImage src={data.user.picture} alt={data.user.given_name} />
          )}
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p>
          Hello {data.user.given_name} {data.user.family_name}
        </p>
      </div>
      <Button asChild>
        <a href="/api/logout">Logout here!</a>
      </Button>
    </div>
  )
}
