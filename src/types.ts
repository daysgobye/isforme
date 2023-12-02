export type PageData = {
    path: string
    messages: string[]
    readPw: string | null
    writePw: string | null

}
export type Addon = {
    code: string
    name: string
    version: string
    description: string
    author: string
    files: string[]
}
