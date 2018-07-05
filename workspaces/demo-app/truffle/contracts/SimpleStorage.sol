pragma solidity ^0.4.18;

contract SimpleStorage {
    uint private value = 0;

    function increase(uint increment) public {
        value = value + increment;
    }

    function read() public view returns (uint) {
        return value;
    }
}
