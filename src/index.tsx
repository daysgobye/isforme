import { Context, Hono } from 'hono'
import { Content } from './app'
import Messages, { Message } from './components/messages'
import { z } from 'zod'

import { zValidator } from '@hono/zod-validator'
import { SetPW, get, update, updateAllMessages } from './page'
import { PageData } from './types'
import { handleMessages, rpc } from './utils'
import { bearerAuth } from 'hono/bearer-auth'

import Input from './components/input'
import ReadPw from './components/readPw'

type Bindings = {
    DB: D1Database

}

const app = new Hono<{ Bindings: Bindings }>()
app.use(
    '/api/*',
    bearerAuth({
        verifyToken: async (token: string, c: Context<{
            Bindings: Bindings;
        }, "/api/*", {}>) => {
            const path = `${c.req.path.split("/api").pop()}`.split("/raw").pop() || ""
            // const path = `/${c.req.param('path')}`
            const rawpageData = await get(c.env.DB, path)
            if (!rawpageData.readPw) {
                return true
            } else {
                return rawpageData.readPw === token
            }

        },
    })
)
app.get('/api/:path',
    async (c) => {
        const path = `/${c.req.param('path')}`
        const rawpageData = await get(c.env.DB, path)
        console.log(rawpageData)
        const messages = await handleMessages(rawpageData.messages)
        return c.json({ path: rawpageData.path, messages })

    })
app.get('/api/raw/:path', async (c) => {
    const path = `/${c.req.param('path')}`
    const rawpageData = await get(c.env.DB, path)
    return c.json({ path: rawpageData.path, messages: rawpageData.messages })
})
app.post('/api/:path',
    async (c) => {
        const path = `/${c.req.param('path')}`
        const body = await c.req.json();
        const rawpageData = await get(c.env.DB, path)
        const { messages, writePw }: { messages: string[], writePw?: string } = body

        if (rawpageData.writePw && rawpageData.writePw !== writePw) {
            return c.json({ message: "wrong password" }, 403)
        }
        const rawMessages = await updateAllMessages(c.env.DB, rawpageData.path, messages, writePw)
        const handledMessages = await handleMessages(rawMessages)
        return c.json({ path: rawpageData.path, rawMessages, handledMessages })
    })
app.get('/*', async (c) => {
    const rawpageData = await get(c.env.DB, c.req.path)
    const messages = await handleMessages(rawpageData.messages)
    const pageData = { ...rawpageData, messages }
    console.log(rawpageData)
    return c.html(
        <Content pageData={pageData as unknown as PageData} />)
})

app.post('/:path/read-pw',
    zValidator(
        'form',
        z.object({
            readPw: z.string(),
        })),
    async (c) => {
        const { readPw } = c.req.valid('form')
        const path = `/${c.req.param('path')}`

        try {
            const rawpageData = await get(c.env.DB, path)
            if (rawpageData.readPw === readPw) {
                const messages = await handleMessages(rawpageData.messages)
                return c.html(
                    <Messages messages={messages} />
                )
            } else {
                throw new Error('Wrong Password')
            }

        } catch (e) {
            return c.html(
                <ReadPw route={path} message='Wrong Password try again' />
            )
        }

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
        const path = `/${c.req.param('path')}`

        try {
            await SetPW(c.env.DB, path, writePw, readPw)
        } catch (e) {
            return c.html(
                <div id="messages">
                    <h2> Password was alredy set</h2>
                </div>
            )
        }
        return c.html(
            <>
                <div id="messages">
                </div>
                <Input
                    route={path}
                    wrightPw={writePw !== null && writePw !== ""}
                />
            </>
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
        const rawpageData = await get(c.env.DB, c.req.path)
        if (rawpageData.writePw && rawpageData.writePw !== writePw) {
            return c.html(
                <p>
                    page is write protected
                </p>
            )
        } else {
            const rpcResult = await rpc(c.env.DB, c.req.path, message, writePw)
            if (rpcResult) {
                const msg = await handleMessages([rpcResult])
                return c.html(<Message message={msg[0]} index={0} />)
            } else {
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
                return c.html(<Message message={msg[0]} index={0} />)
            }
        }
    })



export default app
