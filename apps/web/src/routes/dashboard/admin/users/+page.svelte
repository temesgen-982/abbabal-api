<script lang="ts">
 import DataTable from "./data-table.svelte";
 import { columns } from "./columns";
 
 let { data } = $props();
</script>
 
<section>
	<h1 class="text-3xl">User Management</h1>
</section>

<DataTable data={data.users} {columns} />