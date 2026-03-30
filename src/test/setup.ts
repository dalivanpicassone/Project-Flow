import "@testing-library/jest-dom"
import { vi } from "vitest"

// Mock next/config
vi.mock("next/config", () => ({
  default: () => ({
    publicRuntimeConfig: {},
    serverRuntimeConfig: {},
  }),
}))

// Делаем vi доступным глобально
;(globalThis as typeof globalThis & { vi: typeof vi }).vi = vi
