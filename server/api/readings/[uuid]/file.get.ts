import {
  createError,
  defineEventHandler,
  getHeader,
  getRouterParam,
  setHeader,
  setResponseStatus,
} from 'h3'
import { createReadStream, promises as fs } from 'node:fs'
import path from 'node:path'
import { pool2 } from '../../../utils/db'

export default defineEventHandler(async (event) => {
  const bookId = getRouterParam(event, 'uuid')

  if (!bookId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing book ID',
    })
  }

  const result = await pool2.query<{ source: string | null }>(
    'SELECT source FROM books WHERE id = $1',
    [bookId],
  )
  const source = result.rows[0]?.source
  if (!source) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Book file not found',
    })
  }

  const filePath = path.resolve("/mnt/data/Books/" + source)

  let stat

  try {
    stat = await fs.stat(filePath)
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: 'PDF not found',
    })
  }

  const fileSize = stat.size
  const range = getHeader(event, 'range')

  setHeader(event, 'Content-Type', 'application/pdf')
  setHeader(event, 'Accept-Ranges', 'bytes')
  setHeader(event, 'Cache-Control', 'private, max-age=3600')
  setHeader(event, 'ETag', `"${stat.mtimeMs}-${fileSize}"`)

  if (!range) {
    setHeader(event, 'Content-Length', fileSize)
    return createReadStream(filePath)
  }

  const match = /^bytes=(\d*)-(\d*)$/.exec(range)

  if (!match) {
    setResponseStatus(event, 416)
    setHeader(event, 'Content-Range', `bytes */${fileSize}`)
    return null
  }

  let start: number
  let end: number

  if (match[1] === '') {
    const suffixLength = Number(match[2])

    if (!Number.isFinite(suffixLength) || suffixLength <= 0) {
      setResponseStatus(event, 416)
      setHeader(event, 'Content-Range', `bytes */${fileSize}`)
      return null
    }

    start = Math.max(fileSize - suffixLength, 0)
    end = fileSize - 1
  } else {
    start = Number(match[1])
    end = match[2] ? Number(match[2]) : fileSize - 1
  }

  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start < 0 ||
    start >= fileSize ||
    start > end
  ) {
    setResponseStatus(event, 416)
    setHeader(event, 'Content-Range', `bytes */${fileSize}`)
    return null
  }

  end = Math.min(end, fileSize - 1)

  setResponseStatus(event, 206)
  setHeader(event, 'Content-Range', `bytes ${start}-${end}/${fileSize}`)
  setHeader(event, 'Content-Length', end - start + 1)

  return createReadStream(filePath, {
    start,
    end,
  })
})
