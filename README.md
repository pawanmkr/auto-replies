## Auto Email Replies using Gmail API and Node.js

### Local Setup

I highly recommend you to use pnpm over npm but it works with both of the package managers, pnpm is just faster that npm.

### Installation

Clone or Fork the repo

```bash
cd auto-replies
pnpm install
```

### Credentials

You also need Credentials to obtain that simple follow this guide from google https://developers.google.com/workspace/guides/create-credentials

Once you have generated your credentials.json file put it into the root directory i.e. auto-replies/

```
{
  "web": {
    "client_id": "REPLACE WITH YOURS",
    "project_id": "REPLACE WITH YOURS",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "REPLACE WITH YOURS",
    "redirect_uris": [
      "http://localhost:3000/oauth2callback",
      "https://developers.google.com/oauthplayground"
    ]
  }
}
```

### Start

To Start simple run command

```bash
pnpm run start
```

By default, the port is set to `8888` So, Visit http://localhost:8888 in your browser or API testing tool and allow the permissions on popup by Google. That's all.

Rest of the work app will do on it's own.

You can refer to the Demo Video for help: https://www.youtube.com/watch?v=qQyN2ij6IG8
