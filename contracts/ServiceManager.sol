// SPDX-License-Identifier: PRIVATE
// Indica la licencia bajo la cual se distribuye el contrato. En este caso, es una licencia privada.

pragma solidity ^0.8.4;
// Especifica la versión del compilador de Solidity que debe usarse. Aquí se está utilizando la versión 0.8.4.
import "./ServiceAgreement.sol"; // Importar el contrato ServiceAgreement

contract ServiceManager {
    mapping(address => ServicesProvider) private serviceProviders;
    address[] private serviceProviderIndex;
    // event Debug(string message, uint256 value);

    mapping(address => address[]) private clientAgreements; // Para almacenar acuerdos de servicio por cliente
    mapping(address => address[]) private providerAgreements;

    enum ServiceCategory {
        Health,
        Development,
        Consultancy,
        Marketing,
        IAConsultancy
    }
    // Declara un tipo enumerado llamado ServiceCategory que tiene cinco posibles valores:
    // Health, Development, Consultancy, Marketing e IAConsultancy.

    modifier validProviderOnly(address _provider) {
        require(serviceProviderIndex.length != 0, "No service providers");

        // Verifica que el proveedor de servicios exista
        require(
            serviceProviders[_provider].owner != address(0),
            "Service provider does not exist"
        );
        _;
    }

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

    event NewAgreement(
        address indexed client,
        address indexed provider,
        address agreemenAddress
    );

    event ErrorNotice(string message);
    event ErrorNoticeBytes(bytes data);

    function createNewServiceProvider(
        string memory _companyName,
        string memory _email,
        string memory _phone,
        uint256 _serviceAmount,
        ServiceCategory _serviceCategory
    ) external {
        // Asegúrate de que el proveedor no esté ya registrado
        require(
            serviceProviders[msg.sender].owner == address(0),
            "Service provider already exists"
        );

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

    function getServiceProvider(
        address _address
    )
        external
        view
        validProviderOnly(_address)
        returns (ServicesProvider memory)
    {
        return serviceProviders[_address];
    }

    function getAllServiceProviders()
        external
        view
        returns (ServicesProvider[] memory)
    {
        ServicesProvider[]
            memory validServiceProviders = new ServicesProvider[](
                serviceProviderIndex.length
            );

        for (uint256 i = 0; i < serviceProviderIndex.length; i++) {
            address currentAddress = serviceProviderIndex[i];
            // Añadir el proveedor de servicios al array
            validServiceProviders[i] = serviceProviders[currentAddress];
        }

        return validServiceProviders;
    }

    function createServiceAgreement(
        address _provider
    ) external validProviderOnly(_provider) {
        require(
            _provider != msg.sender,
            "providers cannot create service agreemt with theserves"
        );

        uint256 amount = serviceProviders[_provider].serviceAmount;
        // emit Debug("Required service amount", amount); // Debugging el monto requerido

        require(msg.sender.balance >= amount, "no tiene fondos sufucientes");

        // emit Debug("Sender balance", msg.sender.balance); // Debugging balance del sender

        try new ServiceAgreement(msg.sender, _provider, amount) returns (
            ServiceAgreement serviceAgreement
        ) {
            address agreementAddress = address(serviceAgreement);

            address[] storage ca = clientAgreements[msg.sender];
            ca.push(agreementAddress);

            address[] storage pa = providerAgreements[_provider];
            pa.push(agreementAddress);

            emit NewAgreement(msg.sender, _provider, agreementAddress);
        } catch Error(string memory reason) {
            emit ErrorNotice(reason);
        } catch (bytes memory reason) {
            emit ErrorNoticeBytes(reason);
        }
    }

    function getClientServiceAgreements(
        address _clientAddress
    ) external view returns (address[] memory) {
        return clientAgreements[_clientAddress];
    }

    function getProviderServiceAgreements(
        address _provider
    ) external view returns (address[] memory) {
        return providerAgreements[_provider];
    }
}
