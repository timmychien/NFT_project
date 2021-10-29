var votingABI = [
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
                "internalType": "string",
                "name": "tokenName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "tokenSymbol",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "NFTaddress",
                "type": "address"
            }
        ],
        "name": "NFTCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "votingId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "nft",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "votes",
                "type": "uint256"
            }
        ],
        "name": "Vote",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "votingId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "uri",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "nftAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "author",
                "type": "string"
            }
        ],
        "name": "addCandidate",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "topic",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "votingId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "startAddTime",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "endAddTime",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "startVoteTime",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "endVoteTime",
                "type": "uint256"
            }
        ],
        "name": "addVoting",
        "type": "event"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "_candidate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "VotingId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "NFTName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "NFTSymbol",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "URI",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "NFTAddress",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "author",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "votes",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "_voting",
        "outputs": [
            {
                "internalType": "string",
                "name": "topic",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "VotingId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "startAddTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endAddTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "startVoteTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endVoteTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalParticipant",
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
                "internalType": "uint256",
                "name": "_votingId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_NFTName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_NFTSymbol",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_URI",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_author",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "authorAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "createCandidate",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "string",
                "name": "_topic",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_startAddTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_endAddTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_startVoteTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_endVoteTime",
                "type": "uint256"
            }
        ],
        "name": "createVoting",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "votingId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "participantId",
                "type": "uint256"
            }
        ],
        "name": "getParticipant",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "VotingId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "NFTName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "NFTSymbol",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "URI",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "NFTAddress",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "author",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "votes",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct NFTVoting.Candidate",
                "name": "",
                "type": "tuple"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "votingId",
                "type": "uint256"
            }
        ],
        "name": "getTotalParticipant",
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
        "constant": true,
        "inputs": [],
        "name": "getTotalVoting",
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
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "votingId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "participantId",
                "type": "uint256"
            }
        ],
        "name": "getnftAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "point",
        "outputs": [
            {
                "internalType": "contract ERC777",
                "name": "",
                "type": "address"
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
                "internalType": "address",
                "name": "newAddress",
                "type": "address"
            }
        ],
        "name": "setPointAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalVoting",
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
                "internalType": "uint256",
                "name": "_votingId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "participantId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "nftAddress",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "voter",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_votes",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "vote",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_votingId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "participantId",
                "type": "uint256"
            }
        ],
        "name": "voteBalances",
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
    }
]
module.exports.votingABI=votingABI;