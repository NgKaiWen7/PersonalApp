<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const route = useRoute();

const id = computed(() => String(route.params.id));
</script>
<template>
    <div class="min-h-screen bg-[#0D0D0B] text-amber-50">
        <!-- Back navigation -->
        <div class="px-6 pt-6 md:px-8">
            <NuxtLink
                to="/readings"
                class="inline-flex items-center gap-2 text-sm text-stone-400 transition-colors hover:text-amber-300"
            >
                <span class="text-amber-500">←</span>
                <span>Back to Readings</span>
            </NuxtLink>
        </div>

        <!-- Main content -->
        <div class="flex flex-col gap-6 p-6 md:p-8">
            <Tabs default-value="chat" class="flex w-full flex-col gap-6">
                <!-- Tab navigation -->
                <TabsList
                    class="flex h-auto w-full justify-start gap-2 rounded-xl border border-amber-500/20 bg-[#171610] p-2"
                >
                    <TabsTrigger
                        value="chat"
                        class="flex-1 rounded-lg px-5 py-3 text-sm font-medium text-stone-400 transition-all data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#3A3020] data-[state=active]:to-[#242016] data-[state=active]:text-amber-200 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-amber-500/30"
                    >
                        Chat
                    </TabsTrigger>

                    <TabsTrigger
                        value="memory-card"
                        class="flex-1 rounded-lg px-5 py-3 text-sm font-medium text-stone-400 transition-all data-[state=active]:bg-gradient-to-br data-[state=active]:from-[#3A3020] data-[state=active]:to-[#242016] data-[state=active]:text-amber-200 data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-amber-500/30"
                    >
                        Memory Cards
                    </TabsTrigger>
                </TabsList>

                <!-- Chat tab -->
                <TabsContent
                    value="chat"
                    class="mt-0 flex-1 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-[#191810] to-[#0D0D0B] p-4 shadow-lg shadow-black/20 focus-visible:outline-none md:p-6"
                >
                    <ReadingChatBotPage :book-id="id" />
                </TabsContent>

                <!-- Memory card tab -->
                <TabsContent
                    value="memory-card"
                    class="mt-0 flex-1 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-[#191810] to-[#0D0D0B] p-4 shadow-lg shadow-black/20 focus-visible:outline-none md:p-6"
                >
                    <ReadingMemoryCardPage :book-id="id" />
                </TabsContent>
            </Tabs>
        </div>
    </div>
</template>
