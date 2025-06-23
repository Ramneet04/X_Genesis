//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//INTERNAL IMPORT FOR NFT OPENZIPLINE
import "@openzeppelin/contracts/utils/Counters.sol"; // using as a counter
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemSold;

    uint listingPrice = 0.0025 ether;

    address payable owner;

    mapping(uint256 => MarketItem) private idMarketItem;

    struct MarketItem {
        uint tokenId;
        address payable seller;
        address payable owner;
        uint price;
        bool sold;
    }

    event idMarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
  );

  modifier onlyOwner {
    require(msg.sender == owner,
    "only owner of market place can call this function");
    _;
  }

  constructor() ERC721("NFT Metaverse Token", "MYNFT"){
    owner = payable(msg.sender);
 }

 function updateListingPrice(uint _listingPrice) public payable onlyOwner {
    listingPrice = _listingPrice;
 }

//allow us to fetch the listing price
 function getListingPrice() public view returns(uint) {
    return listingPrice;
 }

// let create "create nft token function"
//here we are returning the tokenId
function createToken(string memory tokenURI, uint price) public payable returns(uint) {
  _tokenIds.increment();
  uint newTokenId = _tokenIds.current();

  _mint(msg.sender, newTokenId);
  _setTokenURI(newTokenId, tokenURI);

  createMarketItem(newTokenId, price);

  return newTokenId;
}

//it will give the nft and 
//assign all the data to a particular nft..
function createMarketItem(uint tokenId, uint price) private {
  require(price>0, "Price must be atleast 1");
  require(msg.value == listingPrice,"price must be equal to listingPrice");

  idMarketItem[tokenId] = MarketItem(
    tokenId,
    payable(msg.sender),
    payable(address(this)),
    price,
    false
  );

  _transfer(msg.sender, address(this), tokenId);

  emit idMarketItemCreated(
    tokenId,
    msg.sender,
    address(this),
    price,
    false);
}

//function for resale token
function reSellToken(uint tokenId, uint price) public payable{
    require(idMarketItem[tokenId].owner == msg.sender,"only item owner can call this function");
    require(msg.value == listingPrice,"Price must be equal to listingPrice");

    idMarketItem[tokenId].sold = false;
    idMarketItem[tokenId].price = price;
    idMarketItem[tokenId].seller = payable(msg.sender);
    idMarketItem[tokenId].owner = payable(address(this));

    _itemSold.decrement();

    _transfer(msg.sender, address(this), tokenId);
    }

    //function create market sale

    function createMarketSale(uint tokenId) public payable{
        uint price = idMarketItem[tokenId].price;

        require(msg.value == price,"please submit the asking price to complete the purchase");
        idMarketItem[tokenId].owner = payable(msg.sender);
        idMarketItem[tokenId].sold = true;
        idMarketItem[tokenId].owner = payable(address(0));

        _itemSold.increment();
        _transfer(address(this), msg.sender,tokenId);

        payable(owner).transfer(listingPrice);
        payable(idMarketItem[tokenId].seller).transfer(msg.value);
    }

    //getting unsold nft data
    function fetchMarketItem() public view returns(MarketItem[] memory){
        uint itemCount = _tokenIds.current();
        uint unSoldItemCount = _tokenIds.current() - _itemsSold.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unSoldItemCount);
        for(uint i=0;i<itemCount;i++) {
            if(idMarketItem[i+1].owner == address(this)) {
                uint currentId = i+1;

                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex +=1;

            }
        }
        return items;
    }

    //purchase item
    function fetchMyNFT() public view returns(MarketItem[] memory){
        uint totalCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for(uint i=0;i<totalCount;i++){
            if(idMarketItem[i+1].owner == msg.sender) {
                itemCount +=1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        for(uint i=0;i<totalCount;i++) {
            if(idMarketItem[i+1].owner == msg.sender){
            uint currentId = i+1;
            MarketItem storage currentItem = idMarketItem[currentId];
            items[currentIndex] = currentItem;
            currentIndex +=1;
        }
      }
      return items;
    }

    //single user item
    function fetchItemsListed() public view returns(MarketItem[] memory) {
        uint totalCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for(uint i=0;i<totalCount;i++) {
            if(idMarketItem[i+1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint i=0;i<totalCount;i++) {
            if(idMarketItem[i+1].seller == msg.sender) {
                uint currentId = i+1;

                MarketItem storage currentItem = idMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
         return items;
    }

}