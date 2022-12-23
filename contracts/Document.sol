// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./DocItem.sol";

contract Document is ReentrancyGuard {
    using Counters for Counters.Counter;
    address payable public owner;
    DocItem private immutable docItemContract;

    enum Status {
        Submitted,
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
        AM,
        A1,
        A2,
        B1,
        BE,
        C,
        D
    }
    struct IdCard {
        string name;
        uint256 id;
        Typeofdoc typeofdoc;
        Eyes eyes;
        Status status;
    }

    struct CarLicense {
        string name;
        uint256 id;
        Typeofdoc typeofdoc;
        Eyes eyes;
        Status status;
        Category category;
    }

    struct Passport {
        string name;
        uint256 id;
        Typeofdoc typeofdoc;
        Eyes eyes;
        Status status;
    }

    struct ApplicationForm{
        string name;
        Status status;
        uint256 id;
        string phone;
        string email;
  }
 
 constructor(address _docItemAddress) {
    owner = payable(msg.sender);
    docItemContract = DocItem(_docItemAddress);
  }
  modifier onlyOwner() {
    require(msg.sender == owner, "Only the owner can perform this action");
    _;
}
    mapping(uint256 => IdCard) public idcards;
    mapping(uint256 => CarLicense) public carlicenses;
    mapping(uint256 => Passport) public passports;

    mapping(uint256 => ApplicationForm) public applicationForms;

    mapping(uint256 => Status) public applicationStatus;

    uint256[] public IDid;
    uint256[] public carid;
    uint256[] public passportid;

    uint public idCardCounter = 0;
    uint public idpassportCounter = 0;
    uint public idcarlicenseCounter = 0;

    function approveApplication(uint256 applicationId) public {
    require(applicationStatus[applicationId] == Status.Pending, "The application must be in the Pending status");
    applicationStatus[applicationId] = Status.Approved;
}


 event IdentityCardCreated(uint256 idCardId, IdCard idCard);

function createIdentityCard(uint256 applicationId, IdCard memory idCard) public onlyOwner {
    require(applicationStatus[applicationId] == Status.Approved, "The application must be in the Approved status");
    uint256 idCardId = idCardCounter;
    idcards[idCardId] = idCard;
    idCardCounter++;
    emit IdentityCardCreated(idCardId, idCard);
}

event PassportCreated(uint256 passportid, Passport passport);

 function createPassport(uint256 applicationId, Passport memory passport) public onlyOwner {
    require(applicationStatus[applicationId] == Status.Approved, "The application must be in the Approved status");
    uint256  passportId = idpassportCounter;
    passports[passportId] = passport;
    idpassportCounter++;  
    emit PassportCreated(passportId, passport);
}

event CreatedCarLicense(uint256 aplicationid, CarLicense carlicense);

function createCarlicense(uint256 applicationId, CarLicense memory carlicense) public onlyOwner {
    require(applicationStatus[applicationId] == Status.Approved, "The application must be in the Approved status");
     uint256  carlicenseId = idcarlicenseCounter;
        carlicenses[carlicenseId] = carlicense;
        idcarlicenseCounter++;   
        emit CreatedCarLicense(carlicenseId, carlicense);
}
}
