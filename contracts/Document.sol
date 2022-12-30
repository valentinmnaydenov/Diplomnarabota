 // SPDX-License-Identifier: MIT
pragma solidity ^ 0.8 .9;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./DocItem.sol";


contract Document is ReentrancyGuard {
    using Counters for Counters.Counter;
address payable public owner;
DocItem private immutable docItemContract;

uint256 nextAvailableId = 0;

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
}


constructor(address _docItemAddress) {
    owner = payable(msg.sender);
    docItemContract = DocItem(_docItemAddress);
}


modifier onlyOwner() {
    require(msg.sender == owner, "Only the owner can perform this action");
    _;
}

mapping(uint256 => IdCard)public idcards;
mapping(uint256 => CarLicense)public carlicenses;
mapping(uint256 => Passport)public passports;
mapping(uint256 => ApplicationForm)public applicationForms;
mapping(uint256 => Status)public applicationStatus;
mapping(uint256 => bool)public nfts;


uint public idCardCounter = 0;
uint public idpassportCounter = 0;
uint public idcarlicenseCounter = 0;


function mint(address _to, uint256 _id)public {
    require(!nfts[_id], "NFT with this ID already exists");
    nfts[_id] = true;
}
//The mint function checks if an NFT with the given ID already exists. It does this by checking the value of nfts[_id].
//If nfts[_id] is true, it means that an NFT with this ID already exists and the function will throw an error.

event Mint(address indexed _to, uint256 indexed _id);
function mintNFT(ApplicationForm memory applicationForm)public {
    require(applicationForm.status == Status.Approved, "Invalid approval");

    uint256 id = nextAvailableId;
    mint(msg.sender, id);
    applicationForms[id].ipfsLink = applicationForm.ipfsLink;
    nextAvailableId ++;      //nextAvailableId variable to keep track of the next available ID for minting new NFTs.
    emit Mint(msg.sender, id);
}
// function is responsible for minting a new NFT with the given ID and metadata taken from the ApplicationForm struct.


event IdentityCardCreated(uint256 idCardId, IdCard idCard);

function createIdentityCard(uint256 applicationId, IdCard memory idCard)public onlyOwner {
    require(applicationStatus[applicationId] == Status.Approved, "The application must be in the Approved status");
    uint256 idCardId = idCardCounter;
    idcards[idCardId] = idCard;
    idCardCounter ++;
    emit IdentityCardCreated(idCardId, idCard);
}

event PassportCreated(uint256 passportid, Passport passport);

function createPassport(uint256 applicationId, Passport memory passport)public onlyOwner {
    require(applicationStatus[applicationId] == Status.Approved, "The application must be in the Approved status");
    uint256 passportId = idpassportCounter;
    passports[passportId] = passport;
    idpassportCounter ++;
    emit PassportCreated(passportId, passport);
}

event CreatedCarLicense(uint256 aplicationid, CarLicense carlicense);

function createCarlicense(uint256 applicationId, CarLicense memory carlicense)public onlyOwner {
    require(applicationStatus[applicationId] == Status.Approved, "The application must be in the Approved status");
    uint256 carlicenseId = idcarlicenseCounter;
    carlicenses[carlicenseId] = carlicense;
    idcarlicenseCounter ++;
    emit CreatedCarLicense(carlicenseId, carlicense);
}}
