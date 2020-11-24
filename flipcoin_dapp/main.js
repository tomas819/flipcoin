var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var playerBalance;


$(document).ready(async function() {
  window.ethereum.enable().then(function(accounts) {
    contractAddress = "0x2d04b668e9C131b296A2EF38352C639f702CDC7A";
    contractInstance = new web3.eth.Contract(abi, contractAddress, {from: accounts[0]});
    console.log(contractInstance);
  }).then(async function() {
    acc = await window.ethereum.request({method: "eth_requestAccounts",});

    updateBalancesAndScore();
  });

  $("#coin_flip").click(flipcoinPlay1);
  $("#coin_flip2").click(flipcoinPlay2);
  $("#coin_withdraw").click(flipcoinWithdraw);

  $("#alert_message").hide();
});

// update contract and players accounts, update the current play
function updateBalancesAndScore() {
  updatePlayerBalance();
  updateContractBalance();
  updateCoinFlipPlayer();
}

// update players address and balance
function updatePlayerBalance() {
  web3.eth.getBalance(contractInstance.options.from).then(function(account_balance) {
    $("#account_address").text(contractInstance.options.from);
    $("#account_balance").text(web3.utils.fromWei(account_balance) + " ETH");
    playerBalance = parseFloat(account_balance);
  });
}

// update contract balance
function updateContractBalance() {
  web3.eth.getBalance(contractInstance._address).then(function(contract_balance) {
    $("#contract_balance").text(web3.utils.fromWei(contract_balance) + " ETH");
  });
}

// real-time update score after each play;
//  winnings, number of wins and losses
function updateCoinFlipPlayer() {
  contractInstance.methods.getCoinPlayer().call().then(function(coin_player) {
    if (coin_player.playExists) {
      $("#coin_balance").text(web3.utils.fromWei(coin_player.playBalance) + " ETH");
      $("#coin_wins").text(coin_player.playWin);
      $("#coin_losses").text(coin_player.playLoss);
    }
    else {
      $("#coin_balance").text("0 ETH");
      $("#coin_wins").text("0");
      $("#coin_losses").text("0");
    }
    updateLastPlay(coin_player);
  });
}

// after refresh update of last play;
//  still waiting for the result?, last bet, coin side and last result
function updateLastPlay(coin_player) {
  if (coin_player.playWaiting == true) {
    setAlertMessage("s", "you already played, still waiting for the result...");
  }
  if (coin_player.playLastBet > 0) {
    $("#coin_last_bet").text(web3.utils.fromWei(coin_player.playLastBet) + " ETH");
    let coin_last_side = "tail";
    if (coin_player.playLastCoinSide == 1) {
      coin_last_side = "head";
    }
    $("#coin_last_side").text(coin_last_side);
    if (coin_player.playWaiting == false) {
      let coin_last_result = "you lost!"
      if (coin_player.playLastResult == true) {
        coin_last_result = "you won!"
      }
      $("#coin_last_result").text(coin_last_result);
    }
    else {
      $("#coin_last_result").text("waiting...");
    }
  }
}

// alert message appears on the top;
//  set message color and text
function setAlertMessage(alert_type, alert_message) {
  let alert_class;
  switch (alert_type) {
    case "e":
      alert_class = "alert alert-danger";
      break;
    case "i":
      alert_class = "alert alert-warning";
      break;
    case "s":
      alert_class = "alert alert-primary";
      break;
  }
  $("#alert_message").removeClass();
  $("#alert_message").addClass(alert_class);
  $("#alert_message").show();
  $("#alert_message_text").text(alert_message);
}

// check if bet is a positive number and less than players account balance
function checkBet(coin_bet) {
  if (isNaN(coin_bet)) {
    setAlertMessage("e", "Your bet is not a number!");
  }
  else {
    if (coin_bet <= 0) {
      setAlertMessage("e", "Your bet must be > 0 ETH!");
    }
    else {
      if (parseFloat(web3.utils.toWei(coin_bet)) > parseFloat(playerBalance)) {
        setAlertMessage("e", "Your bet is higher than you account balance!");
      }
      else {
        return true;
      }
    }
  }
}


// play with pseudo random numbers
//  check correct bet and coin side
//  call the contract method - pseudo random
//  wait for events and update game information and player balances
function flipcoinPlay1() {
  var coin_bet = $("#coin_bet").val();
  // coin side: head = 1; tail = 0
  var coin_side = 0;
  if ($("#coin_head").prop("checked")) {
    coin_side = 1
  }

  if (checkBet(coin_bet)) {
    var config = {
      value: web3.utils.toWei(coin_bet, "ether")
    }
    contractInstance.methods.flipcoinPlay(coin_side).send(config)
    .on("transactionHash", function(hash) {
      setAlertMessage("s", "transaction sent, waiting for the result...");
    })
    .on("confirmation", function(confirmationNr) {
      if (confirmationNr < 1) {
        setAlertMessage("s", "transaction confirmed [" + confirmationNr + "], waiting for the result...");
      }
    })
    .on("receipt", function(receipt) {
      if ((receipt.events.eventPlayResult.returnValues.playResult == true) && (receipt.events.eventPlayResult.returnValues.playAddress == contractInstance.options.from)) {
        setAlertMessage("i", "YOU WIN!");
      }
      else if ((receipt.events.eventPlayResult.returnValues.playResult == false) && (receipt.events.eventPlayResult.returnValues.playAddress == contractInstance.options.from)) {
        setAlertMessage("i", "YOU LOSE!");
      }
      updateBalancesAndScore();
    });
  }
}


// play with random numbers from oracle
//  check correct bet and coin side
//  call the contract method - oracle
//  wait for events and update game information and player balances
function flipcoinPlay2() {
  var coin_bet = $("#coin_bet").val();
  // coin side: head = 1; tail = 0
  var coin_side = 0;
  if ($("#coin_head").prop("checked")) {
    coin_side = 1
  }
  if (checkBet(coin_bet)) {
    var config = {
      value: web3.utils.toWei(coin_bet, "ether")
    }
    contractInstance.methods.flipcoinPlayOracle(coin_side).send(config)
    .on("error", function(error) {
       console.log("error");
       console.log(error);
    })
    .on("transactionHash", function(hash) {
      setAlertMessage("s", "transaction sent, waiting for confirmation...");
    })
    .on("confirmation", function(confirmationNr) {
      if (confirmationNr < 1) {
        setAlertMessage("s", "transaction confirmed [" + confirmationNr + "], waiting for the result...");
      }
    })
    .on("receipt", function(receipt) {
      setAlertMessage("s", "now waiting for the result...");
    });

    contractInstance.events.testCallback({fromBlock: 'latest'}, function(error, event) {
      setAlertMessage("e", event.returnValues.test);
    });
    contractInstance.events.eventPlayResult({fromBlock: 'latest'}, function(error, event) {
      if ((receipt.events.eventPlayResult.returnValues.playResult == true) && (receipt.events.eventPlayResult.returnValues.playAddress == contractInstance.options.from)) {
        setAlertMessage("i", "YOU WIN!");
      }
      else if ((receipt.events.eventPlayResult.returnValues.playResult == false) && (receipt.events.eventPlayResult.returnValues.playAddress == contractInstance.options.from)) {
        setAlertMessage("i", "YOU LOSE!");
      }
      updateBalancesAndScore();
    });
  }
}


// withdraw all winnings
//  max withdrawal is the max balance of the contract
//  --> other solution can be implemented:
//      first fund the contract and then play
function flipcoinWithdraw() {
  contractInstance.methods.getCoinPlayerBalance().call().then(function (coin_balance) {
    if (coin_balance > 0) {
      contractInstance.methods.withdrawWinBalance().send()
      .on("transactionHash", function(hash) {
        setAlertMessage("s", "withdrawal transaction sent...");
      })
      .on("confirmation", function(confirmationNr) {
        if (confirmationNr == 0) {
          setAlertMessage("s", "withdrawal transaction confirmed...");
        }
      })
      .on("receipt", function(receipt) {
        withdraw_result = receipt.events.eventWithdrawResult.returnValues.withdrawResult;
        if (coin_balance > withdraw_result) {
          setAlertMessage("s", "Your withdrawal is " + web3.utils.fromWei(withdraw_result) + " ETH (max. contract balance)");
        }
        else {
          setAlertMessage("s", "Your withdrawal is " + web3.utils.fromWei(withdraw_result) + " ETH");
        }
        updateBalancesAndScore();
      })
    }
    else {
      setAlertMessage("e", "Cannot withdraw, your current winnings are 0 ETH!");
    }
  });
}


// destroy contract
function flipcoinDestroy() {
  contractInstance.methods.destroyContract().call().then(function () {
    console.log("contract destroyed");
  });
}
