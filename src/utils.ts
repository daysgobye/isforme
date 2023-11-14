const setCache = async (c: any, key: string, data: string) => await c.env.ISFORME.put(key, data);
const getCache = async (c: any, key: string) => await c.env.ISFORME.get(key);

export const set = async (c: any, key: string, data: Record<string, any>) => {
    let value = ""
    try {
        value = JSON.stringify(data)
    } catch (error) {

    }

    await setCache(c, key, value)
};
export const get = async (c: any, key: string, fallback: Record<string, any> = {}) => {
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

