type RecallStatus = {
  code?: string
  description?: string
}

export const isRecalled = (recallStatus?: RecallStatus | null): boolean => Boolean(recallStatus?.code)
