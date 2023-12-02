import { Hono } from 'hono'
import { Content } from './app'
import { Message } from './components/messages'
import { z } from 'zod'

import { zValidator } from '@hono/zod-validator'
import { SetPW, get, update } from './page'
import { PageData } from './types'
import { getAddon, handleMessages } from './utils'

type Bindings = {
    DB: D1Database

}

const app = new Hono<{ Bindings: Bindings }>()


app.get('/*', async (c) => {
    const rawpageData = await get(c.env.DB, c.req.path)

    const messages = await handleMessages(rawpageData.messages)
    const pageData = { ...rawpageData, messages }
    console.log(rawpageData)
    return c.html(
        <Content pageData={pageData as unknown as PageData} />)
})

app.post('/:path/set-pw',
    zValidator(
        'form',
        z.object({
            readPw: z.string(),
            writePw: z.string()
        })),
    async (c) => {
        const { readPw, writePw } = c.req.valid('form')
        const path = c.req.param('path')

        try {
            await SetPW(c.env.DB, `/${path}`, writePw, readPw)
        } catch (e) {
            return c.html(
                <div id="messages">
                    <h2> Password was alredy set</h2>
                </div>
            )
        }
        return c.html(
            <div id="messages">
            </div>
        )
    })
app.post('/*',
    zValidator(
        'form',
        z.object({
            message: z.string().min(1),
            writePw: z.string().optional()
        })),
    async (c) => {
        const { message, writePw } = c.req.valid('form')
        try {
            await update(c.env.DB, c.req.path, message, writePw)
        } catch (error) {
            return c.html(
                <p>
                    page is write protected
                </p>
            )
        }
        const msg = await handleMessages([message])
        return c.html(<Message message={msg[0]} />)
    })



export default app
