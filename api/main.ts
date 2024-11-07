import { api } from "./mod.ts"

export default api({
    verifyToken: (token: string) => {
        return Deno.env.get("API_TOKEN") === token
    }
})
