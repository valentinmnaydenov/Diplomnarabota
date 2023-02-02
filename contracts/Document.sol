// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import './DocItem.sol';

contract Document is ReentrancyGuard {
  using Counters for Counters.Counter;
  address payable public owner;
  DocItem private immutable docItemContract;

  Counters.Counter private _applicationFormsId;

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

  // enum Eyes {
  //   blue,
  //   green,
  //   brown
  // }

  // enum Category {
  //   A,
  //   B,
  //   C,
  //   D
  // }

  // struct CarLicense {
  //   string name;
  //   uint256 id;
  //   Typeofdoc typeofdoc;
  //   Eyes eyes;
  //   Status status;
  //   Category category;
  //   string photo;
  // }

  // struct Passport {
  //   string name;
  //   uint256 id;
  //   Typeofdoc typeofdoc;
  //   Eyes eyes;
  //   Status status;
  //   string photo;
  // }

  struct ApplicationForm {
    string name;
    Status status;
    uint256 id;
    string ipfsLink;
    uint256 egn;
    address user;
  }

  struct IDCardData {
    string name;
    string placeOfBirth;
    string nationality;
    bytes photo;
  }

  constructor(address _docItemAddress) {
    docItemContract = DocItem(_docItemAddress);
    roles[msg.sender] = Role.Admin;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only the owner can perform this action');
    _;
  }

  mapping(address => IDCardData) public idCards;
  // mapping(uint256 => CarLicense) public carlicenses;
  // mapping(uint256 => Passport) public passports;
  mapping(uint256 => ApplicationForm) public applicationForms;
  mapping(uint256 => Status) public applicationStatus;
  mapping(uint256 => bool) public nfts;
  mapping(address => Role) public roles;
  mapping(address => bool) public theroles;
  mapping(uint256 => bool) public inUseEgn;
  mapping(uint256 => bool) public applicationFormsExist;
  mapping(uint256 => address) public formCreators;
  uint256 nextAvailableId = 0;

  uint256[] public applicationFormsIds;

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
    // require(!applicationFormsExist[id], 'An application with this id already exists');
    require(!inUseEgn[egn], 'EGN is already in use');

    _applicationFormsId.increment();

    uint256 newFormId = _applicationFormsId.current();

    ApplicationForm memory newApplicationForm = ApplicationForm({
      name: name,
      status: Status.Pending,
      id: newFormId,
      ipfsLink: ipfsLink,
      egn: egn,
      user: user
    });

    formCreators[newFormId] = user;
    applicationFormsExist[newFormId] = true;
    applicationForms[newFormId] = newApplicationForm;
    inUseEgn[egn] = true;

    applicationFormsIds.push(newFormId);
    // Emit an event to indicate that the application form has been created
    emit CreatedApplicationForm(newFormId, newApplicationForm);
  }

  function getApplicationFormsIdsLenght() external view returns (uint256) {
    return applicationFormsIds.length;
  }

  function approveApplication(uint256 _applicationId) public {
    require(roles[msg.sender] == Role.Admin, 'Only admins can approve applications');
    require(applicationForms[_applicationId].status == Status.Pending, 'Invalid status');
    applicationForms[_applicationId].status = Status.Approved;
    docItemContract.mintItem(msg.sender, 'my-token-uri');
    emit Approved(_applicationId);
  }

  function rejectApplication(uint256 _applicationId) public {
    require(roles[msg.sender] == Role.Admin, 'Only admins can reject applications');
    require(applicationForms[_applicationId].status == Status.Pending, 'Invalid status');
    applicationForms[_applicationId].status = Status.Rejected;
    emit Rejected(_applicationId);
  }

  function pendingApplication(uint256 _applicationId) public {
    require(roles[msg.sender] == Role.Admin, 'Only admins can mark applications as pending');
    require(applicationForms[_applicationId].status != Status.Pending, 'Invalid status');
    applicationForms[_applicationId].status = Status.Pending;
    emit Pending(_applicationId);
  }

  function createIDCard(
    string memory _name,
    string memory _placeOfBirth,
    string memory _nationality,
    bytes memory _photo
  ) public {
    idCards[msg.sender] = IDCardData(_name, _placeOfBirth, _nationality, _photo);
  }
}
