<script setup lang="ts">
const props = defineProps<{
  title: string;
  description: string;
}>();
const emit = defineEmits<{
  change: [title: string, description: string];
}>();
const title = ref(props.title);
const description = ref(props.description);
let saveTimer: ReturnType<typeof setTimeout> | undefined;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    emit("change", title.value, description.value);
  }, 500);
}
watch(
  () => props.title,
  (value) => {
    title.value = value;
  },
);
watch(
  () => props.description,
  (value) => {
    description.value = value;
  },
);
</script>

<template>
  <div class="flex min-h-full w-full flex-col bg-[#191A33] px-4 py-6 text-white">
    <input
      v-model="title"
      class="mb-4 w-full border-0 bg-transparent text-3xl font-semibold outline-none placeholder:text-slate-600"
      placeholder="Title"
      @change="save"
    />
    <textarea
      v-model="description"
      class="min-h-[60vh] w-full resize-none border-0 bg-transparent text-lg leading-8 text-slate-300 outline-none placeholder:text-slate-600"
      placeholder="Write your day..."
      @change="save"
    />
  </div>
</template>
