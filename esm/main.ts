const { SMALLWEB_APP_NAME } = Deno.env.toObject()

export default {
    fetch(req: Request) {
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': '*',
        }

        if (req.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders })
        }

        const url = new URL(req.url)
        if (url.pathname === '/') {
            return new Response(null, {
                status: 302,
                headers: {
                    'Location': `https://esm.sh/gh/pomdtr/smallweb.run/${SMALLWEB_APP_NAME}/main.ts`,
                    ...corsHeaders
                }
            })
        }

        if (url.searchParams.has('v')) {
            return new Response(null, {
                status: 302,
                headers: {
                    'Location': `https://esm.sh/gh/pomdtr/smallweb.run@${url.searchParams.get('v')}${url.pathname}`,
                    ...corsHeaders
                }
            })
        }

        return new Response(null, {
            status: 302,
            headers: {
                'Location': `https://esm.sh/gh/pomdtr/smallweb.run/${url.pathname}`,
                ...corsHeaders
            }
        })
    }
}
