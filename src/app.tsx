import { html } from "hono/html";
import { PageData } from "./types";
import Messages from "./components/messages";
import Input from "./components/input";

export const Html = (props: { children: any, title: string }) => html`
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://unpkg.com/htmx.org@1.9.3"></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>

      <title>${props.title}</title>
    </head>
    <body>

        ${props.children}

    </body>
  </html>
`
type ContentProps = { pageData: PageData }

export const Content = ({ pageData }: ContentProps) => (
  <Html title={pageData.path} >
    <h1>{pageData.path}</h1>
    <Messages messages={pageData.messages} />
    <Input
      route={pageData.path} />
  </Html>
)
