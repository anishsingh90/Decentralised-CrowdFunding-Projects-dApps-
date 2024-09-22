//Two Person (i)Manager (ii)Donator(Contributors)
//Manger has show Target:- Why required fund.
//Manager has show particular amount for target.
//Manager has set Deadline:- Funding balance are complete before particular Date.
//Manager has set minContribution:- How much minimum money doneted by donater.
//Donator donate the money in any Smart Contract Sytem.
//When manager has required money then manager should be get permission(>50% Donator) with Donator after withraw the money from smart contract System.
//If amount are not complete on the set deadline then Donator are withdraw money from Smart Contract System.

////SPDX-Licence-Identifier: UNLICENSED

// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract CrowdFunding {
    mapping(address => uint) public contributors; //contributors[msg.sender]=100
    address public manager;
    uint public minimumContribution;
    uint public deadline;
    uint public target;
    uint public raisedAmount;
    uint public noOfContributors;

    struct Request {
        string description;
        address payable recipient;
        uint value;
        bool completed;
        uint noOfVoters;
        mapping(address => bool) voters;
    }
    mapping(uint => Request) public requests;
    uint public numRequests;
    constructor(uint _target, uint _deadline) {
        target = _target;
        deadline = block.timestamp + _deadline; //10sec + 3600sec (60*60)
        minimumContribution = 100 wei;
        manager = msg.sender;
    }

    function sendEth() public payable {
        require(block.timestamp < deadline, "Deadline has passed");
        require(
            msg.value >= minimumContribution,
            "Minimum Contribution is not met"
        );

        if (contributors[msg.sender] == 0) {
            noOfContributors++;
        }
        contributors[msg.sender] += msg.value;
        raisedAmount += msg.value;
    }
    function getContractBalance() public view returns (uint) {
        return address(this).balance;
    }
    function refund() public {
        require(
            block.timestamp > deadline && raisedAmount < target,
            "You are not eligible for refund"
        );
        require(contributors[msg.sender] > 0);
        address payable user = payable(msg.sender);
        user.transfer(contributors[msg.sender]);
        contributors[msg.sender] = 0;
    }
    modifier onlyManger() {
        require(msg.sender == manager, "Only manager can calll this function");
        _;
    }
    function createRequests(
        string memory _description,
        address payable _recipient,
        uint _value
    ) public onlyManger {
        Request storage newRequest = requests[numRequests];
        numRequests++;
        newRequest.description = _description;
        newRequest.recipient = _recipient;
        newRequest.value = _value;
        newRequest.completed = false;
        newRequest.noOfVoters = 0;
    }
    function voteRequest(uint _requestNo) public {
        require(contributors[msg.sender] > 0, "YOu must be contributor");
        Request storage thisRequest = requests[_requestNo];
        require(
            thisRequest.voters[msg.sender] == false,
            "You have already voted"
        );
        thisRequest.voters[msg.sender] = true;
        thisRequest.noOfVoters++;
    }
    function makePayment(uint _requestNo) public onlyManger {
        require(raisedAmount >= target);
        Request storage thisRequest = requests[_requestNo];
        require(
            thisRequest.completed == false,
            "The request has been completed"
        );
        require(
            thisRequest.noOfVoters > noOfContributors / 2,
            "Majority does not support"
        );
        thisRequest.recipient.transfer(thisRequest.value);
        thisRequest.completed = true;
    }
}
