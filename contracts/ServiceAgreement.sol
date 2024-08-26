// SPDX-License-Identifier: PRIVATE
// Indica la licencia bajo la cual se distribuye el contrato. En este caso, es una licencia privada.

pragma solidity ^0.8.4;
// Especifica la versión del compilador de Solidity que debe usarse. Aquí se está utilizando la versión 0.8.4.

contract ServiceAgreement {
    address client;
    address provider;
    uint256 termAmount;

    constructor(address _client, address _provider, uint256 _termAmount) {
        client = _client;
        provider = _provider;
        termAmount = _termAmount;
    }
}
