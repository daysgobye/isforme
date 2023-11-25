import { Addon } from "./types";

export const getAddonList = async (): Promise<Addon[]> => {
    try {
        const listUrl = "https://raw.githubusercontent.com/daysgobye/isforme_addons/main/addons.json"
        const response = await fetch(listUrl);
        const addons = await response.json();
        //@ts-ignore
        return addons.addons as Addon[]
    } catch (error) {
        console.log("error getting list", error)
        return []
    }

}

export const getAddon = async (msg: string) => {
    const addons = await getAddonList()
    const addon = addons.find(addon => addon.code === msg)
    if (addon) {
        const files = await Promise.all(addon.files.map(async file => {
            const response = await fetch(file);
            const addonFile = await response.text()
            return addonFile
        }
        ))
        return files.join("\n")
    } else {
        console.log("no addon found")
        return msg
    }
}


const returnImage = (message: string) => {

    return `<div>
            <img src=${message} />
            <br />
            ${message.startsWith("data:image") ? "" : `
                <a target="blank" href=${message}>
                    ${message}
                </a>
            `}

        </div>`

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



export const handleMessages = async (messages: string[]) => {
    return await Promise.all(messages.map(async msg => {
        if (msg.startsWith("addon:")) {
            return await getAddon(msg)
        }
        const imageRegex = new RegExp(
            /((?:https?\:\/\/)(?:[a-zA-Z]{1}(?:[\w\-]+\.)+(?:[\w]{2,5}))(?:\:[\d]{1,5})?\/(?:[^\s\/]+\/)*(?:[^\s]+\.(?:jpe?g|gif|png))(?:\?\w+=\w+(?:&\w+=\w+)*)?)/gi
        );
        const img = msg.match(imageRegex);
        if (img || msg.startsWith("data:image")) {
            return returnImage(msg)
        }
        return createTextLinks(msg)
    }
    ))
}