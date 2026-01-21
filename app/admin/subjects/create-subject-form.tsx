"use client"

import { useActionState } from "react"
import { createSubject } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const initialState = {
    error: "",
}

export function CreateSubjectForm() {
    const [state, action, isPending] = useActionState(createSubject, initialState)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Subject</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={action} className="flex gap-4 items-end">
                    <div className="grid gap-2 flex-1">
                        <label htmlFor="name" className="text-sm font-medium">
                            Name
                        </label>
                        <Input id="name" name="name" placeholder="Mathematics" required />
                    </div>
                    <div className="grid gap-2 flex-[2]">
                        <label htmlFor="description" className="text-sm font-medium">
                            Description
                        </label>
                        <Input
                            id="description"
                            name="description"
                            placeholder="Algebra, Calculus, and Geometry..."
                        />
                    </div>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Creating..." : "Create Subject"}
                    </Button>
                </form>
                {state?.error && (
                    <p className="text-sm text-red-500 mt-2">{state.error}</p>
                )}
            </CardContent>
        </Card>
    )
}
