import { html } from "hono/html";

export const Html = (props: { children: any, title: string }) => html`
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://unpkg.com/htmx.org@1.9.3"></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
      <script src="https://cdn.tailwindcss.com"></script>
      <title>${props.title}</title>
    </head>
    <body>

        ${props.children}

    </body>
  </html>
`
type ContentProps = { title: string }

export const Content = ({ title }: ContentProps) => (
    <Html title={title} >

    </Html>
)
