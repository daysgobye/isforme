type MessageProps = { message: string }
export const Message = ({ message }: MessageProps) => {
    return (
        <p>{message}</p>
    )
}

type MessagesProps = { messages: string[] }
const Messages = ({ messages }: MessagesProps) => {
    return (
        <div id="messages">
            {messages.map(m => <Message message={m} />)}
        </div>
    )
}

export default Messages
