// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {AccessControlEnumerable} from "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Poll} from "./Poll.sol";

/**
 * @title VotingSystem
 * @notice Manages creation of polls, role-based access, and user participation via access codes.
 */
contract VotingSystem is ERC721, ERC721URIStorage, AccessControlEnumerable {
    // Roles
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant USER_ROLE = keccak256("USER_ROLE");

    // State Variables
    uint256 private s_pollCount;
    mapping(uint256 => address) private s_polls;
    mapping(bytes32 => uint256) private s_accessCodes;
    mapping(address => uint256[]) private s_pollsByManager;
    mapping(address => uint256) private s_tokenIds;
    uint256 private s_tokenCounter;

    // Each code maps to a pollId; and we track how many uses remain
    mapping(bytes32 => uint256) private s_accessCodeUses;

    // Track which users have claimed results for each poll
    mapping(uint256 => mapping(address => bool)) private s_resultsClaimed;

    // Events
    event PollCreated(uint256 indexed pollId, address pollAddress, string title);
    event JoinedPoll(address indexed user, uint256 indexed pollId);
    event ResultsRetrieved(address indexed user, uint256 indexed pollId, uint256 tokenId);
    event AccessCodeGenerated(uint256 indexed pollId, bytes32 indexed code, uint256 maxUses);

    modifier notAdmin(bytes32 role) {
        require(!hasRole(ADMIN_ROLE, msg.sender), "notAdmin: caller must not be admin");
        _;
    }

    constructor() ERC721("ParticipationNFT", "PNFT") {
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
        _setRoleAdmin(MANAGER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(USER_ROLE, ADMIN_ROLE);

        // Grant roles to deployer and initial admins
        _grantRole(ADMIN_ROLE, msg.sender);

        s_tokenCounter = 0;
    }

    /**
     * @notice Create a new poll and generate access codes.
     * @param _title     Poll title
     * @param _options   Array of option labels
     * @param _duration  Voting duration in seconds
     * @param _maxUses   Maximum nuber of uses per code
     */
    function createPoll(
        string memory _title,
        string[] memory _options,
        uint256 _duration,
        uint256 _maxUses,
        bool includeManager
    ) external onlyRole(MANAGER_ROLE) {
        require(_maxUses > 0, "VotingSystem: maxUses must be > 0");

        // Deploy new Poll with this contract as its manager
        Poll poll = new Poll(_title, _options, _duration);
        uint256 pollId = ++s_pollCount + block.timestamp;
        s_polls[pollId] = address(poll);
        emit PollCreated(pollId, address(poll), _title);

        // Generate one access code (still “unique” via keccak256)
        bytes32 code = keccak256(abi.encodePacked(pollId, msg.sender, block.timestamp));

        // Map code → pollId, and set how many uses it has
        s_accessCodes[code] = pollId;
        s_accessCodeUses[code] = _maxUses;

        s_pollsByManager[msg.sender].push(pollId);

        Poll(address(poll)).start();

        if (includeManager) {
            Poll(address(poll)).addParticipant(msg.sender);
        }

        emit AccessCodeGenerated(pollId, code, _maxUses);
    }

    /**
     * @notice Join a poll by providing a valid access code.
     * @param _code The unique code provided by a manager
     */
    function joinPoll(bytes32 _code) external notAdmin(ADMIN_ROLE) {
        uint256 pollId = s_accessCodes[_code];
        require(pollId != 0, "VotingSystem: invalid code");

        uint256 usesLeft = s_accessCodeUses[_code];
        require(usesLeft > 0, "VotingSystem: code exhausted");

        address pollAddress = s_polls[pollId];
        Poll(pollAddress).addParticipant(msg.sender);

        // Decrement remaining uses; if zero afterward, delete
        unchecked {
            s_accessCodeUses[_code] = usesLeft - 1;
        }
        if (s_accessCodeUses[_code] == 0) {
            delete s_accessCodes[_code];
            delete s_accessCodeUses[_code];
        }

        emit JoinedPoll(msg.sender, pollId);
    }

    /**
     * @notice Cast a vote in a given poll.
     * @param _pollId The target poll ID
     * @param _option Option index to vote for
     */
    function castVote(uint256 _pollId, uint256 _option) external notAdmin(ADMIN_ROLE) {
        address pollAddress = s_polls[_pollId];
        require(pollAddress != address(0), "VotingSystem: invalid pollId");

        Poll(pollAddress).castVote(msg.sender, _option);
    }

    /// @notice Close a poll early (MANAGER_ROLE) or automatically once its deadline passes (anyone)
    function endPoll(uint256 _pollId) external onlyRole(MANAGER_ROLE) {
        address pollAddress = s_polls[_pollId];
        require(pollAddress != address(0), "VotingSystem: invalid pollId");

        // This will revert unless poll is in ACTIVE state
        Poll(pollAddress).end();
    }

    /**
     * @notice Change a user's role within the system.
     * @param _account Address whose role is to change
     * @param _role    Bytes32 role identifier
     */
    function changeUserRole(address _account, bytes32 _role) external onlyRole(ADMIN_ROLE) {
        // Revoke any existing role
        if (hasRole(ADMIN_ROLE, _account)) {
            revokeRole(ADMIN_ROLE, _account);
        }
        if (hasRole(MANAGER_ROLE, _account)) {
            revokeRole(MANAGER_ROLE, _account);
        }
        if (hasRole(USER_ROLE, _account)) {
            revokeRole(USER_ROLE, _account);
        }

        // Grant exactly the new role
        grantRole(_role, _account);
    }

    /// @notice After a poll is ended, mint a results-NFT to the caller
    /// @param pollId  The ID of the poll whose results to retrieve
    function retrieveResults(uint256 pollId) external notAdmin(ADMIN_ROLE) {
        require(s_polls[pollId] != address(0), "Invalid pollId");
        require(!s_resultsClaimed[pollId][msg.sender], "Already claimed");

        Poll poll = Poll(s_polls[pollId]);
        uint256[] memory votes = poll.getResults();

        string memory csv;
        for (uint256 i = 0; i < votes.length; i++) {
            csv = string(abi.encodePacked(csv, uint2str(votes[i])));
            if (i < votes.length - 1) {
                csv = string(abi.encodePacked(csv, ","));
            }
        }

        string memory uri = string(
            abi.encodePacked(
                "data:application/json;utf8,{",
                "\"name\":\"Poll ",
                uint2str(pollId),
                " Results\",",
                "\"description\":\"Results CSV: ",
                csv,
                "\"",
                "}"
            )
        );

        uint256 tokenId = ++s_tokenCounter;
        _safeMint(msg.sender, tokenId);

        _setTokenURI(tokenId, uri);

        s_resultsClaimed[pollId][msg.sender] = true;

        s_tokenIds[msg.sender] = tokenId;

        emit ResultsRetrieved(msg.sender, pollId, tokenId);
    }

    /// @dev Convert uint256 → string (used for on-chain metadata)
    function uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 len;
        uint256 temp = _i;
        while (temp != 0) {
            len++;
            temp /= 10;
        }
        bytes memory buf = new bytes(len);
        while (_i != 0) {
            len -= 1;
            buf[len] = bytes1(uint8(48 + (_i % 10)));
            _i /= 10;
        }
        return string(buf);
    }

    //=======================================================================
    // Getters
    //=======================================================================

    function getPollAddress(uint256 _pollId) external view returns (address) {
        return s_polls[_pollId];
    }

    function getAccessCodePollId(bytes32 _code) external view returns (uint256) {
        return s_accessCodes[_code];
    }

    function totalPolls() external view returns (uint256) {
        return s_pollCount;
    }

    function isUser(address account) external view returns (bool) {
        return hasRole(USER_ROLE, account);
    }

    function isManager(address account) external view returns (bool) {
        return hasRole(MANAGER_ROLE, account);
    }

    function isAdmin(address account) external view returns (bool) {
        return hasRole(ADMIN_ROLE, account);
    }

    function getPollsByManager(address manager) external view returns (uint256[] memory) {
        return s_pollsByManager[manager];
    }

    function hasUserVoted(uint256 _pollId, address _user) external view returns (bool) {
        address pollAddress = s_polls[_pollId];
        require(pollAddress != address(0), "VotingSystem: invalid pollId");

        return Poll(pollAddress).hasVoted(_user);
    }

    function hasUserClaimedResults(uint256 _pollId, address _user) external view returns (bool) {
        return s_resultsClaimed[_pollId][_user];
    }

    function getResultsTokenId() external view returns (uint256) {
        return s_tokenIds[msg.sender];
    }

    //=======================================================================
    // Setters
    //=======================================================================

    function grantUserRole(address account) external {
        _grantRole(USER_ROLE, account);
    }

    // Explicitly override tokenURI to resolve inheritance ambiguity
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    // Explicitly override supportsInterface to resolve inheritance ambiguity
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControlEnumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
