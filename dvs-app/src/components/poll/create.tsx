import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { client } from "@/hono-client"
import { apiCall } from "@/lib/api"
import { queryClient } from "@/main"
import { zodResolver } from "@hookform/resolvers/zod"
import { DialogClose } from "@radix-ui/react-dialog"
import { Plus, X } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

const FormSchema = z.object({
    title: z.string().min(1, {
        message: "Title cannot be empty",
    }),
    description: z.string(),
    options: z
        .array(z.object({ value: z.string().min(1, { message: "Option cannot be empty" }) }))
        .min(1, { message: "At least one option is required" })
        .max(10, { message: "You can add up to 10 options" }),
    endTime: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    managerIncluded: z.boolean(),
    participantLimit: z.coerce.number().min(1, { message: "Participant limit must be at least 1" }),
});

const CreatePoll = () => {

    type FormType = z.infer<typeof FormSchema>;

    const form = useForm<FormType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            title: "",
            description: "",
            options: [],
            endTime: "",
            managerIncluded: false,
            participantLimit: 100,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "options",
    })

    async function onSubmit(data: FormType) {
        console.log(JSON.stringify(data, null, 2))

        const res = await apiCall(() => client.api.polls.$post({ json: data }))

        if (!res.ok) {
            throw new Error(`Error ${res.status}`);
        }

        const asdas = await res.json()

        queryClient.invalidateQueries({ queryKey: ["get-created-polls"] })

        console.log(asdas)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <h2 className="text-3xl font-bold">Create Poll</h2>
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Title*
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Poll #1" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Description*
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Enter the poll description"
                                    rows={4}
                                    {...field}
                                    className="overflow-auto resize-none"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormItem>
                    <FormLabel>
                        Options*
                    </FormLabel>
                    <div className="space-y-2">
                        {fields.map((field, idx) => (
                            <div key={field.id} className="flex items-center space-x-2">
                                <FormField
                                    control={form.control}
                                    name={`options.${idx}.value` as const}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input placeholder={`Option #${idx + 1}`} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {fields.length > 1 && (
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => remove(idx)}
                                    >
                                        <X size={16} />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        disabled={fields.length >= 10}
                        onClick={() => append({ value: "" })}
                    >
                        <Plus size={16} className="mr-2" /> Add option
                    </Button>
                </FormItem>
                <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>End Time*</FormLabel>
                            <FormControl>
                                <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="participantLimit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Participant Limit*</FormLabel>
                            <FormControl>
                                <Input type="number" min={1} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="managerIncluded"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="mb-0">
                                Manager included as a participant
                            </FormLabel>
                        </FormItem>
                    )}
                />
                {form.formState.isValid ? (
                    <div className="flex space-x-4">
                        <DialogClose>
                            <Button type="submit" className="bg-green-500 hover:bg-green-600">+ Create</Button>
                        </DialogClose>
                        <DialogClose>
                            <Button type="button" className="bg-red-500 hover:bg-red-600" variant="destructive">× Cancel</Button>
                        </DialogClose>
                    </div>
                ) : (
                    <div className="flex space-x-4">
                        <Button type="submit" className="bg-green-500 hover:bg-green-600" disabled>+ Create</Button>
                        <DialogClose>
                            <Button type="button" className="bg-red-500 hover:bg-red-600" variant="destructive">× Cancel</Button>
                        </DialogClose>
                    </div>
                )}
            </form>
        </Form>
    )
}

export default CreatePoll