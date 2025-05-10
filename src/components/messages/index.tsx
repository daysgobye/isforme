type MessageProps = {
    message: string,
    index: number
}
export const Message = ({ message, index }: MessageProps) => {

    return (
        <div data-id={index} class="fm-message" dangerouslySetInnerHTML={{
            __html: message
        }} />


    )
}

type MessagesProps = { messages: string[], readPw?: string }
const Messages = ({ messages, readPw }: MessagesProps) => {


    return (
        <div id="messages" data-readPw={readPw}>
            {messages.map((m, i) => <Message message={m} index={i} />)}
        </div>
    )
}

export default Messages
