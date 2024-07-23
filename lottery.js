import web3 from './web3'

const address = import.meta.env.VITE_ADDRESS;
const abi = [
    { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
    {
        anonymous: false,
        inputs: [
            { indexed: true, name: 'oldOwner', type: 'address' },
            { indexed: true, name: 'newOwner', type: 'address' }
        ],
        name: 'ManagerSet',
        type: 'event'
    },
    {
        inputs: [],
        name: 'enter',
        outputs: [],
        stateMutability: 'payable',
        type: 'function'
    },
    {
        inputs: [],
        name: 'getPlayers',
        outputs: [{ type: 'address[]' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'manager',
        outputs: [{ type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [],
        name: 'pickWinner',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    },
    {
        inputs: [{ type: 'uint256' }],
        name: 'players',
        outputs: [{ type: 'address' }],
        stateMutability: 'view',
        type: 'function'
    }
];

export default new web3.eth.Contract(abi, address);