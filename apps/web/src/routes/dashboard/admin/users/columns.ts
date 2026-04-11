import type { ColumnDef } from "@tanstack/table-core";
import { createRawSnippet } from "svelte";
import { renderSnippet } from "$lib/components/ui/data-table/index.js";
import DataTableActions from "./data-table-actions.svelte";
import DataTableCheckbox from "./data-table-checkbox.svelte";
import { renderComponent } from "$lib/components/ui/data-table/index.js";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type UserRow = {
 id: string;
 name: string;
 email: string;
 tier: "free" | "scholar" | "library";
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
  accessorKey: "name",
  header: "Scribe Details",
  cell: ({ row }) => {
   const detailsSnippet = createRawSnippet<[{ name: string; email: string }]>(
    (getDetails) => {
     const { name, email } = getDetails();
     return {
      render: () =>
       `<div class="flex flex-col gap-1"><div class="font-medium">${name}</div><div class="text-muted-foreground text-sm lowercase">${email}</div></div>`,
     };
    }
   );

   return renderSnippet(detailsSnippet, {
    name: row.original.name,
    email: row.original.email,
   });
  },
 },
 {
  accessorKey: "tier",
  header: "API Tier",
  cell: ({ row }) => {
   const tierSnippet = createRawSnippet<[{ tier: string }]>((getTier) => {
    const { tier } = getTier();
    return {
     render: () =>
      `<span class="inline-flex rounded-md border px-2 py-1 text-xs font-medium capitalize">${tier}</span>`,
    };
   });

   return renderSnippet(tierSnippet, {
    tier: row.original.tier,
   });
  },
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