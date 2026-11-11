<template>
  <main class="min-h-screen bg-neutral-950 px-5 py-12 text-stone-100">
    <CardHeader class="mx-auto mb-8 max-w-6xl px-0">
      <CardDescription class="font-bold uppercase tracking-widest text-amber-400">{{ year }} planning</CardDescription>
      <CardTitle class="text-4xl tracking-tight">Weekly aims</CardTitle>
      <CardDescription class="text-stone-400">One meaningful intention for every week.</CardDescription>
    </CardHeader>

    <p v-if="pending" class="mx-auto max-w-6xl rounded border border-stone-800 bg-stone-900 p-5 text-stone-400">Loading
      your aims…</p>
    <p v-else-if="error" class="mx-auto max-w-6xl rounded border border-red-900 bg-stone-900 p-5 text-red-300">Unable to
      load aims.</p>

    <section v-else class="mx-auto grid max-w-3xl grid-cols-1 gap-4">
      <Card v-for="aim in aimList" :key="aim.weeknum" class="min-h-40 border-stone-800 bg-stone-900"
        :class="{ 'border-amber-400': aim.aims.trim() }">
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
              <Textarea
                :id="`edit-week-${aim.weeknum}`"
                v-model="aim.aims"
                maxlength="50"
                :placeholder="`Aim for week ${aim.weeknum}`"
                class="min-h-32 resize-none border-stone-700 bg-stone-950 text-stone-100 placeholder:text-stone-600 focus-visible:ring-amber-400"
              />
              <p class="text-right text-xs text-stone-500">{{ aim.aims.length }}/50</p>
            </div>

            <DialogFooter>
              <DialogClose as-child>
                <Button class="bg-amber-400 px-5 text-sm font-semibold text-neutral-950 hover:bg-amber-300">
                  Done
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </section>
  </main>
</template>

<script lang="ts" setup>
import getWeeksInYear from "~/utils/getWeeksInYear";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "~/components/ui/button";
const year: number = new Date().getFullYear()
interface Aim {
  id?: number;
  weeknum: number;
  year: number;
  aims: string;
}

const {
  data: aims,
  pending,
  error,
  refresh,
} = await useFetch<Aim[]>("/api/weeklyaim", {
  query: {
    year: year
  },
});
const totalWeeks = getWeeksInYear(year);

const aimList: Aim[] = Array.from(
  { length: totalWeeks },
  (_, index) => {
    const weeknum = index + 1;

    const existingAim = aims.value?.find(
      (aim) => aim.weeknum === weeknum,
    );

    return (
      existingAim ?? {
        weeknum,
        year,
        aims: "",
      }
    );
  },
);
</script>
