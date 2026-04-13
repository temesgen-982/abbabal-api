<script lang="ts">
  import * as Avatar from "$lib/components/ui/avatar/index.js";

  let { src, name }: { src: string; name: string } = $props();

  const initials = name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
</script>

<Avatar.Root size="sm">
  <Avatar.Image src={src} alt={`${name}'s avatar`} />
  <Avatar.Fallback>{initials}</Avatar.Fallback>
</Avatar.Root>