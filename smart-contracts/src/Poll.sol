// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title Poll
 * @author Patryk Zan
 * @notice A simple on‑chain poll contract that supports role‑restricted setup,
 *         participant registration, voting, and result retrieval.
 */
contract Poll {
    // Types
    enum State {
        CREATED,
        ACTIVE,
        ENDED
    }

    // Errors
    error Poll__NotExpectedState();
    error Poll__NotAManager();
    error Poll__OptionCountMustBeGreaterThanTwo();
    error Poll__MustLastLongerThanZero();

    // State Variables
    string private s_title;
    State private s_state;

    string[] private s_options;
    mapping(uint256 => uint256) public s_votes;

    address[] private s_participantList;
    mapping(address => bool) public s_isRegistered;
    mapping(address => bool) public s_hasVoted;

    uint256 private s_startTime;
    uint256 private s_endTime;
    uint256 private s_duration;

    address private immutable i_manager;

    // Events
    event PollStarted(uint256 indexed startTime, uint256 indexed endTime);
    event PollEnded(uint256 indexed endTime);
    event ParticipantAdded(address indexed participant);
    event VoteCast(address indexed voter, uint256 indexed option);

    // Modifiers
    modifier onlyManager() {
        if (msg.sender != i_manager) {
            revert Poll__NotAManager();
        }
        _;
    }

    modifier inState(State expected) {
        if (s_state != expected) {
            revert Poll__NotExpectedState();
        }
        _;
    }

    // Constructor
    /**
     * @param _title    The poll title
     * @param _options  The array of option labels
     * @param _duration Duration in seconds for which the poll runs once started
     */
    constructor(string memory _title, string[] memory _options, uint256 _duration) {
        if (_options.length <= 2) {
            revert Poll__OptionCountMustBeGreaterThanTwo();
        }

        if (_duration == 0) {
            revert Poll__MustLastLongerThanZero();
        }

        s_title = _title;
        s_options = _options;
        i_manager = msg.sender;
        s_state = State.CREATED;
        s_duration = _duration;
        s_endTime = 0;
        s_startTime = 0;
    }

    // Management
    /**
     * @notice Activate the poll. Sets startTime and endTime, moves state to Active.
     */
    function start() external onlyManager inState(State.CREATED) {
        s_startTime = block.timestamp;
        s_endTime = block.timestamp + s_duration;

        s_state = State.ACTIVE;
        emit PollStarted(s_startTime, s_endTime);
    }

    /**
     * @notice Add a participant (whitelist) before poll starts.
     * @param _participant Address to register
     */
    function addParticipant(address _participant) external onlyManager inState(State.CREATED) {
        require(!s_isRegistered[_participant], "Poll: already registered");
        s_isRegistered[_participant] = true;
        s_participantList.push(_participant);
        emit ParticipantAdded(_participant);
    }

    // Voting
    /**
     * @notice Cast your vote once poll is Active.
     * @param _option Index of the chosen option
     */
    function castVote(address _voter, uint256 _option) external inState(State.ACTIVE) {
        require(block.timestamp <= s_endTime, "Poll: voting period over");
        require(s_isRegistered[msg.sender], "Poll: not registered");
        require(!s_hasVoted[msg.sender], "Poll: already voted");
        require(_option < s_options.length, "Poll: invalid option");

        s_hasVoted[_voter] = true;
        s_votes[_option] += 1;
        emit VoteCast(_voter, _option);
    }

    /**
     * @notice End the poll. Can be called by manager or automatically by timestamp.
     */
    function end() external inState(State.ACTIVE) {
        s_state = State.ENDED;
        emit PollEnded(block.timestamp);
    }

    // Views
    /**
     * @notice Returns the vote counts for each option once poll has Ended.
     */
    function getResults() external view inState(State.ENDED) returns (uint256[] memory) {
        uint256 len = s_options.length;
        uint256[] memory results = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            results[i] = s_votes[i];
        }
        return results;
    }

    /**
     * @notice Retrieve number of registered participants.
     */
    function participantCount() external view returns (uint256) {
        return s_participantList.length;
    }

    /**
     * @notice Retrieve the list of option labels.
     */
    function getOptions() external view returns (string[] memory) {
        return s_options;
    }

    /**
     * @notice Retrieve the timestamp when voting ends
     */
    function getEndTime() external view returns (uint256) {
        return s_endTime;
    }

    /**
     * @notice Retrieve the participants
     */
    function getRegisteredParticipants() external view returns (address[] memory) {
        return s_participantList;
    }
}
