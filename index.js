require('dotenv').config()
const { ethers } = require("ethers")

function getMPKFromMnemonic(mnemonic_phrases) {
    const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic_phrases)
    console.log('hdNode', hdNode)
    // default path for metamask hdWallet, ganache, hardhat...

    // https://hardhat.org/hardhat-network/docs/reference

    // npx hardhat node
    // hardhat default account with index 0
    // Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
    // Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

    const path = "44'/60'/0'/0"
    const masterNode = hdNode.derivePath(path)
    // console.log('masterNode', path, masterNode)
    const neuterMasterNode = masterNode.neuter()
    // console.log('neuterMasterNode', neuterMasterNode)
    const master_public_key = neuterMasterNode.extendedKey
    return master_public_key
}

function getAddressFromMPK(master_public_key, index) {
    const extendedKey = master_public_key
    const childIndex = index
    const neuterMasterNode = ethers.utils.HDNode.fromExtendedKey(extendedKey)
    // console.log('neuterMasterNode', neuterMasterNode)
    const neuterChildNode = neuterMasterNode.derivePath(childIndex.toString())
    // console.log('neuterChildNode', neuterChildNode)
    return neuterChildNode.address
}

function getAddressesFromMPK(master_public_key, fromIndex, toIndex) {
    const rs = []
    for(let index = Number(fromIndex); index <= Number(toIndex); index++) {
        rs.push({
            index,
            address: getAddressFromMPK(master_public_key, index)
        })
    }
    return rs
}

async function main() {
    console.log(ethers.utils.defaultPath)
    // const mnemonic_phrases = "test test test test test test test test test test test junk"
    const mnemonic_phrases = process.env.MNEMONIC

    const master_public_key = getMPKFromMnemonic(mnemonic_phrases)
    console.log(`master_public_key: ${master_public_key}`)

    /*
        show single address
    */

    // const index = 0
    const index = process.env.SINGLE_INDEX
    const address = getAddressFromMPK(master_public_key, index)
    console.log(`index: ${index}`)
    console.log(`address: ${address}`)

    /*
        show list of addresses fromIndex -> toIndex
    */

    // const fromIndex = 0
    // const toIndex = 10
    const fromIndex = process.env.FROM_INDEX
    const toIndex = process.env.TO_INDEX
    const addresses = getAddressesFromMPK(master_public_key, fromIndex, toIndex)
    console.log(`addresses with fromIndex: ${index}, toIndex: ${toIndex}`)
    console.log(JSON.stringify(addresses, 0, 2))
}

main()