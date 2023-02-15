// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import './DocItem.sol';

contract Document is ReentrancyGuard {
  using Counters for Counters.Counter;
  address payable public owner;
  DocItem private immutable docItemContract;
  uint256 public applicationFormCounter = 0;
  uint256 public idCardCounter = 0;

  enum Role {
    Admin,
    User
  }

  enum Status {
    Approved,
    Pending,
    Rejected
  }

  enum Typeofdoc {
    ID,
    PASSPORT,
    CAR
  }

  struct ApplicationForm {
    string name;
    Status status;
    uint256 id;
    string ipfsLink;
    uint256 egn;
    address user;
  }

  struct IDCardData {
    uint256 id;
    string phoneNumber;
    string nationality;
    string dateOfBirth;
    uint256 identityCardNumber;
    string permanentAddress;
    string eyeColor;
    string height;
    string dateOfIssue;
  }

  constructor(address _docItemAddress) {
    docItemContract = DocItem(_docItemAddress);
    roles[msg.sender] = Role.Admin;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only the owner can perform this action');
    _;
  }

  mapping(uint256 => ApplicationForm) public applicationForms;
  mapping(uint256 => Status) public applicationStatus;
  mapping(uint256 => bool) public nfts;
  mapping(address => Role) public roles;
  mapping(address => bool) public theroles;
  mapping(uint256 => bool) public inUseEgn;
  mapping(uint256 => IDCardData) public idCards;
  mapping(uint256 => bool) public inUseIdentityCardNumber;
  uint256 public cardCount = 0;
  // mapping(uint256 => bool) public applicationFormsExist;
  // mapping(uint256 => address) public formCreators;
  // mapping(address => bool) public filledForms;

  uint256[] public applicationFormsIds;
  uint256[] public idCardsIds;

  event CreatedApplicationForm(uint256 idApplicationId, ApplicationForm applicationForm);

  event Approved(uint256 _applicationId);
  event Rejected(uint256 _applicationId);
  event Pending(uint256 _applicationId);

  function createApplicationForm(
    string memory name,
    string memory ipfsLink,
    uint256 egn,
    address user
  ) public {
    require(!inUseEgn[egn], 'EGN is already in use');

    uint256 newFormId = applicationFormCounter;
    applicationFormCounter++;

    ApplicationForm memory newApplicationForm = ApplicationForm({
      name: name,
      status: Status.Pending,
      id: newFormId,
      ipfsLink: ipfsLink,
      egn: egn,
      user: user
    });

    applicationForms[newFormId] = newApplicationForm;
    inUseEgn[egn] = true;
    applicationFormsIds.push(newFormId);

    emit CreatedApplicationForm(newFormId, newApplicationForm);
  }

  function getApplicationFormsIdsLenght() external view returns (uint256) {
    return applicationFormsIds.length;
  }

  function approveApplication(uint256 newFormId) public {
    require(roles[msg.sender] == Role.Admin, 'Only admins can approve applications');
    require(applicationForms[newFormId].status == Status.Pending, 'Invalid status');
    require(
      docItemContract.balanceOf(applicationForms[newFormId].user) != 0,
      'User already create their identity'
    );
    applicationForms[newFormId].status = Status.Approved;
    docItemContract.mintItem(applicationForms[newFormId].user, 'my-token-uri');
    emit Approved(newFormId);
  }

  function rejectApplication(uint256 newFormId) public {
    require(roles[msg.sender] == Role.Admin, 'Only admins can reject applications');
    require(applicationForms[newFormId].status == Status.Pending, 'Invalid status');
    applicationForms[newFormId].status = Status.Rejected;
    emit Rejected(newFormId);
  }

  event CreatedIDCard(uint256 newFormId, uint256 idCardsIds, IDCardData idcard);

  function createIDCard(
    uint256 id,
    string memory phoneNumber,
    string memory nationality,
    string memory dateOfBirth,
    uint256 identityCardNumber,
    string memory permanentAddress,
    string memory eyeColor,
    string memory height,
    string memory dateOfIssue
  ) public {
    require(!inUseIdentityCardNumber[identityCardNumber], 'Identity card number is already in use');

    uint256 newFormId = idCardCounter;
    idCardCounter++;

    IDCardData memory newIDCardData = IDCardData({
      id: id,
      phoneNumber: phoneNumber,
      nationality: nationality,
      dateOfBirth: dateOfBirth,
      identityCardNumber: identityCardNumber,
      permanentAddress: permanentAddress,
      eyeColor: eyeColor,
      height: height,
      dateOfIssue: dateOfIssue
    });

    idCards[newFormId] = newIDCardData;
    inUseIdentityCardNumber[identityCardNumber] = true;
    idCardsIds.push(newFormId);

    emit CreatedIDCard(newFormId, newFormId, newIDCardData);
  }
}
