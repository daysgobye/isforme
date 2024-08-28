type Props = {
    route: string
    message?: string
}
const ReadPw = ({ route, message }: Props) => (
    <article class="read_pw_form">
        <div class="headings">
            <h2>
                This space is read protected
            </h2>
            <h4>
                Enter the correct password to view space.
            </h4>
            <h4 >
                {message}
            </h4>
        </div>
        <form class="pw-form "
            hx-post={`${route}/read-pw`}
            hx-target=".read_pw_form"
            hx-swap="outerHTML"
        >
            <label for="readPw">
                Read Password
                <input
                    class="fm-input"
                    name="readPw"
                    type="text"
                    placeholder="Read Password"
                    aria-invalid={message ? "true" : ""}
                />
            </label>


            <button class="" type="submit">
                Enter
            </button>
        </form >
    </article>

)

export default ReadPw