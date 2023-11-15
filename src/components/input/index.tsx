type Props = { route: string }
const Input = ({ route }: Props) => (
    <form hx-post={route} hx-target="#messages" hx-swap="beforebegin" _="on htmx:afterRequest reset() me" >
        <div >
            <input name="message" type="text" />
        </div>
        <button type="submit">
            Submit
        </button>
    </form>
)

export default Input