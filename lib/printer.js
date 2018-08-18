const BN = require('ethereumjs-util').BN;

// solc --hashes  print.sol
const selector = {
    'cd34a1ac': uint256, //keccak256('Uint256(uint256)')
    '74aec394': bool,
    '476a9f8f': int256,
    '0a329876': nl,
    'f263fdaa': bytes32,
    'ebfb412d': address,
    '24ace672': bytes,
    '589e6a98': string
};

// returns whether the hook is triggered
module.exports.printHook = function (toAddress, data) {
    // only trigger if toAddress is 0x0
    if ([...toAddress].find(x=>x!=0)) {
        return false;
    }
    const handler = selector[data.slice(0, 4).toString('hex')];
    if (!handler) {
        return false;
    }
    handler(data.slice(4));

    return true;
};

function uint256 (data) {
    process.stdout.write((new BN(data)).toString()+' ');
}

function nl () {
    process.stdout.write('\n');
}

function bool (data) {
    if (data.readInt8(31)===0) {
        process.stdout.write('false ');
    } else {
        process.stdout.write('true ');
    }
}

function int256 (data) {
    process.stdout.write((new BN(data)).fromTwos(256).toString()+' ');
}

function bytes32 (data) {
    process.stdout.write(data.toString('hex')+' ');
}

function address (data) {
    process.stdout.write(data.slice(12).toString('hex')+' ');
}

function getBytes (data) {
    //ref: https://solidity.readthedocs.io/en/develop/abi-spec.html
    //The first 32 bytes is always 0000000000000000000000000000000000000000000000000000000000000020
    //Then second 32 bytes is length
    const len = (new BN(data.slice(32, 64))).toNumber(); // assuming not huge
    return data.slice(64, 64+len);
}

function bytes (data) {
    process.stdout.write(getBytes(data).toString('hex')+' ');
}

function string (data) {
    process.stdout.write(getBytes(data).toString('utf8')+' ');
}
