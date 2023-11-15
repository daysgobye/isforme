import { PageData } from "./types";

const setCache = async (c: any, key: string, data: string) => await c.env.IS_FOR_ME.put(key, data);
const getCache = async (c: any, key: string) => await c.env.IS_FOR_ME.get(key);


export const addMessage = async (c: any, key: string, message: string) => {
    const data = await get(c, key, { route: key, messages: [] })
    data.messages.push(message)
    await set(c, key, data)
};


export const set = async (c: any, key: string, data: PageData) => {
    let value = ""
    try {
        value = JSON.stringify(data)
    } catch (error) {

    }
    console.log("setting value:", value)
    await setCache(c, key, value)
    return value
};
export const get = async (c: any, key: string, fallback: PageData = { route: "/", messages: [] }): Promise<PageData> => {
    try {
        const value = await getCache(c, key);
        if (value) {
            return JSON.parse(value);
        } else {
            return fallback
        }

    } catch (error) {
        return fallback
    }

}

