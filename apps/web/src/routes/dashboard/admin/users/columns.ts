import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import { renderSnippet } from "$lib/components/ui/data-table/index.js";
import DataTableActions from "./data-table-actions.svelte";
import DataTableCheckbox from "./data-table-checkbox.svelte";
import { renderComponent } from "$lib/components/ui/data-table/index.js";
import UserAvatarCell from "$lib/components/table/user-avatar-cell.svelte";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type UserRow = {
 id: string;
 avatar: string;
 name: string;
 email: string;
 status: "active" | "suspended";
};
 
export const columns: ColumnDef<UserRow>[] = [
 {
  id: "select",
  header: ({ table }) =>
   renderComponent(DataTableCheckbox, {
    checked: table.getIsAllPageRowsSelected(),
    indeterminate:
     table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
    onCheckedChange: (value) => table.toggleAllPageRowsSelected(!!value),
    "aria-label": "Select all",
   }),
  cell: ({ row }) =>
   renderComponent(DataTableCheckbox, {
    checked: row.getIsSelected(),
    onCheckedChange: (value) => row.toggleSelected(!!value),
    "aria-label": "Select row",
   }),
  enableSorting: false,
  enableHiding: false,
 },
 {
  accessorKey: "avatar",
  header: "Avatar",
  cell: ({row}) => {
    renderComponent(UserAvatarCell, {
     src: row.original.avatar,
     name: row.original.name,
    });
  },
  enableSorting: false,
  enableHiding: false,
 },
 {
  accessorKey: "name",
  header: "Name",
  cell: ({row}) => {
    const name = row.original.name;
    return name;
  },
  enableSorting: true,
  enableHiding: true,
 },
 {
  accessorKey: "email",
  header: "Email",
  cell: ({row}) => {
    const email = row.original.email;
    return email;
  },
  enableSorting: true,
  enableHiding: true,
 },
 {
  accessorKey: "status",
  header: "Status",
  cell: ({ row }) => {
   const statusSnippet = createRawSnippet<[{ status: string }]>(
    (getStatus) => {
     const { status } = getStatus();
     const dotClass =
      status === "active" ? "bg-emerald-600" : "bg-destructive";
     return {
      render: () =>
       `<div class="flex items-center gap-2"><span class="${dotClass} size-2 rounded-full"></span><span class="capitalize">${status}</span></div>`,
     };
    }
   );

   return renderSnippet(statusSnippet, {
    status: row.original.status,
   });
  },
 },
 {
  id: "actions",
    header: () => {
     const actionsHeaderSnippet = createRawSnippet(() => ({
      render: () => `<div class="text-right">Administrative Actions</div>`,
     }));
     return renderSnippet(actionsHeaderSnippet);
    },
  enableHiding: false,
  cell: ({ row }) => {
     return renderComponent(DataTableActions, {
      id: row.original.id,
      status: row.original.status,
     });
  },
 },
];