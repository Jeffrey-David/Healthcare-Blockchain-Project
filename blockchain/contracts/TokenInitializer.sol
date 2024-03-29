// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./DEHToken.sol";

contract TokenInitializer {
    DEHToken public dehToken;

    constructor(address _dehTokenAddress) {
        dehToken = DEHToken(_dehTokenAddress);
    }

    function rechargeTokens() public {
        // Mint tokens to the recipient
        dehToken.mint(msg.sender, 100);
    }
}
