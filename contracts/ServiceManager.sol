// SPDX-License-Identifier: PRIVATE
// Indica la licencia bajo la cual se distribuye el contrato. En este caso, es una licencia privada.

pragma solidity ^0.8.4;
// Especifica la versión del compilador de Solidity que debe usarse. Aquí se está utilizando la versión 0.8.4.

contract ServiceManager {
    // Define un contrato llamado ServiceManager.

    mapping(address => ServicesProvider) private serviceProviders;
    address[] private serviceProviderIndex;
    enum ServiceCategory {
        Health,
        Development,
        Consultancy,
        Marketing,
        IAConsultancy
    }
    // Declara un tipo enumerado llamado ServiceCategory que tiene cinco posibles valores:
    // Health, Development, Consultancy, Marketing e IAConsultancy.

    struct ServicesProvider {
        address owner;
        string companyName;
        string email;
        string phone;
        uint256 serviceAmount;
        ServiceCategory serviceCategory;
        uint256 index;
    }
    // Declara una estructura llamada ServicesProvider con los siguientes campos:
    // owner, companyName, email, phone, serviceAmount, serviceCategory, y index.

    event RegisterServiceProvider(address indexed owner);

    function createNewServiceProvider(
        string memory _companyName,
        string memory _email,
        string memory _phone,
        uint256 _serviceAmount,
        ServiceCategory _serviceCategory
    ) external {
        // Asegúrate de que el proveedor no esté ya registrado
        require(serviceProviders[msg.sender].owner == address(0), "Service provider already exists");

        // Registra la dirección del proveedor
        serviceProviderIndex.push(msg.sender);
        serviceProviders[msg.sender] = ServicesProvider({
            owner: msg.sender,
            companyName: _companyName,
            email: _email,
            phone: _phone,
            serviceAmount: _serviceAmount,
            serviceCategory: _serviceCategory,
            index: serviceProviderIndex.length - 1
        });

        emit RegisterServiceProvider(msg.sender);
    }

    function getServiceProvider(address _address) external view returns (ServicesProvider memory) {
        // Verifica que haya proveedores registrados
        require(serviceProviderIndex.length != 0, "No service providers");

        // Verifica que el proveedor de servicios exista
        require(serviceProviders[_address].owner != address(0), "Service provider does not exist");

        return serviceProviders[_address];
    }

    // Si quieres devolver la lista de direcciones de todos los proveedores de servicios
    function getAllServiceProviders() external view returns (address[] memory) {
        return serviceProviderIndex;
    }
}
