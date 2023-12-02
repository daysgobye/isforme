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

export const update = async (BINDING: any, path: string, message: string, writePw: string | undefined) => {
    const db = drizzle(BINDING, { schema });
    const oldData = await get(BINDING, path)
    if (oldData.writePw) {
        if (writePw !== oldData.writePw) { throw new Error("Wrong Password") }
        else {
            oldData.messages.push(message)

        }
    } else {
        oldData.messages.push(message)
    }
    const messageString = JSON.stringify(oldData.messages)
    const dbpage = await db.update(page).set({ messages: messageString }).where(eq(page.path, path)).returning({ updatedId: page.path })
    return message
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