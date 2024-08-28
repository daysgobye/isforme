import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';
import { page } from './schema';
import { eq } from 'drizzle-orm/sql';
import { PageData } from '../types';




export const get = async (BINDING: any, path: string,): Promise<PageData> => {
    const db = drizzle(BINDING, { schema });

    const dbpage = await db.query.page.findFirst({ where: (page, { eq }) => eq(page.path, path) })
    if (dbpage) {
        return pageToPageData(dbpage)
    } else {
        const tempvalue = { path, messages: JSON.stringify([]), readPw: null, writePw: null }
        await db.insert(page)
            .values(tempvalue)
            .onConflictDoNothing();
        return { ...tempvalue, messages: [] }
    }
}

const getOldData = async (BINDING: any, path: string, writePw: string | undefined) => {
    const oldData = await get(BINDING, path)
    if (oldData.writePw) {
        if (writePw !== oldData.writePw) { throw new Error("Wrong Password") }

    }
    return oldData
}
const setData = async (BINDING: any, path: string, newData: PageData) => {
    const db = drizzle(BINDING, { schema });
    const messageString = JSON.stringify(newData.messages)
    return await db.update(page).set({ messages: messageString }).where(eq(page.path, path)).returning({ updatedId: page.path })
}

export const update = async (BINDING: any, path: string, message: string, writePw: string | undefined) => {
    const oldData = await getOldData(BINDING, path, writePw)
    oldData.messages.push(message)
    const dbpage = await setData(BINDING, path, oldData)
    return message
}

export const updateAllMessages = async (BINDING: any, path: string, messages: string[], writePw: string | undefined) => {
    const oldData = await getOldData(BINDING, path, writePw)
    oldData.messages = messages
    const dbpage = await setData(BINDING, path, oldData)
    return messages
}



export const removeIndex = async (BINDING: any, path: string, index: number, writePw: string | undefined) => {
    const oldData = await getOldData(BINDING, path, writePw)

    if (index <= oldData.messages.length - 1) {
        oldData.messages.splice(index, 1)
    } else {
        throw new Error("Index out of bounds")
    }
    const dbpage = await setData(BINDING, path, oldData)

    return index
}

export const swapIndex = async (BINDING: any, path: string, indexA: number, indexB: number, writePw: string | undefined) => {
    const oldData = await getOldData(BINDING, path, writePw)
    console.log(oldData.messages.length, indexA <= oldData.messages.length - 1 && indexB <= oldData.messages.length - 1, indexA, indexB)
    if (indexA <= oldData.messages.length - 1 && indexB <= oldData.messages.length - 1) {
        let temp = oldData.messages[indexA];
        oldData.messages[indexA] = oldData.messages[indexB];
        oldData.messages[indexB] = temp;
    } else {
        throw new Error("Index out of bounds")
    }
    const dbpage = await setData(BINDING, path, oldData)

    return dbpage
}



export const SetPW = async (BINDING: any, path: string, writePw: string, readPw: string) => {
    const db = drizzle(BINDING, { schema });
    const oldData = await get(BINDING, path)
    if ((oldData.writePw === null || oldData.writePw === "") &&
        (oldData.readPw === null || oldData.readPw === "")) {
        console.log("setting passwords", path, { writePw, readPw })
        const dbpage = await db.update(page).set({ writePw, readPw }).where(eq(page.path, path)).returning({ updatedId: page.path })
    } else {
        throw new Error("PW already set")
    }
}

const pageToPageData = (page: { path: string, messages: string | null, readPw: string | null, writePw: string | null }) => {
    let messages: string[] = []
    try {
        if (page.messages)
            messages = JSON.parse(page.messages)
    } catch (error) {

    }
    return { ...page, messages } as PageData;
}