<script setup lang="ts">
const router = useRouter();
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
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Home, Target, CheckSquare, BookOpen, FileText, LogOut } from "@lucide/vue";

const navigation = [
    { title: "Home", url: "/", icon: Home },
    { title: "Aims", url: "/aims", icon: Target },
    { title: "TO DO", url: "/todo", icon: CheckSquare },
    { title: "Memory Cards", url: "/memorycard", icon: BookOpen },
    { title: "Readings", url: "/readings", icon: BookOpen },
    { title: "Notes", url: "/notes", icon: FileText },
];
async function handleLogout() {
    try {
        await $fetch("/api/auth/logout", { method: "POST" });
        await router.replace("/login");
    } catch (error) {
        console.error("Logout failed:", error);
    }
}
</script>

<template>
    <div class="dark min-h-screen bg-[#09090b] text-white">
        <SidebarProvider>
            <Sidebar
                collapsible="offcanvas"
                variant="sidebar"
                class="border-white/[0.08] bg-[#111113]"
            >
                <!-- Header -->
                <SidebarHeader class="border-b border-white/[0.08] p-4">
                    <div class="flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-3">
                        <div class="flex size-10 shrink-0 items-center justify-center text-2xl drop-shadow-[0_4px_10px_rgba(197,162,74,0.28)]">
                            🦜
                        </div>

                        <div class="grid min-w-0 flex-1 text-left">
                            <span class="truncate text-sm font-semibold tracking-tight text-white">
                                Personal Knowledge
                            </span>
                            <span class="truncate text-xs text-neutral-500">
                                Your second brain
                            </span>
                        </div>
                    </div>
                </SidebarHeader>

                <!-- Navigation -->
                <SidebarContent class="bg-[#111113] px-3 py-5">
                    <SidebarGroup class="p-0">
                        <div class="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-600">
                            Workspace
                        </div>
                        <SidebarGroupContent>
                            <SidebarMenu class="gap-1.5">
                                <SidebarMenuItem
                                    v-for="item in navigation"
                                    :key="item.url"
                                >
                                    <SidebarMenuButton
                                        as-child
                                        :tooltip="item.title"
                                        class="h-11 rounded-xl px-3 text-sm font-medium text-neutral-400 transition-colors hover:bg-white/[0.06] hover:text-white data-[active=true]:bg-[#C5A24A]/10 data-[active=true]:text-[#D8B65A]"
                                    >
                                        <NuxtLink
                                            :to="item.url"
                                            class="flex h-full w-full items-center gap-3"
                                            active-class="text-[#D8B65A]"
                                            exact-active-class="bg-[#C5A24A]/10 text-[#D8B65A]"
                                        >
                                            <component :is="item.icon" class="size-[18px]" />
                                            <span>{{ item.title }}</span>
                                        </NuxtLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <!-- Footer -->
                <SidebarFooter class="border-t border-white/[0.08] bg-[#0d0d0f] p-3">
                    <Button
                        variant="ghost"
                        class="h-11 w-full justify-start gap-3 rounded-xl px-3 text-sm font-medium text-neutral-400 hover:bg-red-500/10 hover:text-red-300"
                        @click="handleLogout"
                    >
                        <LogOut class="size-4" />
                        <span>Log out</span>
                    </Button>
                </SidebarFooter>

                <!-- Desktop collapse control -->
                <SidebarRail />
            </Sidebar>

            <!-- Main content -->
            <SidebarInset class="min-w-0 bg-[#09090b] text-white">
                <header class="sticky top-0 z-50 flex h-16 items-center gap-3 border-b border-white/[0.06] bg-[#09090b] px-4 md:px-6">
                    <SidebarTrigger
                        class="shrink-0 text-neutral-400 hover:bg-white/[0.06] hover:text-[#D8B65A]"
                    />
                </header>

                <main class="min-w-0 flex-1 p-4 md:p-6">
                    <slot />
                </main>
            </SidebarInset>
        </SidebarProvider>
    </div>
</template>
