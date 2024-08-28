type Props = {
    route: string
    wrightPw: boolean
}
const Input = ({ route, wrightPw }: Props) => (
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
    </form >
)

export default Input