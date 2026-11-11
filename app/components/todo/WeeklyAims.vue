<template>
  <div class="grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-4">
    <Card>
      <CardHeader>
        Week {{ getISOWeekNumber(new Date(), -1) }}
      </CardHeader>
      <CardContent></CardContent>
    </Card>
    <Card>
      <CardHeader>
        Week {{ getISOWeekNumber(new Date(), 0) }}
      </CardHeader>
      <CardContent></CardContent>
    </Card>
    <Card>
      <CardHeader>
        Week {{ getISOWeekNumber(new Date(), 1) }}
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { getISOWeekNumber } from "@/utils/getWeekNumber";
import CardContent from "../ui/card/CardContent.vue";

</script>

<style></style>
