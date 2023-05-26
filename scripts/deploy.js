const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
    //setup acounts and variables
    const [deployer] = await ethers.getSigners()
    const NAME = "Aloha"
    const SYMBOL = "DC"

    //deploymnt of the contract to the blockchain goes here
    const Aloha = await ethers.getContractFactory("Aloha")
    const aloha = await Aloha.deploy(NAME, SYMBOL)
    await aloha.deployed()

    console.log('Deployed aloha Contract at:' +aloha.address +'\n')

    //create 3 channels
    const CHANNEL_NAMES = ["Arts", "Science", "Physics"]
    const COSTS = [tokens(1), tokens(0), tokens(0.25)]

    for(var i = 0 ; i < 3; i++){
      const transaction = await aloha.connect(deployer).createChannel(CHANNEL_NAMES[i], COSTS[i])
      await transaction.wait()

      console.log('created channel: '+CHANNEL_NAMES[i]+'\n')
      //console.log('Created text channel # ${CHANNEL_NAMES[i]}\n')
    }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});