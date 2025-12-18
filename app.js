// ================== GLOBALS ==================
let provider;
let signer;
let contract;

const ContractAddress = "0xa9d07C6d169a0C1896BB54D274f457d55be82985";

const ContractABI = [
  {
    "inputs": [{ "internalType": "uint256", "name": "lockSeconds", "type": "uint256" }],
    "name": "lockTime",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "deposits",
    "outputs": [
      { "internalType": "uint256", "name": "amount", "type": "uint256" },
      { "internalType": "uint256", "name": "unlockTime", "type": "uint256" },
      { "internalType": "bool", "name": "active", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// ================== UI ELEMENTS ==================
const connectBtn = document.getElementById("connectWallet");
const depositBtn = document.getElementById("depositBtn");
const withdrawBtn = document.getElementById("withdrawBtn");

const depositAmountInput = document.getElementById("depositAmount");
const lockSecondsInput = document.getElementById("lockSeconds");

const walletAddressUI = document.getElementById("walletAddress");
const amountUI = document.getElementById("amount");
const unlockTimeUI = document.getElementById("unlockTime");
const withdrawnUI = document.getElementById("withdrawn");
// ================== LOAD DEPOSIT INFO ==================
async function loadDepositInfo(){
	try{
		const address = await signer.getAddress();
		const data = await contract.deposits(address);
		if(data.amount==0n){
			amountUI.innerText="0";
			unlockTimeUI.innerText="N/A";
			withdrawnUI.innerText="No";
			return;
		}
		amountUI.innerText = ethers.formatEther(data.amount);
		unlockTimeUI.innerText = new Date(Number(data.unlockTime)*1000).toLocaleString();
		withdrawnUI.innerText = data.active ? "No" : "Yes";
	}catch(err){
		console.error(err);
		alert("Failed to load deposit info");
	}
}

// ================== CONNECT WALLET ==================
connectBtn.onclick = async () => {
  if (!window.ethereum) {
    alert("MetaMask not installed");
    return;
  }

  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();

    const network = await provider.getNetwork();
    if (network.chainId !== 11155111n) {
      alert("Switch to Sepolia network");
      return;
    }

    contract = new ethers.Contract(ContractAddress, ContractABI, signer);

    const address = await signer.getAddress();
    walletAddressUI.innerText =
      "Connected: " + address.slice(0, 6) + "..." + address.slice(-4);

    connectBtn.innerText = "Wallet Connected";
    document.getElementById("vaultUI").style.display = "block";

    await loadDepositInfo();
  } catch (err) {
    console.error(err);
    alert("Wallet connection failed");
  }
};


// ================== DEPOSIT ETH ==================
depositBtn.onclick = async()=>{
	const ethamount = depositAmountInput.value;
	const lockSeconds = lockSecondsInput.value;
	if(ethamount<=0 || lockSeconds<=0){
		alert("Enter valid amount and lock time");
		return;
	}
	try{
		depositBtn.innerText = "Processing...";
		depositBtn.disabled = true;
		const tx = await contract.lockTime(lockSeconds, {value: ethers.parseEther(ethamount)});
		await tx.wait();
		depositBtn.innerText = "Deposit ETH";
		depositBtn.disabled = false;
		await loadDepositInfo();

	}catch (err) {
    console.error(err);
    alert("Deposit failed");
    depositBtn.innerText = "Deposit";
    depositBtn.disabled = false;
  }
}
withdrawBtn.onclick = async () => {
  try {
    withdrawBtn.innerText = "Withdrawing...";
    withdrawBtn.disabled = true;

    const tx = await contract.withdraw();
    await tx.wait();

    alert("Withdraw successful");

    withdrawBtn.innerText = "Withdraw";
    withdrawBtn.disabled = false;

    await loadDepositInfo();
  } catch (err) {
    console.error(err);
    alert("Withdraw failed or locked");
    withdrawBtn.innerText = "Withdraw";
    withdrawBtn.disabled = false;
  }
};
window.ethereum?.on("accountsChanged", () => window.location.reload());
window.ethereum?.on("chainChanged", () => window.location.reload());