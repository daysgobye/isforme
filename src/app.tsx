import { html } from "hono/html";
import { PageData } from "./types";
import Messages from "./components/messages";
import Input from "./components/input";
import NewPage from "./components/new_page";

export const Html = (props: { children: any, title: string }) => html`
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://unpkg.com/htmx.org@1.9.3"></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
      <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css">
      <title>${props.title}</title>
      <style>
      body>* {
        grid-column: none;
    }
    .fm-input{
      width: 90%;
    }
    .fm-button{
      width: 9%;
    }
    .fm-form{
      position: fixed;
      bottom: 2px;
      width: 99vw;
      display: flex;
      justify-content: space-around;
      flex-direction: row;
    }

      </style>
    </head>
    <body style="
    padding:  10px;
    display:flex;
    ">   
    
     <main class="">


        ${props.children}
        </main>

    </body>
  </html>
`
type ContentProps = { pageData: PageData }

export const Content = ({ pageData }: ContentProps) => {
  const renderMessages = () => {
    if (pageData.messages.length === 0) {
      if ((pageData.writePw === null || pageData.writePw === "") && (pageData.readPw === null || pageData.readPw === "")) {
        return (<NewPage route={pageData.path} />)
      }
    }
    return (<Messages messages={pageData.messages} />)

  }
  return (
    <Html title={pageData.path} >
      <h1>{pageData.path}</h1>
      {renderMessages()}
      <Input
        wrightPw={pageData.writePw !== null && pageData.writePw !== ""}
        route={pageData.path} />
    </Html>
  )
}
