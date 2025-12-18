// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EthVault {
    struct Deposit {
        uint256 amount;
        uint256 unlockTime;
        bool active;
    }

    mapping(address => Deposit) public deposits;

    uint256 public constant MIN_DEPOSIT = 0.000001 ether;
    uint256 public constant MIN_LOCK = 60;
    uint256 public constant MAX_LOCK = 5 minutes;

    event Deposited(address indexed user, uint256 amount, uint256 unlockTime);
    event Withdrawn(address indexed user, uint256 amount);

    function lockTime(uint256 lockSeconds) external payable {
        require(msg.value >= MIN_DEPOSIT, "Deposit too small");
        require(lockSeconds >= MIN_LOCK && lockSeconds <= MAX_LOCK, "Invalid lock time");

        Deposit storage d = deposits[msg.sender];
        require(!d.active, "Active deposit exists");

        d.amount = msg.value;
        d.unlockTime = block.timestamp + lockSeconds;
        d.active = true;

        emit Deposited(msg.sender, msg.value, d.unlockTime);
    }

    function withdraw() external {
        Deposit storage d = deposits[msg.sender];

        require(d.active, "No active deposit");
        require(block.timestamp >= d.unlockTime, "Still locked");

        uint256 amount = d.amount;

        // clear state AFTER storing amount
        d.amount = 0;
        d.active = false;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "ETH transfer failed");

        emit Withdrawn(msg.sender, amount);
    }

    receive() external payable {
        revert("Use lockTime()");
    }
}
