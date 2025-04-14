import { backend } from '../api'
import { ErrorDetails } from './types'
export function parseJWT<T>(token: string): T {
  const base64Url = token.split('.')[1]
  if (!base64Url) {
    throw Error('No payload exists')
  }

  try {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    throw error
  }
}

export function convertTime(
  value: number,
  fromUnit: string,
  toUnit: string
): number {
  const timeUnits: { [key: string]: number } = {
    ms: 1,
    s: 1000,
    min: 60000,
    hr: 3600000,
    d: 86400000,
  }

  if (
    !timeUnits.hasOwnProperty(fromUnit) ||
    !timeUnits.hasOwnProperty(toUnit)
  ) {
    throw new Error('Invalid time unit')
  }

  const conversionFactor = timeUnits[fromUnit] / timeUnits[toUnit]
  const convertedValue = value * conversionFactor

  return convertedValue
}
export function validateEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i
  return emailRegex.test(email)
}

export function readFile(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const fileReader = new FileReader()
    fileReader.onload = event => {
      if (!event.target || !event.target.result)
        throw new Error('No content exists within the file')
      const fileContent = event.target.result as string
      res(fileContent)
    }
    fileReader.onerror = error => {
      rej(error)
    }
    fileReader.readAsDataURL(file)
  })
}
export function checkCookieExists(cookieName: string): boolean {
  const cookies = document.cookie.split(';')
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim()
    if (cookie.startsWith(cookieName + '=')) {
      return true
    }
  }
  return false
}
export const removeCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
export function pageControl(
  setPage: React.Dispatch<React.SetStateAction<number | null>>,
  totalPages: number,
  continuous: boolean = true
): {
  inc: () => void
  dec: () => void
  set: (page: number) => void
  getTotalPages: () => number
} {
  return {
    inc: () => {
      setPage((oldPage: number | null) => {
        if (oldPage == null) return null
        return continuous
          ? Math.max(1, (oldPage + 1) % (totalPages + 1))
          : Math.min(oldPage + 1, totalPages - 1)
      })
    },
    dec: () => {
      setPage((oldPage: number | null) => {
        if (oldPage == null) return null
        return continuous
          ? oldPage - 1 === 0
            ? totalPages
            : oldPage - 1
          : Math.max(oldPage - 1, 0)
      })
    },
    set: (page: number | null) => {
      setPage(page)
    },
    getTotalPages: () => totalPages,
  }
}
export function timeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  const interval = {
    year: seconds / 31536000,
    month: seconds / 2592000,
    day: seconds / 86400,
    hour: seconds / 3600,
    minute: seconds / 60,
  }

  if (interval.year >= 1) {
    return pluralize(Math.floor(interval.year), 'year')
  } else if (interval.month >= 1) {
    return pluralize(Math.floor(interval.month), 'month')
  } else if (interval.day >= 1) {
    return pluralize(Math.floor(interval.day), 'day')
  } else if (interval.hour >= 1) {
    return pluralize(Math.floor(interval.hour), 'hour')
  } else if (interval.minute >= 1) {
    return pluralize(Math.floor(interval.minute), 'minute')
  }

  return pluralize(Math.floor(seconds), 'second')
}

function pluralize(value: number, unit: string): string {
  if (value === 1) {
    return `${unit === 'hour' ? 'an' : 'a'} ${unit}`
  } else {
    return `${value} ${unit}s`
  }
}
export function extractErrorDetailFromErrorQuery(error: any) {
  const errorName = error.name || 'UnknownError'
  const errorMessage = error.message || 'Something went wrong'
  const errorCode = error.status || NaN // Adjust this if your error structure differs
  const errorCause = error.cause || undefined // Adjust based on your actual error object

  // Create an instance of ErrorDetails
  const errorDetails = new ErrorDetails(
    errorName,
    errorMessage,
    errorCode,
    errorCause
  )
  return errorDetails
}

export function uploadFileInChunks(
  file: File,
  chunkSize = 2 * 1024 * 1024,
  endPoint: string,
  additionalData?: Record<string, any>
): Promise<void> {
  const totalChunks = Math.ceil(file.size / chunkSize)

  let currentChunk = 0

  const uploadNextChunk = (): Promise<void> => {
    const start = currentChunk * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end) // Get the current chunk of the file

    // Create the payload with optional additional data
    const formData = new FormData()
    formData.append('chunk', chunk)
    formData.append('currentChunk', String(currentChunk + 1))
    formData.append('totalChunks', String(totalChunks))
    formData.append('filename', file.name)

    // Append additional data if provided
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
    }

    // Send the chunk to the backend using fetch
    return new Promise<void>((resolve, reject) => {
      backend
        .postForm(endPoint, formData, {
          withCredentials: true,
        })
        .then(res => {
          currentChunk++
          if (currentChunk < totalChunks) {
            uploadNextChunk()
          }
          console.log(res)
          console.log(
            'Chunk at index ' + (currentChunk - 1) + ' uploaded successfully'
          )
          resolve()
        })
        .catch(error => {
          console.error('Error uploading chunk', error)
          reject(error)
        })
    })
  }

  // Start uploading the first chunk
  return uploadNextChunk()
}
export const abbreviateNumber = (num: number): string => {
  if (Math.abs(num) < 1000) return num.toString() // No abbreviation needed

  const suffixes = ['', 'K', 'M', 'B', 'T']
  let magnitude = Math.floor(Math.log10(Math.abs(num)) / 3)
  magnitude = Math.min(magnitude, suffixes.length - 1) // Ensure it doesn't exceed available suffixes

  const abbreviated = num / Math.pow(1000, magnitude)
  return `${abbreviated.toFixed(abbreviated % 1 === 0 ? 0 : 1)}${suffixes[magnitude]}`
}

export const base64ToFile = (base64String: string, filename: string): File => {
  const arr = base64String.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png' // Extract MIME type
  const bstr = atob(arr[1]) // Decode Base64 string
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mime })
}
