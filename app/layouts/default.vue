<script setup lang="ts">
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarRail,
} from "@/components/ui/sidebar"

import {
  Home,
  CheckSquare,
  Dumbbell,
  BookOpen,
  FileText,
} from "@lucide/vue"

const { data: quote } = await useFetch("/api/quote")

const navigation = [
  { title: "Home", url: "/", icon: Home },
  { title: "TO DO", url: "/todo", icon: CheckSquare },
  { title: "Workouts", url: "/workout", icon: Dumbbell },
  { title: "Readings", url: "/readings", icon: BookOpen },
  { title: "Notes", url: "/notes", icon: FileText },
]
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <SidebarProvider>
      <Sidebar
        collapsible="offcanvas"
        variant="sidebar"
        class="border-white/[0.08] bg-black"
      >
        <!-- Header -->
        <SidebarHeader class="border-b border-white/[0.08] p-3">
          <div class="flex items-center gap-2 px-1 py-2">
            <span class="shrink-0 text-2xl">🦜</span>

            <div class="grid min-w-0 flex-1 text-left">
              <span class="truncate text-sm font-semibold">
                Personal App
              </span>
              <span class="truncate text-xs text-neutral-500">
                Knowledge & Productivity
              </span>
            </div>
          </div>
        </SidebarHeader>

        <!-- Navigation -->
        <SidebarContent class="bg-black">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu class="gap-2">
                <SidebarMenuItem
                  v-for="item in navigation"
                  :key="item.url"
                >
                  <SidebarMenuButton
                    as-child
                    :tooltip="item.title"
                    class="h-11 text-base text-neutral-300 hover:bg-white/[0.06] hover:text-white data-[active=true]:bg-white/[0.08] data-[active=true]:text-[#C5A24A]"
                  >
                    <NuxtLink
                      :to="item.url"
                      active-class="text-[#C5A24A]"
                      exact-active-class="bg-white/[0.08] text-[#C5A24A]"
                    >
                      <component :is="item.icon" />
                      <span>{{ item.title }}</span>
                    </NuxtLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <!-- Footer -->
        <SidebarFooter class="border-t border-white/[0.08] p-3">
          <p class="truncate text-xs text-neutral-600">
            Stay curious.
          </p>
        </SidebarFooter>

        <!-- Desktop collapse control -->
        <SidebarRail />
      </Sidebar>

      <!-- Main content -->
      <SidebarInset class="min-w-0 bg-black text-white">
        <header class="flex h-16 items-center gap-3 px-6">
          <SidebarTrigger
            class="shrink-0 text-white hover:bg-white/[0.06] hover:text-[#C5A24A]"
          />

          <Transition
            appear
            enter-active-class="transition-all duration-[1200ms] ease-out"
            enter-from-class="translate-x-[-16px] opacity-0"
            enter-to-class="translate-x-0 opacity-100"
          >
            <div
              v-if="quote"
              class="min-w-0 flex-1 overflow-x-auto scrollbar-none"
            >
              <p
                class="w-max whitespace-nowrap text-sm font-semibold tracking-wide text-[#C5A24A]"
              >
                {{ quote.q }}
                <span class="text-neutral-600">
                  — {{ quote.a }}
                </span>
              </p>
            </div>
          </Transition>
        </header>

        <main class="min-w-0 flex-1 p-4 md:p-6">
          <slot />
        </main>
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>
