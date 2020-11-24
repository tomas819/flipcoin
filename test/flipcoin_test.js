const Flipcoin = artifacts.require("Flipcoin");
const truffleAssert = require("truffle-assertions");

contract("Flipcoin", async function(accounts) {

  let instance;

  // runs once before all tests
  beforeEach(async function() {
    instance = await Flipcoin.new();
  });




});
