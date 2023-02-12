// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract DocItem is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  mapping(uint256 => bool) public nfts;

  constructor() ERC721('DocItem', 'DI') {}

  function mintItem(address _minter, string calldata _tokenURI) public returns (uint256) {
    _tokenIds.increment();
    uint256 newItemId = _tokenIds.current();
    _mint(_minter, newItemId);
    _setTokenURI(newItemId, _tokenURI);
    return newItemId;
  }

  function transfer(
    address _from,
    address _to,
    uint256 _tokenId
  ) public {
    require(!nfts[_tokenId], 'Token has already been transferred');
    super._transfer(_from, _to, _tokenId);
    nfts[_tokenId] = true;
  }

  function balanceOf(address _address) public view override returns (uint256) {
    // Check if the address already has a token assigned to it
    bool hasToken = false;
    for (uint256 i = 0; i < _tokenIds.current(); i++) {
      if (ownerOf(i) == _address) {
        hasToken = true;
        break;
      }
    }

    // Return 1 if the address doesn't have a token, 0 otherwise
    return hasToken ? 0 : 1;
  }
}
