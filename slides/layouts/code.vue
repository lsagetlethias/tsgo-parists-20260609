<script setup lang="ts">
// Layout "éditeur de code" : barre d'onglet (nom de fichier via frontmatter
// `file:`), gouttière de numéros de ligne (décorative), contenu.
defineProps<{ file?: string }>();
const lines = Array.from({ length: 18 }, (_, i) => i + 1);
</script>

<template>
  <div class="slidev-layout code-layout">
    <div class="editor-tabs">
      <span class="tab active">{{ file ?? "slide.ts" }}</span>
      <span class="tab-meta">Paris TypeScript · 09/06/2026</span>
    </div>
    <div class="editor-body">
      <div class="editor-gutter">
        <span v-for="n in lines" :key="n">{{ n }}</span>
      </div>
      <div class="editor-content">
        <slot />
      </div>
    </div>
  </div>
</template>
