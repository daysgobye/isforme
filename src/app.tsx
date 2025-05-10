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
      <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.36.0/ace.js"
      integrity="sha512-TR97DMS7l/aiCHcIrwJhxxwOZaweN3eIV0LBr0ZKwtDAg2czUT7J9HGgYecG8UjesBCwMLkS71GQTmsGkY18Kw=="
      crossorigin="anonymous" referrerpolicy="no-referrer"></script>
      <link href="
      https://cdn.jsdelivr.net/npm/ace-builds@1.36.0/css/ace.min.css
      " rel="stylesheet">


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
         dialog[open] {
        display: flex;
        flex-direction: column;
    }
  .sticker {
            position: absolute;
            background-color: white;
            border: 3px solid black;
            padding: 15px;
            transform: rotate(var(--rotate));
            box-shadow: 4px 4px 0 black;
            z-index: 5;
            font-weight: bold;
            color: var(--primary);
        }
                  .neo-box {
            background-color: white;
            border: var(--border-width) solid black;
            box-shadow: 8px 8px 0 black;
            padding: 30px;
            margin-bottom: 40px;
            position: relative;
                        z-index: 6;

        }

        .neo-box:hover {
          transform: translate(-2px, -2px);
          box-shadow: 10px 10px 0 black;
          transition: all 0.2s ease;
      }
 @media (max-width: 768px) {
   

            .sticker {
                display: none;
            }
        }

    #editor {
        width: 100%;
        height: 82%;
    }

    #editor-controlls {
        display: flex;
        width: 100%;
        margin-top: -5%;
    }

    #editor-submit {
        z-index: 100;
        padding: unset;
        max-width: 95%;
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

pre{
text-wrap: auto;
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
    <script>
      // Add random rotation to stickers for a more handmade feel
        document.querySelectorAll('.sticker').forEach(sticker => {
            const randomRotate = (Math.random() * 10 - 5);
            sticker.style.setProperty('--rotate', \`\${randomRotate}deg\`);
        });
    /**
     * IsMySpaceClient class interacts with the IsMySpace API.
     * It constructs API URLs based on the current window location and provides methods to make GET and POST requests.
     */
    class IsMySpaceClient {
        origin = ""
        pathname = ""
        apiUrl = ""
        rawApiUrl = ""

        constructor() {
            const { origin, pathname } = window.location
            this.origin = origin
            this.pathname = pathname
            this.rawApiUrl = \`\${origin}/api/raw\${pathname}\`
            this.apiUrl = \`\${origin}/api\${pathname}\`

        }


        /**
         * Makes a GET request to the standard API endpoint to retrieve processed messages.
         * If the message is in markdown, this method returns HTML ready to be rendered.
         * 
         * @param {string} readPassword - The read authorization password for the API.
         * 
         * @returns {Promise<{path: string, messages: string[]}>} 
         *   A promise that resolves to an object containing the path and an array of processed messages.
         * 
         * Example return value:
         * {
         *   path: "string",
         *   messages: ["<p>processed message 1</p>", "<p>processed message 2</p>"]
         * }
         */
        async apiGet(readPassword) {

            const requestOptions = {
                method: "GET",
                headers: {
                    'Authorization': \`Bearer \${readPassword}\`,
                    'Content-Type': 'application/json',
                },
                redirect: "follow"
            };
            const response = await fetch(this.apiUrl, requestOptions);
            const result = await response.json()
            return result
        }
        /**
         * Makes a GET request to the raw API endpoint to retrieve raw messages as typed.
         * 
         * @param {string} readPassword - The read authorization password for the API.
         * 
         * @returns {Promise<{path: string, messages: string[]}>} 
         *   A promise that resolves to an object containing the path and an array of raw messages.
         * 
         * Example return value:
         * {
         *   path: "string",
         *   messages: ["# raw message 1", "## raw message 2"]
         * }
         */
        async apiGetRaw(readPassword) {

            const requestOptions = {
                method: "GET",
                headers: {
                    'Authorization': \`Bearer \${readPassword}\`,
                    'Content-Type': 'application/json',
                },
                redirect: "follow"
            };
            console.log(requestOptions)
            const response = await fetch(this.rawApiUrl, requestOptions);
            const result = await response.json()
            return result
        }
        /**
         * Makes a POST request to the standard API endpoint to send messages.
         * This method takes in raw messages and returns both raw and handled (processed) messages.
         * 
         * @param {string} readPassword - The read authorization password for the API.
         * @param {string} writePassword - The write authorization password for the API.
         * @param {Array<string>} messages - An array of messages to be sent in the POST request body.
         * 
         * @returns {Promise<{path: string, rawMessages: string[], handledMessages: string[]}>} 
         *   A promise that resolves to an object containing the path, raw messages, 
         *   and handled (processed) messages.
         * 
         * Example return value:
         * {
         *   path: "string",
         *   rawMessages: ["string1", "string2"],
         *   handledMessages: ["<p>processed string1</p>", "<p>processed string2</p>"]
         * }
         */
        async apiPost(readPassword, writePassword, messages) {
            const raw = JSON.stringify({
                writePw: writePassword,
                messages: messages
            });

            const requestOptions = {
                method: "POST",
                headers: {
                    'Authorization': \`Bearer \${readPassword}\`,
                    'Content-Type': 'application/json',
                },
                body: raw,
                redirect: "follow"
            };

            const response = await fetch(this.apiUrl, requestOptions);
            const result = await response.json();

            return result
        }

    }
    const isMySpaceClient = new IsMySpaceClient()

</script>
   
    
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
