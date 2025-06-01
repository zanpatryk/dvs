//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {VotingSystem} from "../src/VotingSystem.sol";
import {Poll} from "../src/Poll.sol";

contract Deploy is Script {
    function run() external returns (VotingSystem) {
        address[] memory initial_admins;
        initial_admins[0] = msg.sender;

        vm.startBroadcast();
        VotingSystem vs = new VotingSystem(initial_admins);
        vm.stopBroadcast();

        return vs;
    }
}
