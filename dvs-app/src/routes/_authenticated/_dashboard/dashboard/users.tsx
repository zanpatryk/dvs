import { Form, FormField } from '@/components/ui/form';
import { UserRole } from '@/routes/_authenticated/_dashboard';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const Route = createFileRoute(
    '/_authenticated/_dashboard/dashboard/users',
)({
    component: RouteComponent,
})

const formSchema = z.object({
    address: z.string().min(1, 'Address is required'),
    role: z.nativeEnum(UserRole, {
        errorMap: (issue, ctx) => {
            if (issue.code === 'invalid_type') {
                return { message: 'Invalid role selected' };
            }
            return { message: ctx.defaultError };
        }
    }),
});

function RouteComponent() {
    const [address, setAddress] = useState("");
    const [role, setRole] = useState<UserRole>(UserRole.User);
    const [submitting, setSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            address: '',
            role: UserRole.User,
        },
    });

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        console.log("Updating role:", data);
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header Section */}
            <div className="mb-6 flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Manage Users
                </h1>
            </div>

            {/* Main Content Section */}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">User Address</label>
                                <input
                                    type="text"
                                    {...field}
                                    value={field.value}
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        setAddress(e.target.value);
                                    }}
                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0xe621324665fbb008bef14ffaff85029d5dddc61d"
                                />
                            </div>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <div className="flex flex-col mt-4">
                                <label className="text-sm font-medium text-gray-700 mb-1">User Role</label>
                                <select
                                    {...field}
                                    value={field.value}
                                    onChange={(e) => {
                                        field.onChange(e.target.value as UserRole);
                                        setRole(e.target.value as UserRole);
                                    }}
                                    className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {Object.values(UserRole).map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    />
                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                submitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {submitting ? 'Updating...' : 'Update Role'}
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
