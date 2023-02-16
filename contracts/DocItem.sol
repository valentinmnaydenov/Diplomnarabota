// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract DocItem is ERC721URIStorage, IERC721Enumerable {
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

  function tokenOfOwnerByIndex(address owner, uint256 index)
    public
    view
    override
    returns (uint256 tokenId)
  {
    require(index < balanceOf(owner), 'ERC721Enumerable: owner index out of bounds');
    return tokenOfOwnerByIndex(owner, index);
  }

  function totalSupply() public view override returns (uint256) {
    return _tokenIds.current();
  }

  function tokenByIndex(uint256 index) public view override returns (uint256) {
    require(index < totalSupply(), 'ERC721Enumerable: global index out of bounds');
    return tokenByIndex(index);
  }
}
