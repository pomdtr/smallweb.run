import { Hono } from "npm:hono@4.6.3"

const app = new Hono({})

app.get("/", (c) => {
    return c.redirect("/listDocsets")
})

type Docset = {
    name: string
    slug: string
    release?: string
}

app.get("/listDocsets", async (c) => {
    const resp = await fetch("https://devdocs.io/docs/docs.json")
    if (!resp.ok) {
        return c.json({
            error: "Failed to fetch docs.json",
        }, {
            status: resp.status,
        })
    }
    const docsets: Docset[] = await resp.json()

    return c.json({
        type: "list",
        items: docsets.map((docset) => ({
            title: docset.name,
            subtitle: (docset.release || "latest"),
            accessories: [docset.slug],
            actions: [
                {
                    title: "Browse entries",
                    type: "push",
                    command: "list-entries",
                    input: {
                        slug: docset.slug,
                    }
                }
            ]
        }))
    })
})

app.get("/listEntries", async (c) => {
    const { slug }: { slug: string } = JSON.parse(c.req.query("input")!)

    const resp = await fetch(`https://devdocs.io/docs/${slug}.json`)
    if (!resp.ok) {
        return c.json({
            type: "error",
            message: "Failed to fetch docset",
        }, {
            status: resp.status,
        })
    }

})
