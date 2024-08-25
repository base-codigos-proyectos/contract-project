// SPDX-License-Identifier: PRIVATE
// Indica la licencia bajo la cual se distribuye el contrato. En este caso, es una licencia privada.

pragma solidity ^0.8.4;
// Especifica la versión del compilador de Solidity que debe usarse. Aquí se está utilizando la versión 0.8.4.

contract ServiceManager {
    // Define un contrato llamado ServiceManager.

    string[] serviceProviders;
    // Declara un array dinámico de cadenas de texto llamado `serviceProviders` para almacenar los nombres de los proveedores de servicios.

    function createNewServiceProvider(string memory _companyName) external {
        // Función pública (externa) que permite agregar un nuevo proveedor de servicios al array.
        // `_companyName` es el nombre de la compañía que se agrega a la lista.

        serviceProviders.push(_companyName);
        // Añade el nombre de la compañía proporcionada a la lista de `serviceProviders`.
    }

    function getServiceProviders() external view returns (string[] memory) {
        // Función pública (externa) y de solo lectura (view) que devuelve la lista de proveedores de servicios.
        // La función retorna un array de cadenas de texto que contiene los nombres de los proveedores de servicios.

        return serviceProviders;
        // Devuelve el array `serviceProviders`.
    }
}
