import { JSONFilePreset } from "npm:lowdb@7.0.1/node"

const db = await JSONFilePreset("db.json", { emails: [] } as { emails: string[] })

export default {
    async fetch(req: Request) {
        const url = new URL(req.url)
        if (req.method === "POST") {
            const { email } = await req.json()
            if (db.data.emails.includes(email)) {
                return new Response("You are already on the waitlist!")
            }

            await db.update((data) => {
                data.emails.push(email)
            })

            return new Response("You have been added to the waitlist!")
        }

        if (url.pathname === "/readme") {
            return Response.redirect("https://readme.smallweb.run/cloud/doc.md")
        }

        if (url.pathname === "/db.json") {
            return new Response(JSON.stringify(db.data, null, 2), {
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }

        return new Response(waitlist, {
            headers: {
                "Content-Type": "text/html; charset=utf-8"
            }
        })
    }
}

const waitlist = /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Waitlist</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <style>
        body {
            background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
            background-size: 20px 20px;
        }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen bg-gray-900 text-gray-300 font-mono">
    <div class="container p-8 rounded shadow-md w-full max-w-md bg-gray-800 border border-gray-700">
        <h1 class="text-2xl font-bold mb-4"><a class="text-pink-300 hover:underline" href="/readme">Smallweb Cloud</a> is coming</h1>
        <p class="mb-4">Be among the first to try it out!</p>
        <form id="waitlist-form" class="space-y-5">
            <div>
                <input type="email" id="email" placeholder="Email" name="email" required class="input mt-1 block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm bg-gray-700 text-gray-300 border border-gray-600">
            </div>
            <button type="submit" class="button w-full py-2 px-4 rounded-md bg-pink-500 text-gray-100 hover:bg-pink-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">Join</button>
        </form>
    </div>
    <script>
        document.getElementById('waitlist-form').addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const response = await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            const message = await response.text();
            alert(message);
        });
    </script>
</body>
</html>
`
