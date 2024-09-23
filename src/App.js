import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./App.css"; // CSS File

const App = () => {
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [balance, setBalance] = useState(0);
    const [target, setTarget] = useState(0);
    const [deadline, setDeadline] = useState(0);
    const [raisedAmount, setRaisedAmount] = useState(0);
    const [minContribution, setMinContribution] = useState(0);
    const [contributors, setContributors] = useState(0);
    const [contribution, setContribution] = useState(0);

    const contractAddress = '0x928f9363A2202650Bd1C7e0d840FBc0Fc6e3Bd83'; // Replace with deployed contract address
    const contractABI = [
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_description",
            "type": "string"
          },
          {
            "internalType": "address payable",
            "name": "_recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "createRequests",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_requestNo",
            "type": "uint256"
          }
        ],
        "name": "makePayment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "refund",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "sendEth",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_target",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_deadline",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_requestNo",
            "type": "uint256"
          }
        ],
        "name": "voteRequest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "contributors",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "deadline",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getContractBalance",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "manager",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "minimumContribution",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "noOfContributors",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "numRequests",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "raisedAmount",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "requests",
        "outputs": [
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "address payable",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "completed",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "noOfVoters",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "target",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]; // Replace with your contract's ABI

    useEffect(() => {
        loadBlockchainData();
    }, []);

    const loadBlockchainData = async () => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();
            setAccount(accounts[0]);

            const contract = new web3.eth.Contract(contractABI, contractAddress);
            setContract(contract);

            const balance = await web3.eth.getBalance(contractAddress);
            setBalance(web3.utils.fromWei(balance, "ether"));

            const target = await contract.methods.target().call();
            setTarget(web3.utils.fromWei(target, "ether"));

            const deadline = await contract.methods.deadline().call();
            setDeadline(deadline);

            const raisedAmount = await contract.methods.raisedAmount().call();
            setRaisedAmount(web3.utils.fromWei(raisedAmount, "ether"));

            const minContribution = await contract.methods.minimumContribution().call();
            setMinContribution(web3.utils.fromWei(minContribution, "ether"));

            const contributors = await contract.methods.noOfContributors().call();
            setContributors(contributors);
        } else {
            console.error("Ethereum wallet not detected");
        }
    };

    const sendEth = async () => {
        try {
            await contract.methods.sendEth().send({
                from: account,
                value: Web3.utils.toWei(contribution, "ether"),
            });
            loadBlockchainData();
        } catch (error) {
            console.error("Error while sending ETH: ", error);
        }
    };

    const refund = async () => {
        try {
            await contract.methods.refund().send({ from: account });
            loadBlockchainData();
        } catch (error) {
            console.error("Error while processing refund: ", error);
        }
    };

    return (
        <div className="container">
            <h1>DecentraX FndIng</h1>
            <div className="contract-info">
                <p><strong>Account:</strong> {account}</p>
                <p><strong>Contract Balance:</strong> {balance} ETH</p>
                <p><strong>Target:</strong> {target} ETH</p>
                <p><strong>Raised Amount:</strong> {raisedAmount} ETH</p>
                <p><strong>Number of Contributors:</strong> {contributors}</p>
                <p><strong>Minimum Contribution:</strong> {minContribution} ETH</p>
                <p><strong>Deadline:</strong> {new Date(deadline * 1000).toLocaleString()}</p>
            </div>

            <input
                type="text"
                placeholder="Amount in ETH"
                value={contribution}
                onChange={(e) => setContribution(e.target.value)}
            />
            <button onClick={sendEth}>Contribute</button>
            <button onClick={refund}>Refund</button>

            <footer>
                <p>&copy; 2024 CrowdFunding DApp</p>
            </footer>
        </div>
    );
};

export default App;
