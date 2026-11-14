<script setup lang="ts">
import { nextTick, onMounted, ref, shallowRef } from 'vue'

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

const pageRefs = ref<HTMLElement[]>([])

interface Annotation {
  id: string
  page: number
  type: 'highlight' | 'note'
  x: number
  y: number
  width: number
  height: number
  color?: string
  text?: string
}

// Hard-coded for now.
// Later replace this with:
// const annotations = await $fetch(`/api/readings/${bookId}/annotations`)
const annotations = ref<Annotation[]>([
  {
    id: 'annotation-1',
    page: 1,
    type: 'highlight',
    x: 0.15,
    y: 0.25,
    width: 0.58,
    height: 0.035,
    color: '#fde047',
    text: 'This is a highlighted sentence.',
  },
  {
    id: 'annotation-2',
    page: 1,
    type: 'note',
    x: 0.75,
    y: 0.3,
    width: 0.04,
    height: 0.04,
    color: '#f97316',
    text: 'My note about this section',
  },
])

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

    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url,
    ).toString()

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

    // The canvases are rendered by the v-else branch, so reveal it before
    // taking their references.
    loading.value = false
    await nextTick()

    for (let pageNumber = 1; pageNumber <= pageCount.value; pageNumber++) {
      const page = await pdfDocument.value.getPage(pageNumber)
      const viewport = page.getViewport({ scale: scale.value })

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
</script>

<template>
  <div >
    <header >
      <div>
        <strong>PDF Reader</strong>
        <span v-if="pageCount"> · {{ pageCount }} pages</span>
      </div>
    </header>

    <div v-if="loading">
      Loading PDF…
    </div>

    <div v-else-if="loadError" role="alert">
      {{ loadError }}
    </div>

    <main v-else class="!justify-start">
      <section class="flex flex-col items-start">
        <div
          v-for="pageNumber in pageCount"
          :key="pageNumber"
          :ref="(element) => setPageRef(element as HTMLElement, pageNumber - 1)"
        >
          <canvas />
        </div>
      </section>

      <aside>
        <h2>Notes</h2>

        <article
          v-for="annotation in annotations.filter(
            (item) => item.type === 'note',
          )"
          :key="annotation.id"
          class="note-card"
        >
          <small>Page {{ annotation.page }}</small>
          <p>{{ annotation.text }}</p>
        </article>
      </aside>
    </main>
  </div>
</template>

<style scoped>
</style>
