type Props = {
    route: string
}
const NewPage = ({ route }: Props) => (
    <form class="pw-form"
        hx-post={`${route}/set-pw`}
        hx-target=".pw-form"
    >
        <input
            class="fm-input"
            name="writePw"
            type="text"
            placeholder="Write Password"
        />
        <input
            class="fm-input"
            name="readPw"
            type="text"
            placeholder="Read Password"
        />

        <button class="fm-button" type="submit">
            Set Read and Write Password
        </button>
    </form >
)

export default NewPage