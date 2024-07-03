import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"

import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useQueryClient } from "@tanstack/react-query"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { useForm } from "@tanstack/react-form"

import {
  createExpense,
  getAllExpensesQueryOptions,
  loadingCreateExpenseQueryOptions,
} from "@/lib/api"

import { createExpenseSchema } from "@server/sharedTypes"
// import { expenses } from "@server/db/schema/expenses"
import { toast } from "sonner"

export const Route = createFileRoute("/_authenticated/create-expense")({
  component: CreateExpense,
})

function CreateExpense() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      title: "",
      amount: "0",
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      const exisitingExpenses = await queryClient.ensureQueryData(
        getAllExpensesQueryOptions
      )

      navigate({ to: "/expenses" })

      // loading state
      queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {
        expense: value,
      })

      try {
        const newExpense = await createExpense({ value })
        // success state
        queryClient.setQueryData(getAllExpensesQueryOptions.queryKey, {
          ...exisitingExpenses,
          expenses: [newExpense, ...exisitingExpenses.expenses],
        })

        toast("Expense Created", {
          description: `Expense create successgull: ${newExpense.id}`,
        })
      } catch (error) {
        toast("Error", {
          description: "Failed to create new expense",
        })
      } finally {
        queryClient.setQueryData(loadingCreateExpenseQueryOptions.queryKey, {})
      }
    },
  })

  return (
    <div className="p-2">
      <h2 className="max-w-xl m-auto my-10">Create an expense</h2>
      <form
        className="max-w-xl m-auto"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="title"
          validators={{
            onChange: createExpenseSchema.shape.title,
          }}
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Title</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.touchedErrors ? (
                <em>{field.state.meta.touchedErrors}</em>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="amount"
          validators={{
            onChange: createExpenseSchema.shape.amount,
          }}
          children={(field) => (
            <div>
              <Label htmlFor={field.name}>Amount</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                type="number"
                onChange={(e) => field.handleChange(e.target.value)}
              />
              {field.state.meta.touchedErrors ? (
                <em>{field.state.meta.touchedErrors}</em>
              ) : null}
            </div>
          )}
        />

        <form.Field
          name="date"
          validators={{
            onChange: createExpenseSchema.shape.date,
          }}
          children={(field) => (
            <div className="self-center">
              <Calendar
                mode="single"
                selected={new Date(field.state.value)}
                onSelect={(date) =>
                  field.handleChange((date ?? new Date()).toISOString())
                }
                className="rounded-md border"
              />
              {field.state.meta.touchedErrors ? (
                <em>{field.state.meta.touchedErrors}</em>
              ) : null}
            </div>
          )}
        />

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button className="mt-4" type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </Button>
          )}
        />
      </form>
    </div>
  )
}
