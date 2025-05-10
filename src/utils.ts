import { removeIndex, swapIndex, update } from "./page";
import { Addon, Theme } from "./types";
import snarkdown from 'snarkdown';
// import { parse } from 'tiny-markdown-parser';


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
    const addon = addons.find(addon => addon.code === msg.trim())

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

    return `<article class="img-card">


            <img src=${message} />
            <div>
            ${message.startsWith("data:image") ? "Upload" : `
            <a target="blank" href=${message}>
                ${message}
            </a>
        `}
        </div>
        </article>`

}

const createTextLinks = (text: string) => {
    return (text || '').replace(/([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi, (_match: any, space: any, url: any) => {
        var hyperlink = url;
        if (!hyperlink.match('^https?://')) {
            hyperlink = 'http://' + hyperlink;
        }
        if (hyperlink.startsWith("https://ismy.space/")) {
            let pageName = url.split("/")
            pageName.shift()
            pageName.shift()
            pageName.shift()

            pageName = pageName.join("/")
            return space + '<a href="' + hyperlink + '" target="_blank">/ <span style="color:var(--h5-color)">' + pageName + '</span></a>';
        }
        return space + '<a href="' + hyperlink + '" target="_blank">' + url + '</a>';
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
        console.log(msg)
        const links = createTextLinks(msg)
        const languages = {
            html: "<!-- EDITOR-HTML: -->",
            md: "<!-- EDITOR-MD: -->",
            css: "<!-- EDITOR-css: -->",
        }
        if (msg.includes(languages.html) || msg.includes(languages.css)) {
            return msg
        }
        return snarkdown(links)
    }
    ))
}
const commands = {
    basic: { command: "", description: "post a message to your space in text, html, or markdown", options: [], example: "#this is my space" },
    help: { command: "/help", description: "Get list of commands.", options: [], example: "/help" },
    themeDark: { command: "/theme=dark", description: "Set theme to dark.", options: ["dark"], example: "/theme=dark" },
    themeLight: { command: "/theme=light", description: "Set theme to light.", options: ["light"], example: "/theme=dark" },
    test: { command: "/test", description: "Test out a message without saving it to the page.", options: ["any string / html / addon"], example: "/test &lt;h1> my headding&lt;/h1>" },
    removeId: { command: "/removeid=", description: "Removes given post.", options: ["number of post 0-∞"], example: "/removeid=5" },
    swapPosts: { command: "/swapposts=", description: "Swapps 2 given posts.", options: ["two numbers 0-∞"], example: "/swapposts=5,0" },
    moveUp: { command: "/moveup=", description: "Moves post up one.", options: ["number of post 0-∞"], example: "/moveup=5" },
    moveDown: { command: "/movedown=", description: "Moves post down one.", options: ["number of post 0-∞"], example: "/movedown=5" },
}
export const rpc = async (db: any, path: string, message: string, writePw: string | undefined): Promise<string | false> => {
    const call = message.toLowerCase().trim().split(" ").join("")
    switch (call) {
        case commands.themeDark.command:
            const darkmsg = Theme.DARK
            await update(db, path, darkmsg, writePw)
            return darkmsg
        case commands.themeLight.command:
            const lightmsg = Theme.LIGHT
            await update(db, path, lightmsg, writePw)
            return lightmsg
        case commands.help.command:
            const links = [
                ["/addons", "Addons"],
                ["/themes", "Themes"],
                ["/guide", "Guide"],
                ["/cole", "My Space 🥰"],
            ]
            return '<pre class="help"><h2>Commands</h2>' +
                ` ${Object.values(commands).map(command => `<p> <mark>${command.command}</mark> description: ${command.description} ${command.options.length ? `options: ${command.options.join(", ")} | ` : ""} Example: "${command.example}" </p> `).join("")} ` +
                '<h3>Helpfull Links</h3><ul>' +
                `${links.map(link => `<li><a href="${link[0]}" target="__blank">${link[1]}</a></li>`).join("")}` + '</ul></pre>'

        default:
            if (call.startsWith(commands.test.command)) {
                return message.substring(5)
            }
            if (call.startsWith(commands.removeId.command)) {
                try {
                    const removeId = Number(call.split("=").reverse()[0])
                    await removeIndex(db, path, removeId, writePw)
                    return `<!--removed post ${removeId}--> <p>removed post ${removeId} repload page to take effect</p> `
                } catch (error) {
                    return `error removing post please check id ${error}`
                }
            }
            if (call.startsWith(commands.swapPosts.command)) {
                try {
                    const ids = call.split("=").reverse()[0].split(",").map(Number)
                    await swapIndex(db, path, ids[0], ids[1], writePw)
                    return `<!--swapped posts ${ids}--> <p>swapped posts ${ids} repload page to take effect</p> `
                } catch (error) {
                    return `error swapping posts please check id ${error}`
                }
            }
            if (call.startsWith(commands.moveUp.command)) {
                try {
                    const id = Number(call.split("=").reverse()[0])
                    await swapIndex(db, path, id, id - 1, writePw)
                    return `<!--moved up post ${id}--> <p>moved up post ${id} repload page to take effect</p> `
                } catch (error) {
                    return `error moving up post please check id ${error}`
                }
            }
            if (call.startsWith(commands.moveDown.command)) {
                try {
                    const id = Number(call.split("=").reverse()[0])
                    await swapIndex(db, path, id, id + 1, writePw)
                    return `<!--moved down post ${id}--> <p>moved down post ${id} repload page to take effect</p> `
                } catch (error) {
                    return `error moving down post please check id ${error}`
                }
            }

            return false

    }
}