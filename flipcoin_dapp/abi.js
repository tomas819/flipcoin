var abi = [
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "playAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "playResult",
        "type": "bool"
      }
    ],
    "name": "eventPlayResult",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "withdrawResult",
        "type": "uint256"
      }
    ],
    "name": "eventWithdrawResult",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "randomNumber",
        "type": "uint256"
      }
    ],
    "name": "generatedRandomNumber",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "description",
        "type": "string"
      }
    ],
    "name": "logNewProvableQuery",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "test",
        "type": "string"
      }
    ],
    "name": "testCallback",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "latestNumber",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_myid",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "_result",
        "type": "string"
      }
    ],
    "name": "__callback",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_queryId",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "_result",
        "type": "string"
      },
      {
        "internalType": "bytes",
        "name": "_proof",
        "type": "bytes"
      }
    ],
    "name": "__callback",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "coinSide",
        "type": "uint256"
      }
    ],
    "name": "flipcoinPlayOracle",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "coinSide",
        "type": "uint256"
      }
    ],
    "name": "flipcoinPlay",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getCoinPlayer",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "playWin",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "playLoss",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "playBalance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "playLastBet",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "playLastCoinSide",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "playLastResult",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "playWaiting",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "playExists",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getCoinPlayerBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "withdrawWinBalance",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "destroyContract",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
