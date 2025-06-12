// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Test} from "forge-std/Test.sol";
import {Poll} from "../../src/Poll.sol";

contract PollTest is Test {
    Poll private poll;

    address manager = address(0x1);
    address participant1 = address(0x2);
    address participant2 = address(0x3);
    string[] private options;

    function setUp() public {
        options.push("Option A");
        options.push("Option B");
        options.push("Option C");

        vm.prank(manager);
        poll = new Poll("Test Poll", options, 1 hours);
    }

    function testInitialState() public {
        assertEq(poll.participantCount(), 0);
        string[] memory returnedOptions = poll.getOptions();
        assertEq(returnedOptions.length, options.length);
    }

    function testAddParticipant() public {
        vm.prank(manager);
        poll.addParticipant(participant1);

        assertEq(poll.participantCount(), 1);
        assertTrue(poll.s_isRegistered(participant1));
    }

    function testCannotAddParticipantIfNotManager() public {
        vm.expectRevert(Poll.Poll__NotAManager.selector);
        poll.addParticipant(participant1);
    }

    function testStartPoll() public {
        vm.prank(manager);
        poll.start();

        vm.expectRevert(Poll.Poll__NotExpectedState.selector);
        vm.prank(manager);
        poll.start();
    }

    function testCastVoteFlow() public {
        vm.prank(manager);
        poll.addParticipant(participant1);

        vm.prank(manager);
        poll.start();

        vm.prank(participant1);
        poll.castVote(participant1, 0); // Vote for Option A

        assertTrue(poll.s_hasVoted(participant1));
        assertEq(poll.s_votes(0), 1);
    }

    function testCannotVoteTwice() public {
        vm.prank(manager);
        poll.addParticipant(participant1);

        vm.prank(manager);
        poll.start();

        vm.prank(participant1);
        poll.castVote(participant1, 1);

        vm.prank(participant1);
        vm.expectRevert("Poll: already voted");
        poll.castVote(participant1, 1);
    }

    function testCannotVoteWithoutRegistration() public {
        vm.prank(manager);
        poll.start();

        vm.prank(participant2);
        vm.expectRevert("Poll: not registered");
        poll.castVote(participant2, 0);
    }

    function testEndPoll() public {
        vm.prank(manager);
        poll.addParticipant(participant1);

        vm.prank(manager);
        poll.start();

        vm.prank(manager);
        poll.end();

        vm.prank(participant1);
        vm.expectRevert(Poll.Poll__NotExpectedState.selector);
        poll.castVote(participant1, 1);
    }

    function testGetResultsAfterEnd() public {
        vm.prank(manager);
        poll.addParticipant(participant1);

        vm.prank(manager);
        poll.start();

        vm.prank(participant1);
        poll.castVote(manager, 2);

        vm.prank(manager);
        poll.end();

        uint256[] memory results = poll.getResults();
        assertEq(results.length, options.length);
        assertEq(results[2], 1);
    }
}
