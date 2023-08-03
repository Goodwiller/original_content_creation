# Original COntent Creation - Empowering Digital Creators

## Introduction
Welcome to our Ethereum NFT Marketplace, a decentralized platform that empowers digital creators, artists, and collectors to showcase and trade their unique Non-Fungible Tokens (NFTs). Built on the Ethereum blockchain using Hardhat for smart contract development and React for the frontend, our marketplace provides a secure, transparent, and seamless environment for buying, selling, and exploring NFTs. Immerse yourself in a world where creativity knows no bounds and the value of art is redefined.

## Technology Stack & Tools

- Solidity (Writing Smart Contract)
- Javascript (React & Testing)
- [Ethers](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ipfs](https://ipfs.io/) (Metadata storage)
- [React routers](https://v5.reactrouter.com/) (Navigational components)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/), should work with any node version below 16.5.0
- Install [Hardhat](https://hardhat.org/)

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
```
$ cd original_content_creation
$ npm install
```
### 3. Boot up local development blockchain
```
$ cd original_content_creation
$ npx hardhat node
```

### 4. Connect development blockchain accounts to Metamask
- Copy private key of the addresses and import to Metamask
- Connect your metamask to hardhat blockchain, network 127.0.0.1:8545.
- If you have not added hardhat to the list of networks on your metamask, open up a browser, click the fox icon, then click the top center dropdown button that lists all the available networks then click add networks. A form should pop up. For the "Network Name" field enter "Hardhat". For the "New RPC URL" field enter "http://127.0.0.1:8545". For the chain ID enter "31337". Then click save.  


### 5. Migrate Smart Contracts
`npx hardhat run src/backend/scripts/deploy.js --network localhost`

### 6. Run Tests
`$ npx hardhat test`

### 7. Launch Frontend
`$ npm run start`

## Contributing
- [Rahul Kumar Singh](https://github.com/Goodwiller) 
- [Ravindra Kumar](https://github.com/malviyaravi) 

## License
This project is licensed under the MIT License.

## Acknowledgments
We would like to express our gratitude to the open-source community and the developers behind Ethereum, Hardhat, and React for providing the tools that made this project possible.

