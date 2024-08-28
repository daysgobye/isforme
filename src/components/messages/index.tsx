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

type MessagesProps = { messages: string[] }
const Messages = ({ messages }: MessagesProps) => {


    return (
        <div id="messages">
            {messages.map((m, i) => <Message message={m} index={i} />)}
        </div>
    )
}

export default Messages
