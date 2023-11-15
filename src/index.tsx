import { Hono } from 'hono'
import { Content } from './app'
import { Message } from './components/messages'
import { z } from 'zod'

import { zValidator } from '@hono/zod-validator'
import { get, update } from './page'
import { PageData } from './types'

type Bindings = {
    DB: D1Database

}

const app = new Hono<{ Bindings: Bindings }>()


app.get('/*', async (c) => {
    const pageData = await get(c.env.DB, c.req.path)
    console.log("page data", pageData)
    return c.html(
        <Content pageData={pageData as unknown as PageData} />)
})

app.post('/*',
    zValidator(
        'form',
        z.object({
            message: z.string().min(1)
        })),
    async (c) => {

        const { message } = c.req.valid('form')
        await update(c.env.DB, c.req.path, message)
        return c.html(<Message message={message} />)
    })


export default app
