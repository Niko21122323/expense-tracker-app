import { Button } from "@/components/ui/button"
import { userQueryOptions } from "@/lib/api"
import { createFileRoute, Outlet } from "@tanstack/react-router"

const Login = () => {
  return (
    <div>
      <h3>You have to Login :(</h3>
      <div className="flex flex-col w-28 gap-5 mt-10">
        <Button asChild>
          <a href="/api/login">Login here!</a>
        </Button>
        <Button asChild>
          <a href="/api/register">Register here!</a>
        </Button>
      </div>
    </div>
  )
}

const Component = () => {
  const { user } = Route.useRouteContext()

  if (!user) {
    return <Login />
  }

  return <Outlet />
}

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    const queryClient = context.queryClient

    try {
      const data = await queryClient.fetchQuery(userQueryOptions)
      return data
    } catch (e) {
      return { user: null }
    }
  },
  component: Component,
})
