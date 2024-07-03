import { createFileRoute } from "@tanstack/react-router"
import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
})

async function getTotalSpent() {
  const res = await api.expenses["total-spent"].$get()

  if (!res.ok) {
    throw new Error("Server error")
  }

  const data = await res.json()
  return data
}

function Index() {
  const { isPending, error, data } = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  })

  if (error) return "An error has occured: " + error.message

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>Total abount spent</CardDescription>
      </CardHeader>
      <CardContent>{isPending ? "..." : data.total}</CardContent>
    </Card>
  )
}
