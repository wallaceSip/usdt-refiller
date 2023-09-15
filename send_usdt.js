const ethers = require('ethers');
require('dotenv').config(); // Load environment variables from .env file
const abiDecoder = require('abi-decoder');
const fs = require('fs');
const path = require('path');

// Configure the Ethereum WebSocket provider and signer
const provider = new ethers.providers.WebSocketProvider(process.env.WEBSOCKET_PROVIDER);
const wallet = new ethers.Wallet(process.env.PRIV_KEY, provider);

// File path for the log file
const logFilePath = path.join(__dirname, 'txlogs.txt');

// Maximum file size in bytes (e.g., 850MB)
const maxFileSize = 850 * 1024 * 1024;

// Function to write logs to the log file
const writeLogToFile = (log) => {
  // Check if the log file exists
  const fileExists = fs.existsSync(logFilePath);
  if (fileExists) {
    // Get the current file size
    const fileSize = fs.statSync(logFilePath).size;
    // Truncate the file if it exceeds the maximum size
    if (fileSize >= maxFileSize) {
      fs.truncateSync(logFilePath);
    }
  }
  fs.appendFileSync(logFilePath, log + '\n');
};


const USDT_TOKEN_CONTRACT_ADDRESS = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'; // polygon mainnet 0xc2132D05D31c914a87C6611C10748AEb04B58e8F 
const ERC20_ABIJSON = require('./Usdt.json');
const CONTRACT_ABI = require('./reffilContract.json');

const receiverAddress = "0x0....."; // Contract address tracked and which will receive USDT

// Set the ABI for decoding transaction data
abiDecoder.addABI(ERC20_ABIJSON.abi);
// Set the ABI for decoding transaction data
abiDecoder.addABI(CONTRACT_ABI);

const usdtContractSigner = new ethers.Contract(USDT_TOKEN_CONTRACT_ADDRESS, ERC20_ABIJSON.abi, wallet);
const usdtContractChecker = new ethers.Contract(USDT_TOKEN_CONTRACT_ADDRESS, ERC20_ABIJSON.abi, provider);

// Function to send USDT tokens
const sendUSDT = async (to, amount) => {
  try {
    
    // Convert amount to the appropriate unit (e.g., wei or ether)
    const amountInWei = ethers.utils.parseUnits(amount.toString(), 'wei', 6);
    
    // Send USDT tokens
    const transaction = await usdtContractSigner.transfer(to, amountInWei);
    
    console.log(`USDT tokens sent. Transaction hash: ${transaction.hash}`);
    writeLogToFile(`USDT tokens sent. Transaction hash: ${transaction.hash}`);

  } catch (error) {
    console.error('Error sending USDT tokens:', error);
    writeLogToFile(`Error sending USDT tokens: ${error}`);
  }
};

// Event handling logic
const handleEvent = async (event) => {
  const contractUSDTBalance = await usdtContractChecker.balanceOf(receiverAddress); 
  const balanceAsNumber = contractUSDTBalance.toNumber(); // Convert BigNumber to a regular number
  
  console.log("Current USDT Balance:", balanceAsNumber / 10 ** 6);
  writeLogToFile(`Current USDT Balance: ${balanceAsNumber / 10 ** 6}`);

  // Check contract conditions and trigger token transfer
  if (balanceAsNumber < 2 * 10 ** 6) {
    // Customize the conditions for sending USDT tokens
    const tokenAmountToSend = 20 * 10 ** 6; // Adjust the amount as needed
    await sendUSDT(receiverAddress, tokenAmountToSend);
  } else{
    console.log("Don't need to reffil balance, its over 2 USDT.");
    writeLogToFile("Don't need to reffil balance, its over 2 USDT.");
  }
};

// Listen for events from your smart contract
const startEventListening = () => {
  const contract = new ethers.Contract(receiverAddress, CONTRACT_ABI, provider);
  
  console.log("Beggining listening to events.");
  writeLogToFile("Beggining listening to events.");

  contract.on('MaticDistributed', (event) => {
    // Handle the event
    console.log("EVENT DETECTED!!");
    handleEvent(event);
  })
  .on('error', (error) => {
    console.error('Error listening to events:', error);
    writeLogToFile(`Error listening to Events: ${error}`);
  });
};

// Start listening for events
startEventListening();
