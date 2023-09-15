# Ethereum Event Listener and Token Sender

This Node.js script listens for events emitted by an EVM smart contract and sends tokens under specific conditions. It uses the ethers.js library to interact with the EVM blockchain.

## Prerequisites

Before running this script, ensure you have the following prerequisites:

1. Node.js: Make sure you have Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

2. Ethereum Wallet and Private Key: You'll need an Ethereum wallet and its private key to sign transactions and interact with the blockchain.

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/wallaceSip/usdt-refiller.git

2. **Navigate to the Project Directory**:
   ```bash
   cd your-repo

3. **Install Dependencies**:
Run the following command to install the required Node.js packages:
    ```bash
   npm install

4. **Create a Configuration File**:
Create a .env file in the project directory with the following content:
    ```bash
    WEBSOCKET_PROVIDER=wss://your.ethereum.websocket.provider
    PRIV_KEY=yourPrivateKeyHere

Replace wss://your.ethereum.websocket.provider with the URL of your Ethereum WebSocket provider and yourPrivateKeyHere with your private key.

## Usage

To run the script, use the following command:
   ```bash
    node send_usdt.js
   ```
  
The script will start listening for events from your smart contract and perform token transfers based on predefined conditions.

## Customize

You can customize the script by modifying the following variables in the send_usdt.js file:

- USDT_TOKEN_CONTRACT_ADDRESS: The address of the USDT token contract.
- receiverAddress: The blockchain address that will receive USDT tokens.
- Conditions for sending USDT tokens: Modify the logic in the handleEvent function to adjust the conditions for sending tokens.

## Logging

The script logs its activity to a txlogs.txt file in the project directory. You can check this file for transaction-related information and errors.
