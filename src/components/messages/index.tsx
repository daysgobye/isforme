type MessageProps = { message: string }
export const Message = ({ message }: MessageProps) => {

    return (
        <div class="fm-message" dangerouslySetInnerHTML={{
            __html: message
        }}>

        </div>
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
