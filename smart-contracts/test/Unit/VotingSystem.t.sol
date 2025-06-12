// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Test.sol";
import "../../src/VotingSystem.sol";

contract VotingSystemTest is Test {
    VotingSystem voting;
    address admin = address(0xA1);
    address manager = address(0xB2);

    function setUp() public {
        // Deploy the contract as `admin`
        vm.startPrank(admin);
        voting = new VotingSystem();
        vm.stopPrank();
    }

    function testGrantManagerAndCreatePoll() public {
        // 1) Admin grants MANAGER_ROLE to `manager`
        vm.startPrank(admin);
        bytes32 MANAGER = voting.MANAGER_ROLE();
        voting.changeUserRole(manager, MANAGER);
        vm.stopPrank();

        string[] memory options = new string[](3);

        assertTrue(voting.isManager(manager), "Manager role not granted");

        vm.startPrank(manager);
        options[0] = "Option #1";
        options[1] = "Option #2";

        voting.createPoll("My First Poll", options, 1 days, 3, false);
        vm.stopPrank();

        uint256 total = voting.totalPolls();
        assertEq(total, 1, "Poll count should be 1");

        address pollAddr = voting.getPollAddress(1);
        assertTrue(pollAddr != address(0), "Poll address should be set");
    }
}
