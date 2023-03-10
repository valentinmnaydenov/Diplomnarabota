// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './DocItem.sol';

contract Document is ReentrancyGuard, Ownable {
  using Counters for Counters.Counter;

  DocItem private immutable docItemContract;
  uint256 public applicationFormCounter = 0;
  uint256 public idCardCounter = 0;

  uint256[] public applicationFormsIds;
  uint256[] public idCardsIds;

  enum Status {
    Approved,
    Pending,
    Rejected
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
    uint256 identityID;
    uint256 id;
    string phoneNumber;
    string nationality;
    uint256 dateOfBirth;
    uint256 identityCardNumber;
    string permanentAddress;
    string eyeColor;
    string height;
    uint256 dateOfIssue;
    uint256 dateOfExpired;
    Status status;
  }

  mapping(uint256 => ApplicationForm) public applicationForms;
  mapping(uint256 => Status) public applicationStatus;
  mapping(uint256 => bool) public nfts;
  mapping(uint256 => bool) public inUseEgn;
  mapping(uint256 => IDCardData) public idCards;
  mapping(uint256 => bool) public inUseIdentityCardNumber;

  event CreatedApplicationForm(uint256 idApplicationId, ApplicationForm applicationForm);
  event Approved(uint256 _applicationId);
  event Rejected(uint256 _applicationId);
  event Pending(uint256 _applicationId);
  event CreatedIDCard(uint256 newCardId, IDCardData idcard);

  constructor(address _docItemAddress) {
    docItemContract = DocItem(_docItemAddress);
  }

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

  function approveApplication(uint256 newFormId) public onlyOwner {
    require(applicationForms[newFormId].status == Status.Pending, 'Invalid status');
    require(
      docItemContract.balanceOf(applicationForms[newFormId].user) == 0,
      'User already create  identity'
    );

    applicationForms[newFormId].status = Status.Approved;

    docItemContract.safeMint(
      applicationForms[newFormId].user,
      applicationForms[newFormId].ipfsLink
    );

    emit Approved(newFormId);
  }

  function rejectApplication(uint256 newFormId) public onlyOwner {
    require(applicationForms[newFormId].status == Status.Pending, 'Invalid status');
    applicationForms[newFormId].status = Status.Rejected;
    emit Rejected(newFormId);
  }

  function createIDCard(
    uint256 identityID,
    string memory phoneNumber,
    string memory nationality,
    uint256 dateofBirth,
    uint256 identityCardNumber,
    string memory permanentAddress,
    string memory eyeColor,
    string memory height,
    uint256 dateOfIssue,
    uint256 dateOfExpired
  ) public {
    require(!inUseIdentityCardNumber[identityCardNumber], 'Identity card number is already in use');

    uint256 newCardId = idCardCounter;
    idCardCounter++;

    // Convert date of birth string to uint256

    IDCardData memory newIDCardData = IDCardData({
      identityID: identityID,
      id: newCardId,
      phoneNumber: phoneNumber,
      nationality: nationality,
      dateOfBirth: dateofBirth,
      identityCardNumber: identityCardNumber,
      permanentAddress: permanentAddress,
      eyeColor: eyeColor,
      height: height,
      dateOfIssue: dateOfIssue,
      dateOfExpired: dateOfExpired,
      status: Status.Pending
    });

    idCards[newCardId] = newIDCardData;
    inUseIdentityCardNumber[identityCardNumber] = true;
    idCardsIds.push(newCardId);

    emit CreatedIDCard(newCardId, newIDCardData);
  }

  function getIdCardsIdsLength() external view returns (uint256) {
    return idCardsIds.length;
  }

  function approveIDCard(uint256 newCardId) public onlyOwner {
    require(idCards[newCardId].status == Status.Pending, 'Invalid status');

    idCards[newCardId].status = Status.Approved;

    emit Approved(newCardId);
  }

  function rejectIDCard(uint256 newCardId) public onlyOwner {
    require(idCards[newCardId].status == Status.Pending, 'Invalid status');
    idCards[newCardId].status = Status.Rejected;
    emit Rejected(newCardId);
  }
}
