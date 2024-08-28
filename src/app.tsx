import { html } from "hono/html";
import { PageData, Theme } from "./types";
import Messages from "./components/messages";
import Input from "./components/input";
import NewPage from "./components/new_page";
import ReadPw from "./components/readPw";

export const Html = (props: { children: any, title: string, theme: "dark" | "light" }) => html`
  <!DOCTYPE html>
  <html data-theme="${props.theme}">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://unpkg.com/htmx.org@1.9.3"></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
     
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">

      <title>${props.title}</title>
      <script>
      function docReady(fn) {
        if (document.readyState === "complete" || document.readyState === "interactive") {
            setTimeout(fn, 1);
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }  
    window.spaceSettings = {}
    window.spaceSettingsOnMount = []
</script>
      <style>
      :root {
        --border-radius: 0px;
   }
    [data-theme="light"], :root:not([data-theme="dark"]) {
        --primary: #d81b60;
        --primary-hover: #c2185b;
        --primary-focus: rgba(216, 27, 96, 0.125);
        --primary-inverse: #FFF;
        --card-border-color: black;
        --card-box-shadow: 3px 4px 0px 1px #000;
        --button-box-shadow:var( --card-box-shadow);
        --border-width: 1px;
        --form-element-border-color: black;
        --form-element-background-color: white;

   }
   /* Pink Dark scheme (Auto) */
   /* Automatically enabled if user has Dark mode enabled */
    @media only screen and (prefers-color-scheme: dark) {
        :root:not([data-theme]) {
            --primary: #d81b60;
            --primary-hover: #e91e63;
            --primary-focus: rgba(216, 27, 96, 0.25);
            --primary-inverse: #FFF;
       }
   }
   /* Pink Dark scheme (Forced) */
   /* Enabled if forced with data-theme="dark" */
    [data-theme="dark"] {
        --background-color: black;
        --form-element-background-color: black;
        --card-background-color:#1c1c1c;
        --muted-color:#a1a1a1;
        --form-element-border-color: var(--color);
        --primary: #d81b60;
        --primary-hover: #e91e63;
        --primary-focus: rgba(216, 27, 96, 0.25);
        --primary-inverse: #FFF;
   }
   /* Pink (Common styles) */
    :root {
        --form-element-active-border-color: var(--primary);
        --form-element-focus-color: var(--primary-focus);
        --switch-color: var(--primary-inverse);
        --switch-checked-background-color: var(--primary);
   }

   .container-fluid{
    padding-top:20px;
}

input {
background:var(--background-color);
}
#messages{
  padding-bottom: 5vh;

}



.fm-form{
    position: fixed;
    width: 100%;
    padding-right:calc(var(--spacing)*2);
    display: flex;
    bottom: 0;
    margin-bottom:0;
    justify-content: space-between;
}
.fm-inputs {
width: 79%;
background:var(--background-color);
}
.fm-button {
flex:1;
}
h1 {
font-size: 3.5em;
margin-bottom:1px;
}

article {
margin: 10px 0;
}

.img-card {
width:75%;
display: flex;
flex-direction: column;
padding: 0;

}
.img-card>div {
padding: 2px 10px;
}


    @media (min-width: 992px){
        .grid12 {
            grid-template-columns: 1fr 2fr;
       }
       .grid21 {
        grid-template-columns: 2fr 1fr;
   }
   .fm-inputs {
    width: 89%;
   }
   h1{
     margin-bottom: var(--typography-spacing-vertical);
   }
   article {
    margin: var(--block-spacing-vertical) 0;
   }
  
}

   }
    [data-theme="light"] :not([data-theme="dark"]) article {
        border:2px solid var(--card-border-color);
   }
    [data-theme="light"] :not([data-theme="dark"]) button {
        border:1px solid black;
   }
    [data-theme="light"] :not([data-theme="dark"]) input {
        box-shadow: var( --card-box-shadow);
   }
   [data-theme="light"] :not([data-theme="dark"]) .img-card>img {
   border-bottom:2px solid black
}

    

      </style>
    </head>
    <body >   
    
     <main  class="container-fluid">
        ${props.children}
        </main>

    </body>
  </html>


`
type ContentProps = { pageData: PageData }

export const Content = ({ pageData }: ContentProps) => {
  const isNewPage = () => {
    if (pageData.messages.length === 0) {
      if ((pageData.writePw === null || pageData.writePw === "") && (pageData.readPw === null || pageData.readPw === "")) {
        return true


      }
    }
    return false
  }

  const renderMessages = () => {
    const newPage = isNewPage()
    if (newPage) {
      return (<NewPage route={pageData.path} />)
    }
    if (pageData.readPw !== null && pageData.readPw !== "") {
      return (<ReadPw route={pageData.path} />)
    }
    return (<Messages messages={pageData.messages} />)

  }
  const getThemes = (): "dark" | "light" => {
    const setTheme = [...pageData.messages].reverse().find(m => m === Theme.DARK || m === Theme.LIGHT)
    switch (setTheme) {
      case Theme.DARK:
        return "dark"
      default:
        return "light"
    }

  }
  return (
    <Html title={pageData.path} theme={getThemes()}>
      <h1><a href="/">/</a>{pageData.path.substring(1)}</h1>
      {renderMessages()}
      {
        isNewPage() ? "" : (
          <Input
            wrightPw={pageData.writePw !== null && pageData.writePw !== ""}
            route={pageData.path} />
        )
      }

    </Html>
  )
}
