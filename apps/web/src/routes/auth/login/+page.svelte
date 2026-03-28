<script lang="ts">
 import type { PageData } from "./$types.js";
 import LoginForm from "./login-form.svelte";
 let { data }: { data: PageData } = $props();
</script>

<main class="relative grid min-h-screen items-center justify-center overflow-hidden px-6 py-12">
 <div
  aria-hidden="true"
  class="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl"
 ></div>
 <div
  aria-hidden="true"
  class="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-secondary/10 blur-3xl"
 ></div>
 <LoginForm {data} />
</main>
