"use client"

import { useActionState } from "react"
import { deleteSubject } from "./actions"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

const initialState = {
    error: "",
}

export function DeleteSubjectButton({ id }: { id: string }) {
    const [state, action, isPending] = useActionState(deleteSubject, initialState)

    return (
        <form action={action}>
            <input type="hidden" name="id" value={id} />
            <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                disabled={isPending}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
            {state?.error && (
                <span className="sr-only">Error: {state.error}</span>
            )}
        </form>
    )
}
