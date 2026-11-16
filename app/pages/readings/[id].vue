<script setup lang="ts">
import { computed, nextTick, onMounted, ref, shallowRef, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'

import BookDiaglog from '~/components/reading/BookDiaglog.vue'
import ChatBotPage from '~/components/reading/ChatBotPage.vue'
import Notes from '~/components/reading/Notes.vue'
import Search from '~/components/reading/Search.vue'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet'

const route = useRoute()
const router = useRouter()
const bookId = String(route.params.id)

const pdfUrl = `/api/readings/${bookId}/file`

// PDF.js uses private class fields; a normal ref would proxy the instance and
// make those fields inaccessible.
const pdfDocument = shallowRef<any>(null)
const pageCount = ref(0)
const pdfCurrentPage = ref(getInitialPdfPage())
const DEFAULT_SCALE = 2
const scale = ref(DEFAULT_SCALE)
const MIN_SCALE = 0.25
const MAX_SCALE = 2.5

const loading = ref(true)
const loadError = ref<string | null>(null)
const largestPdfPageWidth = ref(0)
const { width: viewportWidth } = useWindowSize()

const READER_HORIZONTAL_PADDING = 32
const READER_COLUMN_GAP = 24
const MIN_PANEL_WIDTH = 400
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

function getInitialPdfPage() {
  const value = Array.isArray(route.query.page)
    ? route.query.page[0]
    : route.query.page
  const page = Number(value)

  return Number.isInteger(page) && page > 0 ? page : 1
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

      pageElement.style.width = `min(100%, ${viewport.width}px)`

      await page.render({
        canvasContext: context,
        viewport,
      }).promise

      // Keep the high-resolution canvas while fitting its displayed width to
      // the available reader column on small screens.
      canvas.style.width = '100%'
      canvas.style.height = 'auto'
      canvas.style.display = 'block'
    }

    // Restore the page encoded in the URL after its canvas is available.
    goToPage(false)
  } catch (error) {
    console.error('Unable to load PDF', error)
    loadError.value = 'Unable to load this PDF. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(renderPdf)

const currentPage = ref<ReaderPanel>('none')
const isWideScreen = computed(() => {
  return viewportWidth.value - largestPdfPageWidth.value - READER_HORIZONTAL_PADDING - READER_COLUMN_GAP >= MIN_PANEL_WIDTH
}
)
watch([isWideScreen, largestPdfPageWidth], ([wide, width]) => {
  if (width <= 0) return
  if (wide && currentPage.value === 'none') {
    currentPage.value = 'notes'
  }
}, { immediate: true })
const currentTitle = computed(() =>
  currentPage.value === 'none' ? '' : panelTitles[currentPage.value],
)

const pageRefs = ref<HTMLElement[]>([])

function goToPage(smooth = true) {
  const pageNumber = Math.min(
    Math.max(pdfCurrentPage.value, 1),
    pageCount.value,
  )
  pdfCurrentPage.value = pageNumber
  router.replace({
    query: { ...route.query, page: String(pageNumber) },
  })
  const pageElement = pageRefs.value[pageNumber - 1]
  pageElement?.scrollIntoView({
    behavior: smooth ? 'smooth' : 'auto',
    block: 'start',
  })
}
function setPageRef(element: HTMLElement | null, index: number) {
  if (element) {
    pageRefs.value[index] = element
  }
}

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
    <div v-else class="sticky top-16 z-40 mb-6 flex flex-wrap gap-2 border-b border-white/10 bg-[#09090b] py-3"> <Button
        type="button" :aria-expanded="currentPage === 'notes'" aria-controls="reader-panel"
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
      <Input v-model.number="pdfCurrentPage" type="number" min="1" :max="pageCount"
        class="w-20 rounded border px-2 py-1 text-white" @keydown.enter="goToPage" />
      <span>/ {{ pageCount }}</span>
      <Button type="button" class="rounded bg-blue-600 px-3 py-1 text-white" @click="goToPage">
        Go
      </Button>
    </div>
    <div :class="{
      'h-dvh grid h-screen max-h-screen min-h-0 grid-cols-[auto_minmax(0,1fr)] gap-6 overflow-hidden':
        isWideScreen && currentPage !== 'none',
    }">
      <section class="h-full min-h-0 overflow-y-auto overscroll-contain"
        :class="isWideScreen ? 'items-start' : 'items-center'">
        <div v-for="pageNumber in pageCount" :key="pageNumber"
          :ref="(element) => setPageRef(element as HTMLElement, pageNumber - 1)">
          <canvas />
        </div>
      </section>

      <aside v-if="isWideScreen && currentPage !== 'none'"
        class="min-h-0 min-w-0 overflow-y-auto border-l border-white/10 pl-6">
        <Notes v-if="currentPage === 'notes'" :book-id="bookId" />
        <ReadingMemoryCardList v-else-if="currentPage === 'memorycard'" />
        <BookDiaglog v-else-if="currentPage === 'bookmarks'" />
        <ChatBotPage v-else-if="currentPage === 'chats'" />
        <Search v-else-if="currentPage === 'search'" />
      </aside>
    </div>

    <Sheet :open="currentPage !== 'none' && !isWideScreen" @update:open="open => {
      if (!open) currentPage = 'none'
    }">
      <SheetContent id="reader-panel" side="bottom"
        class="!left-1/2 !right-auto !h-[80dvh] !w-[90vw] !-translate-x-1/2 rounded-t-xl bg-[#18181b] text-white"
        :aria-describedby="undefined">
        <SheetHeader>
          <SheetTitle class="text-white">{{ currentTitle }}</SheetTitle>
        </SheetHeader>

        <Notes v-if="currentPage === 'notes'" :book-id="bookId" />
        <ReadingMemoryCardList v-else-if="currentPage === 'memorycard'" />
        <BookDiaglog v-else-if="currentPage === 'bookmarks'" />
        <ChatBotPage v-else-if="currentPage === 'chats'" />
        <Search v-else-if="currentPage === 'search'" />
      </SheetContent>
    </Sheet>
  </div>
</template>
