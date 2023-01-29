// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import './DocItem.sol';

contract Document is ReentrancyGuard {
  using Counters for Counters.Counter;
  address payable public owner;
  DocItem private immutable docItemContract;

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

  enum Eyes {
    blue,
    green,
    brown
  }

  enum Category {
    A,
    B,
    C,
    D
  }
  struct IdCard {
    string name;
    uint256 id;
    Typeofdoc typeofdoc;
    Eyes eyes;
    Status status;
    string photo;
  }

  struct CarLicense {
    string name;
    uint256 id;
    Typeofdoc typeofdoc;
    Eyes eyes;
    Status status;
    Category category;
    string photo;
  }

  struct Passport {
    string name;
    uint256 id;
    Typeofdoc typeofdoc;
    Eyes eyes;
    Status status;
    string photo;
  }

  struct ApplicationForm {
    string name;
    Status status;
    uint256 id;
    string ipfsLink;
    uint256 egn;
    address user;
  }

  constructor(address _docItemAddress) {
    docItemContract = DocItem(_docItemAddress);
    roles[msg.sender] = Role.Admin;
  }

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only the owner can perform this action');
    _;
  }

  mapping(uint256 => IdCard) public idcards;
  mapping(uint256 => CarLicense) public carlicenses;
  mapping(uint256 => Passport) public passports;
  mapping(uint256 => ApplicationForm) public applicationForms;
  mapping(uint256 => Status) public applicationStatus;
  mapping(uint256 => bool) public nfts;
  mapping(address => Role) public roles;
  mapping(address => bool) public theroles;
  mapping(uint256 => bool) public inUseEgn;
  mapping(uint256 => bool) public applicationFormsExist;
  uint256 nextAvailableId = 0;

  event CreatedApplicationForm(uint256 idApplicationId, ApplicationForm applicationForm);
  event Approved(uint256 _applicationId);
  event Rejected(uint256 _applicationId);
  event Pending(uint256 _applicationId);

  function createApplicationForm(
    string memory name,
    uint256 id,
    string memory ipfsLink,
    uint256 egn,
    address user
  ) public {
    require(theroles[msg.sender], 'Sender does not have the necessary role');
    require(!applicationFormsExist[id], 'An application with this id already exists');
    require(!inUseEgn[egn], 'EGN is already in use');

    // Create a new ApplicationForm struct instance
    ApplicationForm memory newApplicationForm = ApplicationForm({
      name: name,
      status: Status.Pending,
      id: id,
      ipfsLink: ipfsLink,
      egn: egn,
      user: user
    });

    // Set the relevant mappings
    applicationFormsExist[id] = true;
    applicationForms[id] = newApplicationForm;
    inUseEgn[egn] = true;

    // Emit an event to indicate that the application form has been created
    emit CreatedApplicationForm(id, newApplicationForm);
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
}
