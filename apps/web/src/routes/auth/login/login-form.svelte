<script lang="ts">
 import AuthPaperStack from "$lib/components/auth/AuthPaperStack.svelte";
 import * as Form from "$lib/components/ui/form/index.js";
 import { Input } from "$lib/components/ui/input/index.js";
 import { formSchema, type FormSchema } from "./schema.js";
 import {
  type SuperValidated,
  type Infer,
  superForm,
 } from "sveltekit-superforms";
 import { zod4Client } from "sveltekit-superforms/adapters";
 
 let {
  data,
 }: {
  data: {
   form: SuperValidated<Infer<FormSchema>>;
   authError?: string;
  };
 } =
  $props();
 
 // svelte-ignore state_referenced_locally
 const form = superForm(data.form, {
  validators: zod4Client(formSchema),
 });
 
 const { form: formData, enhance } = form;
</script>

<AuthPaperStack subtitle="Login Authentication" title="Abbabal API">
 <form method="POST" use:enhance class="grid gap-6">
  <Form.Field {form} name="username">
   <Form.Control>
    {#snippet children({ props })}
     <Form.Label>Username</Form.Label>
     <Input
      {...props}
      bind:value={$formData.username}
      variant="underline"
     />
    {/snippet}
   </Form.Control>
   <Form.FieldErrors />
  </Form.Field>
  <Form.Field {form} name="password">
   <Form.Control>
    {#snippet children({ props })}
     <Form.Label>Password</Form.Label>
     <Input
      {...props}
      bind:value={$formData.password}
      type="password"
      variant="underline"
     />
    {/snippet}
   </Form.Control>
   <Form.FieldErrors />
  </Form.Field>
  {#if data.authError}
   <p class="text-destructive text-sm">{data.authError}</p>
  {/if}
  <Form.Button class="w-full py-4 font-bold uppercase tracking-[0.2em]">
   Log In
  </Form.Button>
 </form>
</AuthPaperStack>
