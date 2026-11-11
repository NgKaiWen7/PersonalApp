<script setup lang="ts">
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const props = defineProps<{
  uuid: string;
  title: string;
  description: string;
}>();
const title = ref(props.title);
const description = ref(props.description);
const saved = ref(false);
let saveTimer: ReturnType<typeof setTimeout> | undefined;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    void updateTodo();
  }, 500);
}
async function updateTodo() {
  if (!props.uuid) {
    return;
  }

  await $fetch(`/api/todo/${props.uuid}`, {
    method: "PATCH",
    body: {
      title: title.value,
      description: description.value,
    },
  });
  saved.value = true;
  setTimeout(() => {
    saved.value = false;
  }, 1000);
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
  <Saved :show="saved" />
    <Input
      v-model="title"
      class="h-auto w-full rounded-none border-0 bg-transparent px-5 text-6xl font-bold shadow-none outline-none placeholder:text-slate-600 focus-visible:ring-0"
      placeholder="Title"
      @input="save"
    />
    <Textarea
      v-model="description"
      class="min-h-[60vh] w-full resize-none rounded-none border-0 bg-transparent px-5 text-xl font-bold leading-9 text-slate-300 shadow-none outline-none placeholder:text-slate-600 focus-visible:ring-0"
      placeholder="Write your day..."
      @input="save"
    />
</template>
