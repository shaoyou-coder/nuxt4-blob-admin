<template>
  <div class="preview-img-wrapper" v-viewer>
    <img class="preview-img" v-for="src in imgarr" :src="src" :key="src">
  </div>
</template>

<script setup lang="ts">
type Props = {
  img: string | undefined
};
const props = defineProps<Props>();
const { img } = toRefs(props);
const imgarr = computed(() => {
  if (!img.value) {
    return [];
  }
  return [img.value];
});

</script>

<style scoped>
.preview-img {
  max-width: 200px;
  max-height: 150px;
}
</style>