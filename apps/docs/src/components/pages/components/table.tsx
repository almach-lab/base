import * as React from "react";
import { Badge, Button, Checkbox, Table, type ColumnDef } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

/* ── Sample data ──────────────────────────────────────────────────────────── */
type User = {
	id: string;
	name: string;
	email: string;
	role: "admin" | "member" | "viewer";
	status: "active" | "inactive";
};

const USERS: User[] = [
	{ id: "1", name: "Alice Johnson", email: "alice@example.com", role: "admin", status: "active" },
	{ id: "2", name: "Bob Smith", email: "bob@example.com", role: "member", status: "active" },
	{ id: "3", name: "Carol White", email: "carol@example.com", role: "viewer", status: "inactive" },
	{ id: "4", name: "Dave Brown", email: "dave@example.com", role: "member", status: "active" },
	{ id: "5", name: "Eve Davis", email: "eve@example.com", role: "viewer", status: "active" },
	{ id: "6", name: "Frank Miller", email: "frank@example.com", role: "member", status: "inactive" },
];

const STATUS_VARIANT: Record<User["status"], "success" | "ghost"> = {
	active: "success",
	inactive: "ghost",
};

const userColumns: ColumnDef<User>[] = [
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "email",
		header: "Email",
		cell: ({ row }) => (
			<span className="text-muted-foreground">{row.getValue("email")}</span>
		),
	},
	{
		accessorKey: "role",
		header: "Role",
		cell: ({ row }) => (
			<span className="capitalize">{row.getValue("role")}</span>
		),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.getValue<User["status"]>("status");
			return (
				<Badge variant={STATUS_VARIANT[status]} className="capitalize">
					{status}
				</Badge>
			);
		},
	},
];

export function TablePage() {
	return (
		<ComponentDoc
			name="Table"
			description="HTML table primitives plus a DataTable component powered by TanStack Table. Supports sorting, filtering, pagination, and row selection."
			pkg="@almach/ui"
			examples={[
				{
					title: "DataTable",
					description:
						"Pass columns and data to Table.Data. TanStack Table handles everything else.",
					preview: (
						<Table.Data columns={userColumns} data={USERS} />
					),
					code: `const columns: ColumnDef<User>[] = [
  { accessorKey: "name",   header: "Name"   },
  { accessorKey: "email",  header: "Email"  },
  { accessorKey: "role",   header: "Role"   },
  { accessorKey: "status", header: "Status",
    cell: ({ row }) => <Badge>{row.getValue("status")}</Badge> },
];

<Table.Data columns={columns} data={users} />`,
				},
				{
					title: "Sortable + filterable",
					description: "Enable sortable and filterable on Table.Data.",
					preview: (
						<Table.Data
							columns={userColumns}
							data={USERS}
							sortable
							filterable
						/>
					),
					code: `<Table.Data
  columns={columns}
  data={users}
  sortable
  filterable
/>`,
				},
				{
					title: "Paginated",
					description: "Add paginated and set pageSize to split data across pages.",
					preview: (
						<Table.Data
							columns={userColumns}
							data={USERS}
							sortable
							paginated
							pageSize={3}
						/>
					),
					code: `<Table.Data
  columns={columns}
  data={users}
  sortable
  paginated
  pageSize={3}
/>`,
				},
				{
					title: "Primitive table",
					description:
						"Compose with Table.Header, Table.Body, Table.Row etc. for full control.",
					preview: (
						<Table>
							<Table.Header>
								<Table.Row>
									<Table.Head>Name</Table.Head>
									<Table.Head>Email</Table.Head>
									<Table.Head>Status</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								{USERS.slice(0, 3).map((u) => (
									<Table.Row key={u.id}>
										<Table.Cell className="font-medium">{u.name}</Table.Cell>
										<Table.Cell className="text-muted-foreground">{u.email}</Table.Cell>
										<Table.Cell>
											<Badge variant={STATUS_VARIANT[u.status]} className="capitalize">
												{u.status}
											</Badge>
										</Table.Cell>
									</Table.Row>
								))}
							</Table.Body>
						</Table>
					),
					code: `<Table>
  <Table.Header>
    <Table.Row>
      <Table.Head>Name</Table.Head>
      <Table.Head>Status</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {users.map((u) => (
      <Table.Row key={u.id}>
        <Table.Cell>{u.name}</Table.Cell>
        <Table.Cell><Badge>{u.status}</Badge></Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>`,
				},
			]}
			props={[
				{
					name: "Table.Data › columns",
					type: "ColumnDef<TData>[]",
					required: true,
					description: "TanStack Table column definitions.",
				},
				{
					name: "Table.Data › data",
					type: "TData[]",
					required: true,
					description: "Array of row data objects.",
				},
				{
					name: "Table.Data › sortable",
					type: "boolean",
					description: "Enable column header sorting.",
				},
				{
					name: "Table.Data › filterable",
					type: "boolean",
					description: "Show global search input and enable filtering.",
				},
				{
					name: "Table.Data › paginated",
					type: "boolean",
					description: "Enable pagination with Previous / Next controls.",
				},
				{
					name: "Table.Data › pageSize",
					type: "number",
					default: "10",
					description: "Rows per page when paginated.",
				},
			]}
		/>
	);
}
