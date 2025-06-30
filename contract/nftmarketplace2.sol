// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint public listingPrice = 0.0025 ether;
    address payable public owner;

    enum Category { Project, Internship, Certificate, Hackathon, ResearchPaper }

    struct MarketItem {
        uint tokenId;
        address payable seller;
        address payable owner;
        uint price;
        bool sold;
        bool isSoulBound;
        Category category;
    }

    mapping(uint => MarketItem) private idToMarketItem;

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
        require(msg.sender == owner, "Only marketplace owner can call this");
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
        bool isSoulBound,
        Category category
    ) public payable returns (uint) {
        require(msg.value == listingPrice, "Pay listing fee");
        require(price > 0 || isSoulBound, "Non-soulbound NFTs must have a price");

        _tokenIds.increment();
        uint newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        _createMarketItem(newTokenId, price, isSoulBound, category);

        return newTokenId;
    }

    function _createMarketItem(
        uint tokenId,
        uint price,
        bool isSoulBound,
        Category category
    ) private {
        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false,
            isSoulBound,
            category
        );

        _transfer(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            tokenId,
            msg.sender,
            address(this),
            price,
            false,
            isSoulBound,
            category
        );
    }

    function createMarketSale(uint tokenId) public payable {
        MarketItem storage item = idToMarketItem[tokenId];
        require(!item.isSoulBound, "Soulbound NFTs cannot be sold");
        require(msg.value == item.price, "Pay the asking price");

        item.owner = payable(msg.sender);
        item.sold = true;

        _itemsSold.increment();

        _transfer(address(this), msg.sender, tokenId);

        payable(owner).transfer(listingPrice);
        item.seller.transfer(msg.value);
    }

    function resellToken(uint tokenId, uint price) public payable {
        MarketItem storage item = idToMarketItem[tokenId];

        require(item.owner == msg.sender, "You are not the owner");
        require(!item.isSoulBound, "Soulbound NFTs cannot be resold");
        require(msg.value == listingPrice, "Pay listing fee");

        item.sold = false;
        item.price = price;
        item.seller = payable(msg.sender);
        item.owner = payable(address(this));

        _itemsSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint totalCount = _tokenIds.current();
        uint unsoldCount = totalCount - _itemsSold.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldCount);
        for (uint i = 1; i <= totalCount; i++) {
            if (idToMarketItem[i].owner == address(this)) {
                items[currentIndex] = idToMarketItem[i];
                currentIndex++;
            }
        }
        return items;
    }

    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint totalCount = _tokenIds.current();
        uint count = 0;
        uint index = 0;

        for (uint i = 1; i <= totalCount; i++) {
            if (idToMarketItem[i].owner == msg.sender) {
                count++;
            }
        }

        MarketItem[] memory items = new MarketItem[](count);
        for (uint i = 1; i <= totalCount; i++) {
            if (idToMarketItem[i].owner == msg.sender) {
                items[index] = idToMarketItem[i];
                index++;
            }
        }
        return items;
    }

    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint totalCount = _tokenIds.current();
        uint count = 0;
        uint index = 0;

        for (uint i = 1; i <= totalCount; i++) {
            if (idToMarketItem[i].seller == msg.sender) {
                count++;
            }
        }

        MarketItem[] memory items = new MarketItem[](count);
        for (uint i = 1; i <= totalCount; i++) {
            if (idToMarketItem[i].seller == msg.sender) {
                items[index] = idToMarketItem[i];
                index++;
            }
        }
        return items;
    }

    // Prevent transfer of soulbound tokens
    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override {
        if (from != address(0)) {
            require(!idToMarketItem[tokenId].isSoulBound, "Soulbound NFTs are non-transferable");
        }
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
