# Receiving Emails

Each app has an unique email address (`<app>@<domain>`). You can hande incoming emails by declaring an `email` method:

```ts
import PostalMime from "npm:postal-mime";

export default {
    email: (msg: ReadableStream) => {
        const email = await PostalMime.parse(msg);

        console.log('Subject:', email.subject);
        console.log('HTML:', email.html);
        console.log('Text:', email.text);
    }
}
```

The email method receive a readable stream as it's first argument. You can use any library to parse the email content, I recommend [postal-mime](https://www.npmjs.com/package/postal-mime).

Support for sending emails is not implemented yet.

## Setup

You'll need to set an MX record to start receiving emails (assuming you have already set up the wildcard DNS record for your smallweb instance):

```txt
@  IN  MX  10 mail.smallweb.run
```

Then, specify the smtp address when you start smallweb:

```sh
smallweb up --smtp-addr :25
```
