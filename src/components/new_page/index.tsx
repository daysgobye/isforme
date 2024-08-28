type Props = {
    route: string
}
const NewPage = ({ route }: Props) => (
    <article class="new_page_setup">
        <div class="headings">
            <h2>
                Only one step to claim this space as <i>your</i> space.
            </h2>
            <h3>
                Set any passwords you want.
                You can leave it blank, to set no protection.
                Or only set a read password,
                or just write protection <strong> (recommended)</strong>
            </h3>
        </div>
        <form class="pw-form grid"
            hx-post={`${route}/set-pw`}
            hx-target=".new_page_setup"
            hx-swap="outerHTML"
        >
            <div>
                <label for="writePw">
                    Password to write
                    <input
                        class="fm-input"
                        id="writePw"
                        name="writePw"
                        type="text"
                        placeholder="Write Password"
                    />
                </label>
                <label for="readPw">
                    Password to read
                    <input
                        class="fm-input"
                        name="readPw"
                        id="readPw"
                        type="text"
                        placeholder="Read Password"
                    />
                </label>
            </div>
            <button class="" type="submit">
                Set Read and/or Write Password
            </button>
        </form >
    </article>
)

export default NewPage