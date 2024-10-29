import clipboard from 'npm:clipboardy@4.0.0';
import open from 'jsr:@rdsq/open@1.0.1'

export default {
    async run() {
        await clipboard.write("Hello, clipboard!")
        await open("https://deno.land/")
    }
}
