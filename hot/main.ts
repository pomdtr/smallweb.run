let state = "🥶"

export default {
    fetch: () => {
        const content = html(state)
        state = "🥵"
        return new Response(content, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        })
    }
}

const html = (state: string) => /*html*/ `
<html>
<head>
    <title>${state === "🥶" ? "Cold" : "Hot"}</title>
    <link rel="icon" href="https://fav.farm/${state}" />
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-size: 100px;
            overflow: hidden;
            flex-direction: column;
        }
        p {
            font-size: 20px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    ${state}
    <p>
        ${state === "🥶" ? "We're freezing here. Please reload!" : "Things are getting spicy!"}
    </p>
</body>
</html>
`
