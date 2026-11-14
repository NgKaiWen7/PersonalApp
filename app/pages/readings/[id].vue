<script setup lang="ts">
import { computed, nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import BookDiaglog from '~/components/reading/BookDiaglog.vue'
import ChatBotPage from '~/components/reading/ChatBotPage.vue'
import MemoryCard from '~/components/reading/MemoryCard.vue'
import Notes from '~/components/reading/Notes.vue'
import Search from '~/components/reading/Search.vue'
import Button from '~/components/ui/button/Button.vue'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet'

const route = useRoute()
const bookId = String(route.params.id)

const pdfUrl = `/api/readings/${bookId}/file`

// PDF.js uses private class fields; a normal ref would proxy the instance and
// make those fields inaccessible.
const pdfDocument = shallowRef<any>(null)
const pageCount = ref(0)
const scale = ref(1.4)
const loading = ref(true)
const loadError = ref<string | null>(null)
const largestPdfPageWidth = ref(0)
const { width: viewportWidth } = useWindowSize()

const READER_HORIZONTAL_PADDING = 32
const READER_COLUMN_GAP = 24
const MIN_PANEL_WIDTH = 800
type ReaderPanel =
  | 'none'
  | 'notes'
  | 'memorycard'
  | 'bookmarks'
  | 'chats'
  | 'search'

const panelTitles = {
  notes: 'Notes',
  memorycard: 'Memory Cards',
  bookmarks: 'PDF Menu & Bookmarks',
  chats: 'AI Chats',
  search: 'Search',
}

const currentPage = ref<ReaderPanel>('none')
const isWideScreen = computed(() =>
  viewportWidth.value - largestPdfPageWidth.value - READER_HORIZONTAL_PADDING - READER_COLUMN_GAP >= MIN_PANEL_WIDTH,
)
watch(isWideScreen, (wide) => {
  console.log(currentPage.value)
  if (wide && currentPage.value === 'none') {
    currentPage.value = 'notes'
  }
}, { immediate: true })
const isDrawerOpen = computed({
  get: () => !isWideScreen.value && currentPage.value !== 'none',
  set: (open: boolean) => {
    if (!open) currentPage.value = 'none'
  },
})
const currentTitle = computed(() =>
  currentPage.value === 'none' ? '' : panelTitles[currentPage.value],
)

const pageRefs = ref<HTMLElement[]>([])

function setPageRef(element: HTMLElement | null, index: number) {
  if (element) {
    pageRefs.value[index] = element
  }
}

async function renderPdf() {
  loading.value = true
  loadError.value = null

  try {
    // Dynamic import avoids importing PDF.js during SSR.
    const pdfjsLib = await import('pdfjs-dist')

    const pdfWorker = await import('pdfjs-dist/build/pdf.worker.mjs?url')
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker.default

    // Fetch the file ourselves and pass its bytes to PDF.js. This keeps the
    // reader independent of PDF.js URL/range loading and guarantees `data`
    // is supplied to getDocument.
    const response = await fetch(pdfUrl)

    if (!response.ok) {
      throw new Error(`PDF request failed with status ${response.status}`)
    }

    const data = new Uint8Array(await response.arrayBuffer())

    if (data.byteLength === 0) {
      throw new Error('PDF request returned an empty file')
    }

    pdfDocument.value = await pdfjsLib.getDocument({ data }).promise
    pageCount.value = pdfDocument.value.numPages
    largestPdfPageWidth.value = 0

    // The canvases are rendered by the v-else branch, so reveal it before
    // taking their references.
    loading.value = false
    await nextTick()

    for (let pageNumber = 1; pageNumber <= pageCount.value; pageNumber++) {
      const page = await pdfDocument.value.getPage(pageNumber)
      const viewport = page.getViewport({ scale: scale.value })
      largestPdfPageWidth.value = Math.max(largestPdfPageWidth.value, viewport.width)

      const pageElement = pageRefs.value[pageNumber - 1]

      if (!pageElement) {
        throw new Error(`Missing render container for PDF page ${pageNumber}`)
      }

      const canvas = pageElement.querySelector('canvas')

      if (!(canvas instanceof HTMLCanvasElement)) {
        throw new Error(`Missing canvas for PDF page ${pageNumber}`)
      }

      const context = canvas.getContext('2d')!

      canvas.width = viewport.width
      canvas.height = viewport.height

      pageElement.style.width = `${viewport.width}px`
      pageElement.style.height = `${viewport.height}px`

      await page.render({
        canvasContext: context,
        viewport,
      }).promise
    }
  } catch (error) {
    console.error('Unable to load PDF', error)
    loadError.value = 'Unable to load this PDF. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(renderPdf)

function handleClick(page: Exclude<ReaderPanel, 'none'>) {
  currentPage.value = page
}
</script>

<template>
  <div class="min-h-full bg-[#09090b] text-white">
    <div v-if="loading">
      Loading PDF…
    </div>
    <div v-else-if="loadError" role="alert">
      {{ loadError }}
    </div>
    <main v-else class="p-4">
      <div class="mb-6 flex flex-wrap gap-2">
        <Button type="button" :aria-expanded="currentPage === 'notes'" aria-controls="reader-panel"
          @click="handleClick('notes')">
          Show notes
        </Button>
        <Button type="button" :aria-expanded="currentPage === 'memorycard'" aria-controls="reader-panel"
          @click="handleClick('memorycard')">
          Show memory cards
        </Button>
        <Button type="button" :aria-expanded="currentPage === 'bookmarks'" aria-controls="reader-panel"
          @click="handleClick('bookmarks')">
          PDF Menu & Bookmarks
        </Button>
        <Button type="button" :aria-expanded="currentPage === 'chats'" aria-controls="reader-panel"
          @click="handleClick('chats')">
          AI Chats
        </Button>
        <Button type="button" :aria-expanded="currentPage === 'search'" aria-controls="reader-panel"
          @click="handleClick('search')">
          Search
        </Button>
      </div>

      <div :class="{ 'grid grid-cols-[auto_minmax(0,1fr)] gap-6': isWideScreen && currentPage !== 'none' }">
        <section
          class="flex flex-col gap-6"
          :class="isWideScreen ? 'items-start' : 'items-center'"
        >
          <div v-for="pageNumber in pageCount" :key="pageNumber"
            :ref="(element) => setPageRef(element as HTMLElement, pageNumber - 1)">
            <canvas />
          </div>
        </section>

        <aside v-if="isWideScreen && currentPage !== 'none'" class="min-w-0 border-l border-white/10 pl-6">
          <Notes v-if="currentPage === 'notes'" :book-id="bookId" />
          <MemoryCard v-else-if="currentPage === 'memorycard'" />
          <BookDiaglog v-else-if="currentPage === 'bookmarks'" />
          <ChatBotPage v-else-if="currentPage === 'chats'" />
          <Search v-else-if="currentPage === 'search'" />
        </aside>
      </div>

      <Sheet v-model:open="isDrawerOpen">
        <SheetContent
          id="reader-panel"
          side="bottom"
          class="!left-1/2 !right-auto !h-[80dvh] !w-[90vw] !-translate-x-1/2 rounded-t-xl bg-[#18181b] text-white"
        >
          <SheetHeader>
            <SheetTitle class="text-white">{{ currentTitle }}</SheetTitle>
          </SheetHeader>

          <Notes v-if="currentPage === 'notes'" :book-id="bookId" />
          <MemoryCard v-else-if="currentPage === 'memorycard'" />
          <BookDiaglog v-else-if="currentPage === 'bookmarks'" />
          <ChatBotPage v-else-if="currentPage === 'chats'" />
          <Search v-else-if="currentPage === 'search'" />
        </SheetContent>
      </Sheet>
    </main>
  </div>
</template>
