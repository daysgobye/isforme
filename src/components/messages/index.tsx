type MessageProps = { message: string }
export const Message = ({ message }: MessageProps) => {
    const imageRegex = new RegExp(
        /((?:https?\:\/\/)(?:[a-zA-Z]{1}(?:[\w\-]+\.)+(?:[\w]{2,5}))(?:\:[\d]{1,5})?\/(?:[^\s\/]+\/)*(?:[^\s]+\.(?:jpe?g|gif|png))(?:\?\w+=\w+(?:&\w+=\w+)*)?)/gi
    );
    const img = message.match(imageRegex);
    if (img || message.startsWith("data:image")) {
        return (
            <div>
                <img src={message} />
                <br />
                {message.startsWith("data:image") ? "" : (
                    <a target="blank" href={message}>
                        {message}
                    </a>
                )}

            </div>
        )
    }
    const createTextLinks = (text: string) => {

        return (text || '').replace(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi, (_match: any, space: any, url: any) => {
            var hyperlink = url;
            if (!hyperlink.match('^https?://')) {
                hyperlink = 'http://' + hyperlink;
            }
            return space + '<a href="' + hyperlink + '">' + url + '</a>';
        });
    }


    console.log(createTextLinks(message))
    return (
        <div dangerouslySetInnerHTML={{
            __html: createTextLinks(message).replaceAll(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
                , "<script>console.log('script tag not allowed😜')</script>")
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
