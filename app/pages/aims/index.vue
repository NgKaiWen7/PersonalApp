<template>
  <main class="min-h-screen bg-neutral-950 px-5 py-12 text-stone-100">
    <CardHeader class="mx-auto mb-8 max-w-6xl px-0">
      <CardDescription class="font-bold uppercase tracking-widest text-amber-400">{{ selectedYear }} planning
      </CardDescription>
      <CardTitle class="text-4xl tracking-tight">Weekly aims</CardTitle>
      <CardDescription class="text-stone-400">One meaningful intention for every week.</CardDescription>
      <CardDescription class="mt-2 text-stone-500">
        {{ completedAimCount }} of {{ aimList.length }} weekly aims set for {{ selectedYear }}.
      </CardDescription>
    </CardHeader>
    <div class="sticky top-0 z-20 -mx-5 mb-6 bg-neutral-950 px-5 py-3">
      <Dialog>
        <DialogTrigger as-child>
          <Card class="mb-3 cursor-pointer border-amber-400/40 bg-stone-900 transition-colors hover:border-amber-400">
            <CardHeader class="pb-3">
              <div class="flex items-center justify-between gap-4">
                <CardTitle class="text-lg">Yearly aim</CardTitle>
                <span class="text-xs font-semibold text-stone-500">{{ selectedYear }}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p class="whitespace-pre-wrap break-words text-left text-stone-200">
                {{ yearlyAim.content || 'No yearly aim set yet.' }}
              </p>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent class="border-stone-800 bg-stone-900 text-stone-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{{ selectedYear }} yearly aim</DialogTitle>
            <DialogDescription class="text-stone-400">
              Choose the main intention you want to guide this year.
            </DialogDescription>
          </DialogHeader>

          <div class="space-y-2">
            <label :for="`edit-year-${selectedYear}`" class="text-sm font-medium text-stone-300">
              Your yearly aim
            </label>
            <Textarea :id="`edit-year-${selectedYear}`" v-model="yearlyAim.content" maxlength="200"
              :placeholder="`Aim for ${selectedYear}`"
              class="min-h-32 resize-none border-stone-700 bg-stone-950 text-stone-100 placeholder:text-stone-600 focus-visible:ring-amber-400" />
            <p class="text-right text-xs text-stone-500">{{ yearlyAim.content.length }}/200</p>
          </div>

          <DialogFooter>
            <DialogClose as-child>
              <Button type="button"
                class="bg-amber-400 px-5 text-sm font-semibold text-neutral-950 hover:bg-amber-300"
                @click="saveYearlyAim(yearlyAim)">
                Done
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs v-model="selectedYear">
        <TabsList>
          <TabsTrigger :value="String(currentYear - 1)">
            {{ currentYear - 1 }}
          </TabsTrigger>

          <TabsTrigger :value="String(currentYear)">
            {{ currentYear }}
          </TabsTrigger>

          <TabsTrigger :value="String(currentYear + 1)">
            {{ currentYear + 1 }}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>

    <p v-if="pending" class="mx-auto max-w-6xl rounded border border-stone-800 bg-stone-900 p-5 text-stone-400">Loading
      your aims…</p>
    <p v-else-if="error" class="mx-auto max-w-6xl rounded border border-red-900 bg-stone-900 p-5 text-red-300">Unable to
      load aims.</p>
    <section v-else class="mx-auto grid max-w-3xl grid-cols-1 gap-4">
      <div v-for="aim in aimList" :key="aim.weeknum"
        :ref="(aim.weeknum === currentWeek && aim.year == currentYear) ? 'currentWeekRef' : undefined">
        <Card class="min-h-40 border-stone-800 bg-stone-900"
          :class="{ 'border-amber-400 ring-2 ring-amber-400': aim.weeknum === currentWeek }">
          <Dialog>
            <DialogTrigger asChild>
              <CardHeader class="flex-row items-center justify-between">
                <CardTitle class="grid h-9 w-9 place-items-center rounded bg-amber-400 text-sm text-neutral-950">{{
                  String(aim.weeknum).padStart(2, '0') }}</CardTitle>
                <span class="text-xs font-semibold text-stone-400">Week {{ aim.weeknum }}</span>
              </CardHeader>
              <CardContent>
                <p class="min-h-12 whitespace-pre-wrap break-words text-left text-stone-200">
                  {{ aim.aims || 'No aim set yet.' }}
                </p>
              </CardContent>
              <CardFooter class="justify-between text-xs text-stone-600">
                <span>{{ aim.aims.length }}/50</span>
                <span :class="aim.aims.trim() ? 'text-amber-400' : ''">{{ aim.aims.trim() ? 'Set' : 'Not set' }}</span>
              </CardFooter>
            </DialogTrigger>
            <DialogContent class="border-stone-800 bg-stone-900 text-stone-100 sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Week {{ aim.weeknum }} aim</DialogTitle>
                <DialogDescription class="text-stone-400">
                  Choose one clear intention for this week. Keep it under 50 characters.
                </DialogDescription>
              </DialogHeader>

              <div class="space-y-2">
                <label :for="`edit-week-${aim.weeknum}`" class="text-sm font-medium text-stone-300">
                  Your aim
                </label>
                <Textarea :id="`edit-week-${aim.weeknum}`" v-model="aim.aims" maxlength="50"
                  :placeholder="`Aim for week ${aim.weeknum}`"
                  class="min-h-32 resize-none border-stone-700 bg-stone-950 text-stone-100 placeholder:text-stone-600 focus-visible:ring-amber-400" />
                <p class="text-right text-xs text-stone-500">{{ aim.aims.length }}/50</p>
              </div>

              <DialogFooter>
                <DialogClose as-child>
                  <Button type="button"
                    class="bg-amber-400 px-5 text-sm font-semibold text-neutral-950 hover:bg-amber-300"
                    @click="saveAim(aim)">
                    Done
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, useTemplateRef } from "vue";
import getWeeksInYear from "~/utils/getWeeksInYear";
import getWeekNumber from "~/utils/getWeekNumber";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Button } from "@/components/ui/button";
const currentYear: number = new Date().getFullYear()
const selectedYear = ref(String(currentYear));
const year = computed(() => Number(selectedYear.value));
interface Aim {
  id?: number;
  weeknum: number;
  year: number;
  aims: string;
}

interface YearlyAim {
  year: number;
  content: string;
}

const currentWeek: Number = getWeekNumber();
const currentWeekRef = useTemplateRef<HTMLElement[]>('currentWeekRef');
onMounted(async () => {
  await nextTick();
  const element = currentWeekRef.value?.[0];
  element?.scrollIntoView({behavior: "smooth",block: "center",});
});


const {
  data: aims,
  pending,
  error,
  refresh,
} = await useFetch<Aim[]>("/api/weeklyaim", {
  query: { year: year },
});
const aimList = computed<Aim[]>(() => {
  const totalWeeks = getWeeksInYear(year.value);
  return Array.from({ length: totalWeeks }, (_, index) => {
    const weeknum = index + 1;
    const existingAim = aims.value?.find(
      (aim) =>
        aim.weeknum === weeknum &&
        Number(aim.year) === year.value,
    );

    return (
      existingAim ?? {
        weeknum,
        year: year.value,
        aims: "",
      }
    );
  });
});

const completedAimCount = computed(() =>
  aimList.value.filter((aim) => aim.aims.trim().length > 0).length,
);

const {
  data: yearlyAim,
  refresh: refreshYearlyAim,
} = await useFetch<YearlyAim>("/api/yearlyaim", {
  query: { year },
  default: () => ({
    year: year.value,
    content: "",
  }),
});

async function saveAim(aim: Aim) {
  if (aim.id == null) {
    const result = await $fetch<{ id: number }[]>('/api/weeklyaim', {
      method: 'POST',
      body: {
        weeknum: aim.weeknum,
        year: aim.year,
        aims: aim.aims,
      },
    });

    // The next save should update this row instead of inserting another one.
    aim.id = result[0]?.id;
  } else {
    await $fetch('/api/weeklyaim', {
      method: 'PATCH',
      body: {
        id: aim.id,
        aims: aim.aims,
      },
    });
  }
  await refresh();
}

async function saveYearlyAim(aim: YearlyAim) {
  const savedAim = await $fetch<YearlyAim>("/api/yearlyaim", {
    method: "POST",
    body: {
      year: aim.year,
      content: aim.content,
    },
  });

  yearlyAim.value = savedAim;
  await refreshYearlyAim();
}

</script>
