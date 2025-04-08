export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    UNAUTHORIZED: 401,
    UNPROCESSABLE_ENTITY: 422,
} as const

// type HttpStatus
export type HttpStatusType = (typeof HttpStatus)[keyof typeof HttpStatus]