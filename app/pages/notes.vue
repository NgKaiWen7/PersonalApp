<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <div>
    <!-- Default variant -->
    <Button>Click me</Button>

    <!-- Outline variant -->
    <Button variant="outline">Outline Button</Button>

    <!-- Destructive variant -->
    <Button variant="destructive">Delete Account</Button>
  </div>
</template>
