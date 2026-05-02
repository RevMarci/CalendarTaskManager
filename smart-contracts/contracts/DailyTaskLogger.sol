// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DailyTaskLogger {
    address public owner;
    mapping(string => string) private dailyHashes;

    event HashSaved(string indexed userAndDate, string taskHash, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner (backend) can save hashes!");
        _;
    }

    function saveDailyHash(string memory _userAndDate, string memory _taskHash) public onlyOwner {
        require(bytes(dailyHashes[_userAndDate]).length == 0, "This date already has a hash!");
        dailyHashes[_userAndDate] = _taskHash;
        emit HashSaved(_userAndDate, _taskHash, block.timestamp);
    }

    function getDailyHash(string memory _userAndDate) public view returns (string memory) {
        return dailyHashes[_userAndDate];
    }
}
