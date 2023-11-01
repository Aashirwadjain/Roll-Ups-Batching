const fs = require('fs');
const { ethers } = require('ethers');
const abi = require("./contractAbi.js");

const provider = new ethers.JsonRpcProvider('YOUR_RPC_URL');
const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY_HERE', provider);

async function batchSendEther(transactions) {

  const token = new ethers.Contract("CONTRACT_ADDRESS", abi, wallet);

  for (let i = 0; i < transactions.length; i++) {

    const tx = transactions[i];
    const value = ethers.parseEther(tx.amount, "18");

    const txResponse = await token.transfer(tx.address, value);
    const receipt = await txResponse.wait();

    // Store transaction hash in the original transactions array
    tx.transactionHash = receipt.hash;

    console.log(`Transaction Hash: ${receipt.hash}`);
  }

  // Write updated transactions with their hashes to the output.json file
  fs.writeFileSync('output.json', JSON.stringify(transactions, null, 2));

}

async function main() {
  const data = fs.readFileSync('output.json', 'utf8');
  const transactions = JSON.parse(data);
  await batchSendEther(transactions);
}

main().catch(error => {
  console.error('Error encountered:', error);
});

