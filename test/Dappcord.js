const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Aloha", function () {
let aloha
let deployer, user

const NAME = "Aloha"
const SYMBOL = "DC"

  beforeEach(async() => {
    //Setup accounts
    [deployer, user] = await ethers.getSigners()
    //Deploy contract
    const Aloha = await ethers.getContractFactory("Aloha")
    aloha = await Aloha.deploy(NAME, SYMBOL)

    //Create a channel
    const transaction = await aloha.connect(deployer).createChannel("Arts", tokens(1))
    await transaction.wait()
  })

  describe("Deployment", function() {
    it("Sets the name", async () => {
    //Fetch name
    let result = await aloha.name()
    //Check name
    expect(result).to.equal(NAME)
    })

    it("Sets the symbol", async () => {
      //Fetch symbol
      let result = await aloha.symbol()
      //Check symbol
       expect(result).to.equal(SYMBOL)
      })

      it("Sets the owner", async () => {
        //Fetch symbol
        let result = await aloha.owner()
        //Check symbol
         expect(result).to.equal(deployer.address)
        })
  })
  
  describe("Creating Channels", () => {
    it("Returns total channels", async() => {
      const result = await aloha.totalChannels()
      expect(result).to.be.equal(1)
    })

    it("Returns channels attributes", async() => {
      const channel = await aloha.getChannel(1)
      expect(channel.id).to.be.equal(1)
      expect(channel.name).to.be.equal("Arts")
      expect(channel.cost).to.be.equal(tokens(1))
    })
  })

  describe("Joining Channels", () => {
    const ID = 1
    const AMOUNT = ethers.utils.parseUnits("1",'ether')

   beforeEach(async() => {
    const transaction = await aloha.connect(user).mint(ID,{value: AMOUNT})
    await transaction.wait()
   })
   it('Joins the user', async() => {
    const result = await aloha.hasJoined(ID, user.address)
    expect(result).to.be.equal(true)
   })
   it('Increases total supply', async() => {
    const result = await aloha.totalSupply()
    expect(result).to.be.equal(ID)
   })
   it('Updates the contract balance', async() => {
    const result = await ethers.provider.getBalance(aloha.address)
    expect(result).to.be.equal(AMOUNT)
   })
  })

  describe('Withdrawing', () => {
    const ID = 1;
    const AMOUNT = ethers.utils.parseUnits("10", 'ether')
    let balanceBefore

    beforeEach(async() => {
      balanceBefore = await ethers.provider.getBalance(deployer.address)
      
      let transaction = await aloha.connect(user).mint(ID, { value: AMOUNT})
      await transaction.wait()

      transaction = await aloha.connect(deployer).withdraw()
      await transaction.wait()
    })

    it('Updated the owner balance', async () => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })

    it('Updated the contract balance', async () => {
      const result = await ethers.provider.getBalance(aloha.address)
      expect(result).to.equal(0)
    })
  })
})
