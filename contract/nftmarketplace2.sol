// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemSold;

    uint public listingPrice = 0.0025 ether;
    address payable public owner;

    enum Category { Project, Internship, Certificate, Hackathon }

    struct MarketItem {
        uint tokenId;
        address payable seller;
        address payable owner;
        uint price;
        bool sold;
        bool isSoulBound;
        Category category;
    }

    mapping(uint => MarketItem) private idMarketItem;

    event MarketItemCreated(
        uint indexed tokenId,
        address seller,
        address owner,
        uint price,
        bool sold,
        bool isSoulBound,
        Category category
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only marketplace owner");
        _;
    }

    constructor() ERC721("Genesis NFT", "GEN") {
        owner = payable(msg.sender);
    }

    function updateListingPrice(uint _listingPrice) public onlyOwner {
        listingPrice = _listingPrice;
    }

    function getListingPrice() public view returns (uint) {
        return listingPrice;
    }

    function createToken(
        string memory tokenURI,
        uint price,
        Category category
    ) public payable returns (uint) {
        require(price > 0, "Price must be > 0");
        require(msg.value == listingPrice, "Pay listing fee");

        _tokenIds.increment();
        uint newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        bool isSoulBound = (category == Category.Internship || category == Category.Certificate);
        _createMarketItem(newTokenId, price, isSoulBound, category);

        return newTokenId;
    }

    function _createMarketItem(
        uint tokenId,
        uint price,
        bool isSoulBound,
        Category category
    ) private {
        idMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false,
            isSoulBound,
            category
        );

        _transfer(msg.sender, address(this), tokenId);

        emit MarketItemCreated(tokenId, msg.sender, address(this), price, false, isSoulBound, category);
    }

    function resellToken(uint tokenId, uint price) public payable {
        MarketItem storage item = idMarketItem[tokenId];

        require(item.owner == msg.sender, "Not your NFT");
        require(msg.value == listingPrice, "Listing fee required");
        require(!item.isSoulBound, "This NFT is soulbound");

        item.sold = false;
        item.price = price;
        item.seller = payable(msg.sender);
        item.owner = payable(address(this));

        _itemSold.decrement();
        _transfer(msg.sender, address(this), tokenId);
    }

    function createMarketSale(uint tokenId) public payable {
        MarketItem storage item = idMarketItem[tokenId];
        uint price = item.price;

        require(msg.value == price, "Pay full price");

        item.owner = payable(msg.sender);
        item.sold = true;

        _itemSold.increment();

        _transfer(address(this), msg.sender, tokenId);

        payable(owner).transfer(listingPrice);
        item.seller.transfer(msg.value);
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _tokenIds.current();
        uint unsoldItemCount = _tokenIds.current() - _itemSold.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);

        for (uint i = 1; i <= itemCount; i++) {
            if (idMarketItem[i].owner == address(this)) {
                items[currentIndex] = idMarketItem[i];
                currentIndex += 1;
            }
        }

        return items;
    }

    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 1; i <= totalCount; i++) {
            if (idMarketItem[i].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 1; i <= totalCount; i++) {
            if (idMarketItem[i].owner == msg.sender) {
                items[currentIndex] = idMarketItem[i];
                currentIndex += 1;
            }
        }

        return items;
    }

    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint totalCount = _tokenIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 1; i <= totalCount; i++) {
            if (idMarketItem[i].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint i = 1; i <= totalCount; i++) {
            if (idMarketItem[i].seller == msg.sender) {
                items[currentIndex] = idMarketItem[i];
                currentIndex += 1;
            }
        }

        return items;
    }

    // Block transfer of soulbound tokens
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {
        if (from != address(0)) {
            require(!idMarketItem[tokenId].isSoulBound, "Soulbound NFT cannot be transferred");
        }
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
