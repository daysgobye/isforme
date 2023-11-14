import { Hono } from 'hono'
import { Content } from './app'

const app = new Hono()


app.get('/*', (c) => {

    return c.html(
        <Content title={c.req.path} />)
})


export default app
