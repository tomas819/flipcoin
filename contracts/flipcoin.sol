// SPDX-License-Identifier: tomas
pragma solidity 0.5.12;

import "./ownable.sol";
import "./provableAPI_0.5.sol";

contract Flipcoin is Ownable, usingProvable {

  // keep the latest number from oracle
  uint256 public latestNumber;

  // structure for every player with all information about
  //  current game and balances
  struct CoinPlay {
    uint playWin;
    uint playLoss;
    uint playBalance;
    uint playLastBet;
    uint playLastCoinSide;
    bool playLastResult;
    bool playWaiting;
    bool playExists;
  }

  // list of players
  mapping(address => CoinPlay) private coinPlayers;
  // list of players waiting for oracle
  mapping(bytes32 => address) private waitingToProcessQuery;

  // event for each player the result of the current game
  event eventPlayResult(address playAddress, bool playResult);
  // event for a notification after a withdrawal
  event eventWithdrawResult(uint withdrawResult);

  // event for the callback, sends a message if the verification fails
  event testCallback(string test);
  // event for a provable query
  event logNewProvableQuery(string description);
  // event for a random number from oracle
  event generatedRandomNumber(uint256 randomNumber);

  // set proof type
  constructor() public {
    provable_setProof(proofType_Ledger);
  }


  // callback function for oracle
  //  process waiting players
  //  compare the entered coin side with a random number (random coin side)
  //  win - increase balance and number of wins
  //  lose - update number of losses
  //  save the result and emit the result in an event
  //  set the player to not-waiting state and delete the player form the waiting list
  function __callback(bytes32 _queryId, string memory _result, bytes memory _proof) public {
    require(msg.sender == provable_cbAddress());
    if (provable_randomDS_proofVerify__returnCode(_queryId, _result, _proof) != 0) {
      emit testCallback("proof verification has failed");
    }
    else {
      address player = waitingToProcessQuery[_queryId];
      uint256 randomNumber = uint256(keccak256(abi.encodePacked(_result))) % 2;
      latestNumber = randomNumber;
      if (latestNumber == 1) {
        coinPlayers[player].playBalance += (coinPlayers[player].playLastBet * 2);
        coinPlayers[player].playWin += 1;
        coinPlayers[player].playLastResult = true;
        emit eventPlayResult(player, true);
      }
      else {
        coinPlayers[player].playLoss += 1;
        coinPlayers[player].playLastResult = false;
        emit eventPlayResult(player, false);
      }
      coinPlayers[player].playWaiting = false;
      delete waitingToProcessQuery[_queryId];
    }
  }


  // game with random numbers from oracle
  //  process players who are not waiting (who just stared a game)
  //  put the palyer to the waiting list
  //  save information about current game (bet, coin side)
  //  send provable random query and get the query id back
  //  assign players to query ids
  function flipcoinPlayOracle(uint coinSide) public payable {
    require(msg.value > 0, "this function has a cost");
    require(coinPlayers[msg.sender].playWaiting == false, "player is still waiting for the result");

    uint256 QUERY_EXECUTION_DELAY = 0;
    uint256 NUM_RANDOM_BYTES_REQUESTED = 1;
    uint256 GAS_FOR_CALLBACK = 300000;

    address player = msg.sender;

    coinPlayers[player].playExists = true;
    coinPlayers[player].playWaiting = true;
    coinPlayers[player].playLastBet = msg.value;
    coinPlayers[player].playLastCoinSide = coinSide;

    bytes32 queryId = provable_newRandomDSQuery(QUERY_EXECUTION_DELAY, NUM_RANDOM_BYTES_REQUESTED, GAS_FOR_CALLBACK);
    emit logNewProvableQuery("Provable query was sent, standing by for the answer...");
    waitingToProcessQuery[queryId] = player;
  }


  // game with pseudo random number
  //  save information about current game (bet, coin side)
  //  compare the entered coin side with a random number
  //  win - increase balance and number of wins
  //  lose - update number of losses
  //  save the result and emit the result in an event
  function flipcoinPlay(uint coinSide) public payable {
    require(msg.value > 0, "this function has a cost");
    address player = msg.sender;

    coinPlayers[player].playLastBet = msg.value;
    coinPlayers[player].playLastCoinSide = coinSide;

    coinPlayers[player].playExists = true;
    if (coinSide == (now % 2)) {
      coinPlayers[player].playBalance += (msg.value * 2);
      coinPlayers[player].playWin += 1;
      coinPlayers[player].playLastResult = true;
      emit eventPlayResult(player, true);
    }
    else {
      coinPlayers[player].playLoss += 1;
      coinPlayers[player].playLastResult = false;
      emit eventPlayResult(player, false);
    }
  }


  // get all information about a player
  function getCoinPlayer() public view returns(uint playWin, uint playLoss, uint playBalance, uint playLastBet, uint playLastCoinSide, bool playLastResult, bool playWaiting, bool playExists) {
    address player = msg.sender;
    if (coinPlayers[player].playExists == true) {
      return (coinPlayers[player].playWin, coinPlayers[player].playLoss, coinPlayers[player].playBalance, coinPlayers[player].playLastBet, coinPlayers[player].playLastCoinSide, coinPlayers[player].playLastResult, coinPlayers[player].playWaiting, coinPlayers[player].playExists);
    }
  }

  // get players account balance
  function getCoinPlayerBalance() public view returns(uint) {
    address player = msg.sender;
    return coinPlayers[player].playBalance;
  }

  // withdraw all winnings
  //  max withdrawal is the max balance of the contract
  //  --> other solution can be implemented:
  //      first fund the contract and then play
  // checks - effects - interactions
  function withdrawWinBalance() public {
    address player = msg.sender;
    uint toTransferMAX = address(this).balance;
    uint toTransfer = coinPlayers[player].playBalance;

    delete coinPlayers[player];

    if (toTransfer <= toTransferMAX) {
      msg.sender.transfer(toTransfer);
      emit eventWithdrawResult(toTransfer);
    }
    else {
      msg.sender.transfer(toTransferMAX);
      emit eventWithdrawResult(toTransferMAX);
    }
  }


  // destroy contract
  function destroyContract() public onlyOwner {
    selfdestruct(address(uint160(owner)));
  }

}
