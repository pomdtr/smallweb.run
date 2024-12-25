import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.48/deno-dom-wasm.ts";

const SYSTEM_PROMPT = `You are an AI assistant that helps create Smallweb applications using Deno and TypeScript.
When asked to create an app, you MUST respond using XML tags to create the files and directories.

ALWAYS use this format:
<smallweb:mkdir><path>project-name</path></smallweb:mkdir>
<smallweb:mkdir><path>project-name/src</path></smallweb:mkdir>
<smallweb:write><path>project-name/main.ts</path><content>// Your code here</content></smallweb:write>

For a basic hello world app, create something like this:

<smallweb:mkdir><path>hello-world</path></smallweb:mkdir>
<smallweb:write><path>hello-world/main.ts</path><content>
// Simple Smallweb Hello World
export default {
  fetch: async (req: Request): Promise<Response> => {
    const url = new URL(req.url);
    console.log("Request:", req.method, url.pathname);

    return new Response("Hello Smallweb!", {
      headers: { "Content-Type": "text/plain" },
    });
  },
};
</content></smallweb:write>
<smallweb:write><path>hello-world/smallweb.json</path><content>
{
  "name": "hello-world",
  "version": "1.0.0",
  "entrypoint": "main.ts"
}
</content></smallweb:write>

Note: For more complex apps, you can add utilities like log.ts, middleware.ts, or supabase.ts.
These would need to be created as separate files with their own implementations.

Example advanced features you can request:
- Database integration with Supabase
- Structured logging with Loki
- Rate limiting and CORS middleware
- Type definitions and interfaces`;

const app = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smallweb Vue App</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <style>
      .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
      .chat {
        background: white; border-radius: 8px; padding: 1rem;
        height: 500px; overflow-y: auto; margin-bottom: 1rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .input-area { display: flex; gap: 1rem; }
      textarea {
        flex: 1; padding: 0.5rem; border-radius: 4px;
        border: 1px solid #ddd; min-height: 80px;
      }
      button {
        padding: 0.5rem 1rem; background: #0066ff;
        color: white; border: none; border-radius: 4px;
        cursor: pointer;
      }
      button:disabled { background: #99c2ff; }
      button:hover:not(:disabled) { background: #0052cc; }
      .message { margin-bottom: 1rem; padding: 0.5rem; border-radius: 4px; }
      .user { background: #f0f0f0; }
      .bot { background: #f5f9ff; }
    </style>
</head>
<body>
    <div id="app"></div>
    <script>
      const app = {
        setup() {
          const { h, ref } = Vue;

          const messages = ref([]);
          const input = ref('');
          const isLoading = ref(false);

          async function sendMessage() {
            if (!input.value.trim()) return;

            messages.value.push({ type: 'user', content: input.value });
            isLoading.value = true;

            try {
              const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input.value })
              });

              if (!response.ok) throw new Error(await response.text());
              const data = await response.json();
              messages.value.push({ type: 'bot', content: data.response });
            } catch (error) {
              messages.value.push({
                type: 'bot',
                content: \`Error: \${error.message}\\n\\nPlease try again.\`
              });
            } finally {
              isLoading.value = false;
              input.value = '';
            }
          }

          return () => h('div', { class: 'container' }, [
            h('div', { class: 'chat' },
              messages.value.map((msg, i) =>
                h('div', { key: i, class: ['message', msg.type] }, [
                  h('strong', msg.type === 'user' ? 'You: ' : 'smallbot: '),
                  h('div', { innerHTML: msg.content.replace(/\\n/g, '<br>') })
                ])
              )
            ),
            h('div', { class: 'input-area' }, [
              h('textarea', {
                value: input.value,
                onInput: e => input.value = e.target.value,
                placeholder: 'Tell smallbot what kind of app to create...',
                onKeyup: e => e.ctrlKey && e.key === 'Enter' && sendMessage()
              }),
              h('button', {
                onClick: sendMessage,
                disabled: isLoading.value
              }, isLoading.value ? 'Creating...' : 'Create')
            ])
          ]);
        }
      };

      Vue.createApp(app).mount('#app');
    </script>
</body>
</html>
`;

export default {
    fetch: async (req: Request) => {
        const url = new URL(req.url);
        console.log("Request:", req.method, url.pathname);

        // Serve the main app
        if (url.pathname === "/" || url.pathname === "/index.html") {
            return new Response(app, {
                headers: { "Content-Type": "text/html" },
            });
        }

        // Handle chat API
        if (url.pathname === "/api/chat" && req.method === "POST") {
            try {
                const { message } = await req.json();
                const apiKey = Deno.env.get("OPENROUTER_API_KEY");

                if (!apiKey) throw new Error("API key not found");

                const llmResponse = await fetch(
                    "https://openrouter.ai/api/v1/chat/completions",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${apiKey}`,
                            "HTTP-Referer": "https://smallweb.run",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            model: "google/gemini-pro",
                            messages: [
                                { role: "system", content: SYSTEM_PROMPT },
                                { role: "user", content: message },
                            ],
                        }),
                    }
                );

                if (!llmResponse.ok) {
                    throw new Error(await llmResponse.text());
                }

                const data = await llmResponse.json();
                const aiResponse = data.choices[0].message.content;

                // Process XML and create files
                const parser = new DOMParser();
                const doc = parser.parseFromString(aiResponse, "text/html");
                const operations = [];

                if (doc) {
                    // Get the app name from the first directory in the path
                    const firstPath =
                        doc.querySelector("smallweb\\:mkdir path")?.textContent || "";
                    const appName = firstPath.split("/")[0];

                    // Get parent directory and construct the app directory path
                    const parentDir = Deno.cwd().split("/").slice(0, -1).join("/");
                    const appDir = `${parentDir}/${appName}`;
                    console.log("Creating app in:", appDir);

                    // Process mkdir tags
                    for (const mkdir of doc.querySelectorAll("smallweb\\:mkdir")) {
                        const path = mkdir.querySelector("path")?.textContent;
                        if (path) {
                            try {
                                const fullPath = `${parentDir}/${path}`;
                                console.log("Creating directory:", fullPath);
                                await Deno.mkdir(fullPath, { recursive: true });
                                operations.push(`Created directory: ${fullPath}`);
                            } catch (error) {
                                operations.push(
                                    `Error creating directory ${path}: ${(error as Error).message}`
                                );
                            }
                        }
                    }

                    // Process write tags
                    for (const write of doc.querySelectorAll("smallweb\\:write")) {
                        const path = write.querySelector("path")?.textContent;
                        const content = write.querySelector("content")?.textContent;
                        if (path && content) {
                            try {
                                const fullPath = `${parentDir}/${path}`;
                                const dirPath = fullPath.substring(
                                    0,
                                    fullPath.lastIndexOf("/")
                                );
                                await Deno.mkdir(dirPath, { recursive: true });

                                console.log("Writing file:", fullPath);
                                await Deno.writeTextFile(fullPath, content);
                                operations.push(`Wrote file: ${fullPath}`);
                            } catch (error) {
                                operations.push(`Error writing file ${path}: ${(error as Error).message}`);
                            }
                        }
                    }
                }

                let finalResponse = aiResponse;
                if (operations.length > 0) {
                    finalResponse +=
                        "\n\nOperations performed:\n" + operations.join("\n");
                }

                return new Response(JSON.stringify({ response: finalResponse }), {
                    headers: { "Content-Type": "application/json" },
                });
            } catch (error) {
                console.error("API Error:", error);
                return new Response(JSON.stringify({ error: (error as Error).message }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }
        }

        return new Response("Not found", { status: 404 });
    },
};
