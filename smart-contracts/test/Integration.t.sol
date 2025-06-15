// test/Integration.t.sol
pragma solidity ^0.8.18;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import "../src/VotingSystem.sol";
import "../src/Poll.sol";

contract IntegrationTest is Test {
    VotingSystem voting;
    address admin = address(1);
    address manager = address(2);
    address voter = address(3);

    event AccessCodeGenerated(uint256 indexed pollId, bytes32 indexed code, uint256 maxUses);
    event ResultsRetrieved(address indexed user, uint256 indexed pollId, uint256 tokenId);

    function setUp() public {
        // Deploy contract as admin
        vm.prank(admin);
        voting = new VotingSystem();

        vm.deal(admin, 1 ether);
        vm.deal(manager, 1 ether);
        vm.deal(voter, 1 ether);
    }

    function test_fullFlow() public {
        vm.startPrank(admin);
        bytes32 MANAGER = voting.MANAGER_ROLE();
        voting.changeUserRole(manager, MANAGER);
        vm.stopPrank();

        vm.startPrank(admin);
        bytes32 USER = voting.USER_ROLE();
        voting.changeUserRole(voter, USER);
        vm.stopPrank();

        vm.prank(manager);
        vm.recordLogs();
        string[] memory options = new string[](2);
        options[0] = "a";
        options[1] = "b";
        voting.createPoll("Test Poll", options, 1 days, 1, false);

        Vm.Log[] memory logs = vm.getRecordedLogs();
        bytes32 ACCESS_SIG = keccak256("AccessCodeGenerated(uint256,bytes32,uint256)");
        uint256 pollId;
        bytes32 code;
        for (uint256 i = 0; i < logs.length; i++) {
            if (logs[i].topics[0] == ACCESS_SIG) {
                pollId = uint256(logs[i].topics[1]);
                code = logs[i].topics[2];
                break;
            }
        }
        assertTrue(code != bytes32(0), "no AccessCodeGenerated event");

        console.log("Code to join poll: ");
        console.logBytes32(code);

        vm.prank(voter);
        voting.joinPoll(code);

        vm.prank(voter);
        voting.castVote(pollId, 0);

        vm.prank(manager);
        voting.endPoll(pollId);

        vm.prank(voter);
        vm.recordLogs();
        voting.retrieveResults(pollId);
        Vm.Log[] memory logs2 = vm.getRecordedLogs();

        assertEq(logs2.length, 3);

        uint256 tokenId = uint256(logs2[0].topics[3]);
        assertEq(tokenId, 1);

        assertEq(voting.ownerOf(tokenId), voter);

        string memory uri = voting.tokenURI(tokenId);

        assertTrue(bytes(uri).length > 0);
        assertTrue(_contains(uri, "Results CSV: 1,0"));
    }

    /// @dev simple substring check
    function _contains(string memory where, string memory what) internal pure returns (bool) {
        bytes memory w = bytes(where);
        bytes memory s = bytes(what);
        if (s.length > w.length) return false;
        for (uint256 i = 0; i <= w.length - s.length; i++) {
            bool matched = true;
            for (uint256 j = 0; j < s.length; j++) {
                if (w[i + j] != s[j]) {
                    matched = false;
                    break;
                }
            }
            if (matched) return true;
        }
        return false;
    }
}
