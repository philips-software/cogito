pragma solidity ^0.4.18;

contract SimpleStorage {
    uint private value = 0;

    function increase(uint increment) public {
        value = value + increment;
        emit ValueChanged(this, value, msg.sender);
    }

    function read() public view returns (uint) {
        return value;
    }

    event ValueChanged(SimpleStorage simpleStorage, uint value, address sender);
}
