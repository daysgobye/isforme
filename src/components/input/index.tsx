type Props = { route: string }
const Input = ({ route }: Props) => (
    <form class="fm-form"
        hx-post={route}
        hx-target="#messages"
        hx-swap="beforebegin"
        _="on htmx:afterRequest reset() me">
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