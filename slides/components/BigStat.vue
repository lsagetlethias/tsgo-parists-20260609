<script setup lang="ts">
// Grand chiffre-vedette : "78s → 7.5s".
defineProps<{ from: string; to: string; label?: string }>();
</script>

<template>
  <div>
    <div class="bigstat">
      <span class="from">{{ from }}</span>
      <span class="arrow">→</span>
      <span class="to">{{ to }}</span>
    </div>
    <div v-if="label" class="bigstat-label">{{ label }}</div>
  </div>
</template>
