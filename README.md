# 🚗 Sit and Drive App

Opinionated minimal boilerplate for starting React projects with Bootstrap and couple more goodies.

## 💡 Some prerequisites

Node version: `18.6.0`

If you use another version, please use [n](https://github.com/tj/n) to manage.

Highly suggest to use `hardhat-shorthand` package for easier development.

```shell
npm install --global hardhat-shorthand
```

More info in official [Hardhat docs](https://hardhat.org/hardhat-runner/docs/guides/command-line-completion).

## ⚙️ Install dependencies

```shell
$ yarn
```

## ⚙️ Config

Copy the example `.env` file and add the needed credentials.

```shell
cp example.env .env
```

Register at [Infura](https://www.infura.io/) ot [Alchemy](https://www.alchemy.com/) to get the `PROVIDER_URL`.

Export your wallet private key to `WALLET_PRIVATE_KEY`.

Register at [Etherscan](https://etherscan.io/) to get `ETHERSCAN_API_KEY`.

Note: The default network is `Sepolia`.

## 🚀 Available Scripts

In the project directory, you can run:

```shell
$ yarn start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
