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
        const tempvalue = { path, messages: JSON.stringify([]) }
        await db.insert(page)
            .values(tempvalue)
            .onConflictDoNothing();
        return { ...tempvalue, messages: [] }
    }
}

export const update = async (BINDING: any, path: string, message: string) => {
    const db = drizzle(BINDING, { schema });
    const oldData = await get(BINDING, path)
    oldData.messages.push(message)
    const messageString = JSON.stringify(oldData.messages)
    const dbpage = await db.update(page).set({ messages: messageString }).where(eq(page.path, path)).returning({ updatedId: page.path })
    console.log(dbpage)
    return message
}

const pageToPageData = (page: { path: string, messages: string | null }) => {
    let messages: string[] = []
    try {
        if (page.messages)
            messages = JSON.parse(page.messages)
    } catch (error) {

    }
    return { path: page.path, messages }
}