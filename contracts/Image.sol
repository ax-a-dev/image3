// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Image {
    struct ImageStruct {
        string name;
        string url;
        address uploader;
        uint likes;
    }

    uint256 totalImages;
    mapping(uint => ImageStruct) public images;

    constructor() {
        console.log("Image contract constructed!");
    }

    function uploadImage(string memory name, string memory url) public returns (uint id) {
        id = totalImages++;
        ImageStruct storage image = images[totalImages];
        image.name = name;
        image.url = url;
        image.likes = 0;
        image.uploader = msg.sender;
        return id;
    }

    function getTotalImages() public view returns (uint256) {
        return totalImages;
    }

    function likeImage(uint id) public {
        ImageStruct storage image = images[id];
        image.likes += 1;
    }

    function getImage(uint id) public view returns (ImageStruct memory) {
        ImageStruct storage image = images[id];
        return image;
    }

    function getImages() public view returns (string[] memory, address[] memory, string[] memory, uint[] memory) {
        string[] memory names = new string[](totalImages);
        address[] memory addresses = new address[](totalImages);
        string[] memory urls = new string[](totalImages);
        uint[] memory likes = new uint[](totalImages);
        for (uint i = 0; i < totalImages; i++) {
            ImageStruct storage image = images[i];
            names[i] = image.name;
            addresses[i] = image.uploader;
            urls[i] = image.url;
            likes[i] = image.likes;
        }
        return (names, addresses, urls, likes);
    }
}