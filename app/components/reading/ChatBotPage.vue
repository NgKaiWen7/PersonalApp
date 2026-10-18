<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { marked } from "marked";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "~/components/ui/select";
import DOMPurify from "dompurify";

const route = useRoute();
const id = computed(() => String(route.params.id));

// const chatSessions = ref<ChatSession[]>([]);
const selectedChat = ref<string | null>(null);
const messages = ref<ChatMessage[]>([]);
const input = ref("");
const loading = ref(false);

interface ChatSession {
    id: string;
    title: string;
}

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

function renderMarkdown(content: string): string {
    const html = marked.parse(content, {
        async: false,
        breaks: true,
    });

    return DOMPurify.sanitize(html);
}

async function loadChatSessions() {
    chatSessions.value = await $fetch<ChatSession[]>("/api/readings/chatbot");
    console.log(chatSessions.value);
}

function createChat() {
    selectedChat.value = "";
    messages.value = [];
}

async function selectChat(chatUuid: string) {
    selectedChat.value = chatUuid;
    messages.value = await $fetch(`/api/readings/chatbot/${chatUuid}`);
}

async function newChat(): Promise<string> {
    const chat = await $fetch<{
        id: string;
        title: string;
        created_at: string;
    }>("/api/readings/chatbot", { method: "POST" });

    selectedChat.value = chat.id;
    messages.value = [];
    const newSession: ChatSession = { id: chat.id, title: chat.title };

    chatSessions.value.unshift(newSession);
    return chat.id;
}

async function sendMessage() {
    const content = input.value.trim();

    if (!content || loading.value) return;

    messages.value.push({ role: "user", content });
    input.value = "";
    loading.value = true;

    try {
        let chatUuid = selectedChat.value;

        // Create a session if none is selected
        if (!chatUuid) {
            chatUuid = await newChat();
        }

        const response = await $fetch<{ answer: string }>(
            "/api/readings/chatbot/message",
            {
                method: "POST",
                body: {
                    chat_uuid: chatUuid,
                    book_uuid: id.value,
                    role: "user",
                    content: content,
                },
            },
        );

        messages.value.push({ role: "assistant", content: response });

        await loadChatSessions();
    } catch (error) {
        console.error("Failed to send message:", error);
    } finally {
        loading.value = false;
    }
}

async function deleteChat(chatUuid: string) {
    await $fetch(`/api/readings/chatbot/${chatUuid}`, {
        method: "DELETE",
    });

    chatSessions.value = chatSessions.value.filter(
        (chat) => chat.id !== chatUuid,
    );

    if (selectedChat.value === chatUuid) {
        selectedChat.value = "";
        messages.value = [];
    }
}

const { data: chatSessions } = await useFetch<ChatSession[]>(
    "/api/readings/chatbot",
    {
        default: () => [],
    },
);
</script>

<template>
    <div class="flex h-full min-h-0 flex-col bg-[#0D0D0B] text-amber-50">
        <div
            class="flex items-center justify-between border-b border-[#332D20] p-4"
        >
            <Select
                :model-value="selectedChat"
                @update:model-value="selectChat"
            >
                <SelectTrigger class="w-[240px]">
                    <SelectValue placeholder="Select a conversation" />
                </SelectTrigger>

                <SelectContent>
                    <SelectItem
                        v-for="chat in chatSessions"
                        :key="chat.id"
                        :value="chat.id"
                    >
                        {{ chat.title }}
                    </SelectItem>
                </SelectContent>
            </Select>
            <button
                class="rounded-lg border border-red-900/60 px-3 py-2 text-sm text-red-400 hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-40"
                :disabled="!selectedChat"
                @click="deleteChat(selectedChat)"
            >
                Delete chat
            </button>

            <button
                class="rounded-lg bg-[#332916] px-3 py-2 text-sm text-[#E49C1B] hover:bg-[#40331B]"
                @click="createChat"
            >
                + New chat
            </button>
        </div>
        <div class="flex-1 space-y-4 overflow-y-auto p-4">
            <div
                v-for="(message, index) in messages"
                :key="index"
                class="flex w-full mb-4"
                :class="
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                "
            >
                <div
                    v-if="message.role === 'assistant'"
                    class="markdown-content max-w-[80%] rounded-lg bg-[#171610] px-4 py-3 text-gray-200"
                    v-html="renderMarkdown(message.content)"
                />

                <div
                    v-else
                    class="max-w-[80%] whitespace-pre-wrap break-words rounded-lg bg-[#332916] px-4 py-3 text-gray-100"
                >
                    {{ message.content }}
                </div>
            </div>
        </div>

        <form
            class="flex items-center gap-3 border-t border-amber-500/20 p-4"
            @submit.prevent="sendMessage"
        >
            <input
                v-model="input"
                placeholder="Ask something..."
                class="min-w-0 flex-1 rounded-xl border border-amber-500/30 bg-[#171610] px-4 py-3 text-sm outline-none focus:border-amber-400"
            />

            <button
                type="submit"
                :disabled="!input.trim()"
                class="rounded-xl bg-amber-500 p-3 text-stone-950 hover:bg-amber-400 disabled:opacity-40"
            >
                <ArrowUp class="size-4" />
            </button>
        </form>
    </div>
</template>
