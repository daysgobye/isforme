import { html } from "hono/html"

type Props = {
    route: string
    wrightPw: boolean
}
const Input = ({ route, wrightPw }: Props) => (
    <>
        <form class="fm-form"
            hx-post={route}
            hx-target="#messages"
            hx-swap="beforeend"
            _="on htmx:afterRequest set value of #message_input to ''"
        >
            <div class={`grid fm-inputs ${wrightPw ? "grid12" : ""}`}>
                {wrightPw && (<input
                    class="fm-input"
                    name="writePw"
                    id="writePw"

                    type="password"
                    placeholder="Write Password"
                />)}
                <input
                    class="fm-input"
                    name="message"
                    id="message_input"
                    type="text"
                    placeholder="/help"
                />
            </div>
            <button class="fm-button" type="submit">
                post
            </button>
            <button class="fm-button" id="page-editor" type="button">
                editor
            </button>

        </form >

        <dialog id="editor-dialog">
            <div id="editor-controlls">
                <select name="editor language" aria-label="Select your editor language" value="html">
                    <option selected disabled value="">
                        language option
                    </option>
                    <option>html</option>
                    <option>markdown</option>
                    <option>css</option>

                </select>
                <button autofocus>X</button>
            </div>
            <div id="editor">
            </div>
            <form class="fm-form" id="editor-submit">
                {wrightPw && (
                    <input type="password" name="password" placeholder="Write Password" id="editor-writepw" />
                )}
                <input type="submit" value="save" />
            </form>
        </dialog>
        {html`
    <script>
    const EDITORMESSAGE = "<!-- EDITORMESSAGE: -->"
    const language = {
    html:"<!-- EDITOR-HTML: -->",
    md:"<!-- EDITOR-MD: -->",
    css:"<!-- EDITOR-css: -->",
    }
    let languageUsed = "html"
    let userReadPw = ""
    let rawMessages = []
    const dialog = document.getElementById("editor-dialog");
    const showButton = document.getElementById("page-editor");
    const closeButton = document.querySelector("dialog button");
    const languageChange = document.querySelector("dialog select");
    const fourm = document.getElementById("editor-submit");
    let editor = undefined

 editor = ace.edit("editor");
        editor.setTheme("ace/theme/monokai");
        editor.session.setMode("ace/mode/html");
    const onOpen = async () => {
        userReadPw =  document.getElementById("messages").getAttribute("data-readpw")
        try {
            const responce = await isMySpaceClient.apiGetRaw(userReadPw)
            rawMessages = responce.messages
            const editorMessage = rawMessages.join("\\n<!--MESSAGE: -->\\n<!--YOU ARE USING AN EDITOR IN A PAGE THAT HAS BEEN USING MESSAGE BAR ALL MESSAGES WILL BE MERGED IF YOU SAVE-->\\n ")
            if (editorMessage) {
            let value=editorMessage.replaceAll(EDITORMESSAGE, "")
                 for(const key in language){
                const lang = language[key]
                if(value.includes(lang)){
                 value=value.replaceAll(lang, "")
                 languageChange.value=key
                 editor.session.setMode(\`ace/mode/\${key}\`)
                }
            }
                editor.setValue(value)
            }
            dialog.showModal();
        } catch (error) {
console.log(userReadPw,error)
        }
    }
            showButton.addEventListener("click", () => {
        onOpen()
    });
    const onClose = (messages = []) => {
        const messageContainer = document.getElementById("messages")
        messageContainer.innerHTML =\`<div data-id="0" class="fm-message"> \${ messages[0] }</div> \`
    }
  
    fourm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const writePwInput=document.getElementById("editor-writepw")
        const writepw = writePwInput?writePwInput.value:""
        if (editor) {
            const value = editor.getValue()
       
            try {
                const responce = await isMySpaceClient.apiPost(userReadPw, writepw, [(EDITORMESSAGE +language[languageUsed] + value)])
                console.log(responce)
                onClose(responce.handledMessages)

                dialog.close();
            } catch (error) {
                console.log(error)
            }
        } else {
            console.error("no editor")
        }
    });

    closeButton.addEventListener("click", () => {
        dialog.close();
    });
    languageChange.addEventListener("change", () => {
        languageUsed = languageChange.value        
        editor.session.setMode(\`ace/mode/\${languageChange.value}\`);
    })



</script>
        `}
    </>

)

export default Input