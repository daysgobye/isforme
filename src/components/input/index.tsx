type Props = { route: string }
const Input = ({ route }: Props) => (
    <form hx-post={route} hx-target="#messages" hx-swap="beforebegin" _="on htmx:afterRequest reset() me" style="
    position: fixed;
    bottom: 2px;
    width: 99vw;
    display: flex;
    justify-content: space-around;
    flex-direction: row;
" >
        <input name="message" type="text" placeholder="Somethings are just for me" style="
    width: 90%;
" />

        <button type="submit" style="
    width: 9%;
">
            for me
        </button>
    </form >
)

export default Input