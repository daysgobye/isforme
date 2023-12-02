type Props = {
    route: string
    wrightPw: boolean
}
const Input = ({ route, wrightPw }: Props) => (
    <form class="fm-form"
        hx-post={route}
        hx-target="#messages"
        hx-swap="beforeend"
        _="on htmx:afterRequest reset() me">
        {wrightPw && (<input
            class="fm-input"
            name="writePw"
            type="text"
            placeholder="Write Password"
        />)}
        <input
            class="fm-input"
            name="message"
            type="text"
            placeholder="Somethings are just for me"
        />

        <button class="fm-button" type="submit">
            for me
        </button>
    </form >
)

export default Input