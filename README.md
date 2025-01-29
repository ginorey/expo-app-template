# Expo onchain app template

This is a template that handles the basics of an onchain app, specifically has all the user management and smart wallet logic built in.

- 🔹 auto login as guest on launch
- 🔹 smart wallet only, gas sponsored, ready to transact with no popups
- 🔹 all amounts shown in $
- 🔹 link social auth to backup account
- 🔹 link external wallets
- 🔹 UI to deposit into smart account
- 🔹 UI to withdraw

Built with

- 🔸 react native 0.76+
- 🔸 expo 52+
- 🔸 nativewind 4+
- 🔸 thirdweb

Fork this repo, add your own logic, and start building!

## Live demo

[Watch the live demo](https://x.com/joenrv/status/1884729861732000221)

## Setup

Create a new project in the [thirdweb dashboard](https://thirdweb.com/team).

Copy the `.env.example` file to `.env`

```bash
cp .env.example .env
```

Add your client id to the `.env` file

```bash
EXPO_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
```

## Run the app

1. Install dependencies

```bash
yarn install
```

3. Start the app (ios or android)

```bash
yarn ios
# or yarn android
```

## Learn more

Learn more about building apps with expo and thirdweb with the following resources:

- [thirdweb dashboard](https://thirdweb.com/team) - manage your API keys, smart wallets policies, project settings, and more
- [thirdweb docs](https://portal.thirdweb.com/) - learn how to use thirdweb to connect wallets, transact, and read onchain data

## Join the community

Join our community of developers creating universal apps.

- [thirdweb on GitHub](https://github.com/thirdweb-dev/js): View our open source platform and contribute.
- [Discord community](https://discord.gg/thirdweb): Chat with thirdweb devs and ask questions.
