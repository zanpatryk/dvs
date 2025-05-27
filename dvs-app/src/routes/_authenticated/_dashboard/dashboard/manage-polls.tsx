import { SidebarTrigger } from '@/components/ui/sidebar'
import { createdPollsQueryOptions, pollsQueryOptions } from '@/lib/api'
import { columns } from '@/polls/columns'
import { DataTable } from '@/polls/data-table'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
    '/_authenticated/_dashboard/dashboard/manage-polls',
)({
    component: RouteComponent,
})

function RouteComponent() {
    const { isPending, error, data } = useQuery(createdPollsQueryOptions);

    	if (error) {
		return <div>Error: {error.message}</div>;
	}

    return (
        <>
            <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
                <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <h1 className="text-3xl font-bold">Manage Polls</h1>
                </div>
            </header>
            <div className="flex-1 p-6 bg-gray-100">
                <div className="py-10 bg-white rounded-md shadow-sm">
                    {data?.map((poll) => (
                        <DataTable columns={columns} data={data} />
                    ))}
                </div>
            </div>
        </>
    )
}
