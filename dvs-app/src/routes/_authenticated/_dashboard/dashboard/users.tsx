import { UserRole } from '@/routes/_authenticated/_dashboard';
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute(
    '/_authenticated/_dashboard/dashboard/users',
)({
    component: RouteComponent,
})

function RouteComponent() {
    const [address, setAddress] = useState("");
    const [role, setRole] = useState<UserRole>(UserRole.User);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Replace this with actual backend call
        console.log("Updating role:", { address, role });
        setTimeout(() => setSubmitting(false), 1000); // Simulate async
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
            <form
                className="max-w-md bg-white rounded shadow p-6 flex flex-col gap-4"
                onSubmit={handleSubmit}
            >
                <label className="flex flex-col gap-1">
                    <span className="font-medium">Wallet Address</span>
                    <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        className="border rounded px-3 py-2"
                        placeholder="0x..."
                        required
                    />
                </label>
                <label className="flex flex-col gap-1">
                    <span className="font-medium">Role</span>
                    <select
                        value={role}
                        onChange={e => setRole(e.target.value as UserRole)}
                        className="border rounded px-3 py-2"
                    >
                        {Object.values(UserRole).map(r => (
                            <option key={r} value={r}>
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                            </option>
                        ))}
                    </select>
                </label>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    disabled={submitting}
                >
                    {submitting ? "Updating..." : "Update Role"}
                </button>
            </form>
        </div>
    )
}
