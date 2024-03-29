// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DEHToken is IERC20 {
    string public constant symbol = "DEH";
    string public constant name = "DEH Token";
    uint8 public constant decimals = 0;
    uint private constant __totalSupply = 10000;
    mapping (address => uint) private __balanceOf;
    mapping (address => mapping (address => uint)) private __allowances;

    constructor() {
    }

    function totalSupply() public pure override returns (uint _totalSupply) {
        return __totalSupply;
    }

    function balanceOf(address _addr) public view override returns (uint balance) {
        return __balanceOf[_addr];
    }

    function transfer(address _to, uint _value) public override returns (bool success) {
        require(_value > 0 && _value <= balanceOf(msg.sender), "Insufficient balance");
        
        __balanceOf[msg.sender] -= _value;
        __balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint _value) public override returns (bool success) {
        require(_value > 0 && _value <= balanceOf(_from), "Insufficient balance");
        
        __balanceOf[_from] -= _value;
        __balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    function mint(address _to, uint _amount) public {
        require(_to != address(0), "Mint to the zero address");
        __balanceOf[_to] += _amount;
        emit Transfer(address(0), _to, _amount);
    }

    function approve(address _spender, uint _value) public override returns
    (bool success) {
        __allowances[msg.sender][_spender] = _value;
        return true;
    }
    function allowance(address _owner, address _spender)
        public view override returns (uint remaining) {
            return __allowances[_owner][_spender];
    }
}
