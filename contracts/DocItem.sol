// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract DocItem is ERC721URIStorage{
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721('NFToken', 'NFT') {}

  function mintItem(address _minter, string calldata _tokenURI) public  
    returns (uint256)
    {
    _tokenIds.increment();

    uint256 newItemId = _tokenIds.current();
    _mint(_minter, newItemId);
    _setTokenURI(newItemId, _tokenURI);

    return newItemId;
  }
}