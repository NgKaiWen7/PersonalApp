<template>
  <main class="min-h-screen bg-neutral-950 px-5 py-12 text-stone-100">
    <CardHeader class="mx-auto mb-8 max-w-6xl px-0">
      <CardTitle class="text-4xl font-bold tracking-tight text-amber-400 sm:text-5xl">{{ selectedYear }} Planning</CardTitle>
      <CardDescription class="text-stone-400">“Set your aim for the year. Plan the steps. Make each week count.”</CardDescription>
      <CardDescription class="mt-2 text-stone-500">
        {{ completedAimCount }} of {{ aimList.length }} weekly aims set for {{ selectedYear }}.
      </CardDescription>
    </CardHeader>
    <div class="sticky top-0 z-20 -mx-5 mb-6 bg-neutral-950 px-5 py-3">
      <Dialog>
        <Card class="mx-auto mb-3 w-full max-w-6xl gap-0 border-amber-400/40 bg-stone-900 py-0 transition-colors hover:border-amber-400">
          <DialogTrigger class="grid w-full cursor-pointer grid-cols-[5rem_minmax(0,1fr)] items-start gap-4 rounded-xl p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6 sm:p-6">
            <span class="flex flex-col items-start gap-2">
              <span class="rounded bg-amber-400 px-3 py-2 text-sm font-bold text-neutral-950">{{ selectedYear }}</span>
              <span class="text-xs font-semibold text-stone-400">Yearly aim</span>
            </span>
            <span class="min-w-0 whitespace-pre-wrap break-words text-stone-200">
                {{ yearlyAim.content || 'No yearly aim set yet.' }}
            </span>
          </DialogTrigger>
        </Card>
        <DialogContent class="max-h-[90dvh] overflow-y-auto border-stone-800 bg-stone-900 text-stone-100 sm:max-w-3xl sm:p-8">
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
              class="min-h-48 resize-y border-stone-700 bg-stone-950 text-stone-100 placeholder:text-stone-600 focus-visible:ring-amber-400 sm:min-h-64" />
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

      <div class="mx-auto max-w-6xl">
        <Tabs v-model="selectedYear">
          <TabsList class="w-full">
            <TabsTrigger class="flex-1" :value="String(currentYear - 1)">
              {{ currentYear - 1 }}
            </TabsTrigger>

            <TabsTrigger class="flex-1" :value="String(currentYear)">
              {{ currentYear }}
            </TabsTrigger>

            <TabsTrigger class="flex-1" :value="String(currentYear + 1)">
              {{ currentYear + 1 }}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>

    <p v-if="pending" class="mx-auto max-w-6xl rounded border border-stone-800 bg-stone-900 p-5 text-stone-400">Loading
      your aims…</p>
    <p v-else-if="error" class="mx-auto max-w-6xl rounded border border-red-900 bg-stone-900 p-5 text-red-300">Unable to
      load aims.</p>
    <section v-else class="mx-auto grid max-w-6xl grid-cols-1 gap-4">
      <div v-for="aim in aimList" :key="aim.weeknum"
        :ref="(aim.weeknum === currentWeek && aim.year == currentYear) ? 'currentWeekRef' : undefined">
        <Card class="gap-0 border-stone-800 bg-stone-900 py-0"
          :class="{ 'border-amber-400 ring-2 ring-amber-400': aim.weeknum === currentWeek }">
          <Dialog>
            <DialogTrigger class="grid min-h-40 w-full cursor-pointer grid-cols-[5rem_minmax(0,1fr)] items-start gap-x-4 gap-y-4 rounded-xl p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-x-6 sm:p-6">
              <span class="flex flex-col items-start gap-2">
                <span class="grid h-9 w-9 place-items-center rounded bg-amber-400 text-sm font-semibold text-neutral-950">{{
                  String(aim.weeknum).padStart(2, '0') }}</span>
                <span class="text-xs font-semibold text-stone-400">Week {{ aim.weeknum }}</span>
              </span>
              <span class="min-w-0 whitespace-pre-wrap break-words text-stone-200">
                  {{ aim.aims || 'No aim set yet.' }}
              </span>
              <span class="col-span-2 flex items-center justify-between self-end text-xs text-stone-500">
                <span>{{ aim.aims.length }}/50</span>
                <span :class="aim.aims.trim() ? 'text-amber-400' : ''">{{ aim.aims.trim() ? 'Set' : 'Not set' }}</span>
              </span>
            </DialogTrigger>
            <DialogContent class="max-h-[90dvh] overflow-y-auto border-stone-800 bg-stone-900 text-stone-100 sm:max-w-3xl sm:p-8">
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
                  class="min-h-48 resize-y border-stone-700 bg-stone-950 text-stone-100 placeholder:text-stone-600 focus-visible:ring-amber-400 sm:min-h-64" />
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
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
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
