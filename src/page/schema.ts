import { text, blob, sqliteTable } from "drizzle-orm/sqlite-core";

export const page = sqliteTable('page', {
    path: text('path').primaryKey(),
    messages: text('messages'),
    readPw: text('readPw'),
    writePw: text('writePw'),
});