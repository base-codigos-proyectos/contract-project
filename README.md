
habilitar el servidor
geth --http --http.addr "127.0.0.1" --http.port 8545 --http.api personal,eth,net,web3 --networkid 4 --allow-insecure-unlock

Conectar a la Consola 
geth attach http://localhost:8545

ccrea nueva cuenta
var account = personal.newAccount("tuContraseñaSegura")

Listar las Cuentas Existentes
personal.listAccounts


Desbloquear una Cuenta
personal.unlockAccount("0x0013e2BE6Df6B6450a92E047b3e19B9Ebb1DdD06", "tuContraseña", 600)
personal.unlockAccount('0x0013e2be6df6b6450a92e047b3e19b9ebb1ddd06', 'dym123', 600)

Consultar el Balance de la Cuenta
eth.getBalance("0x0013e2BE6Df6B6450a92E047b3e19B9Ebb1DdD06")


convertir el balance a Ether

web3.fromWei(eth.getBalance("0x0013e2BE6Df6B6450a92E047b3e19B9Ebb1DdD06"), "ether")

Enviar una Transacción
eth.sendTransaction({from: "0x0013e2BE6Df6B6450a92E047b3e19B9Ebb1DdD06", to: "0xOtraDireccion", value: web3.toWei(1, "ether")})


<!-- recuerda si hay error por falta de gas -->
geth --dev --miner.gaslimit 12500000 --http --http.api personal,eth,web3,net

geth attach http://localhost:8545

personal.unlockAccount('0x0013e2be6df6b6450a92e047b3e19b9ebb1ddd06', 'dym123', 0)
eth.getBlock("latest").gasLimit


Aquí tienes una lista de funciones que podrías considerar agregar a tu contrato inteligente para tu aplicación de citas basada en blockchain. Estas funciones pueden mejorar la funcionalidad, la seguridad, y la experiencia de usuario:

### 1. **Función de Registro de Usuarios**
   - **Descripción**: Permite que los usuarios se registren en la aplicación, almacenando su información básica como nombre, dirección de Ethereum, y otros detalles relevantes.
   - **Ejemplo**: `function registerUser(string memory _username, string memory _profileInfo) public`

### 2. **Función de Actualización de Perfil**
   - **Descripción**: Permite que los usuarios actualicen su información de perfil, como descripciones, intereses, y otros detalles que quieran compartir.
   - **Ejemplo**: `function updateProfile(string memory _newProfileInfo) public`

### 3. **Función de Búsqueda de Usuarios**
   - **Descripción**: Permite que los usuarios busquen a otros usuarios en la plataforma con filtros como nombre, ubicación, intereses, etc.
   - **Ejemplo**: `function searchUsers(string memory _criteria) public view returns (User[] memory)`

### 4. **Función de Envío de Mensajes**
   - **Descripción**: Permite que los usuarios envíen mensajes entre ellos. Los mensajes pueden ser almacenados en la blockchain o referenciados a través de un sistema de almacenamiento externo.
   - **Ejemplo**: `function sendMessage(address _recipient, string memory _message) public`

### 5. **Función de Coincidencias (Matching)**
   - **Descripción**: Implementa una lógica de coincidencia basada en los intereses y preferencias de los usuarios, sugiriendo posibles coincidencias.
   - **Ejemplo**: `function findMatches(address _userAddress) public view returns (User[] memory)`

### 6. **Función de Gestión de Preferencias**
   - **Descripción**: Permite que los usuarios definan y actualicen sus preferencias de citas, como edad, ubicación, intereses, etc.
   - **Ejemplo**: `function setPreferences(string memory _preferences) public`

### 7. **Función de Reportar Usuarios**
   - **Descripción**: Permite que los usuarios reporten a otros usuarios por comportamiento inapropiado. Las denuncias pueden ser revisadas por un moderador o manejadas automáticamente.
   - **Ejemplo**: `function reportUser(address _userAddress, string memory _reason) public`

### 8. **Función de Bloqueo de Usuarios**
   - **Descripción**: Permite que un usuario bloquee a otro, evitando que se comuniquen o se vean en las coincidencias.
   - **Ejemplo**: `function blockUser(address _userAddress) public`

### 9. **Función de Moderación de Contenido**
   - **Descripción**: Permite que los moderadores revisen y eliminen contenido inapropiado publicado por los usuarios.
   - **Ejemplo**: `function moderateContent(uint256 _contentId) public onlyModerator`

### 10. **Función de Pago de Suscripciones**
   - **Descripción**: Implementa un sistema de suscripciones basado en tokens o pagos directos, donde los usuarios pueden pagar para acceder a funciones premium.
   - **Ejemplo**: `function subscribe(uint256 _amount) public payable`

### 11. **Función de Recompensas o Incentivos**
   - **Descripción**: Proporciona recompensas en forma de tokens a los usuarios que cumplan ciertas actividades, como registrarse, completar su perfil, etc.
   - **Ejemplo**: `function rewardUser(address _userAddress, uint256 _amount) public`

### 12. **Función de Revisión y Calificación de Usuarios**
   - **Descripción**: Permite que los usuarios dejen calificaciones o comentarios sobre sus interacciones con otros usuarios, mejorando la transparencia y confiabilidad de la plataforma.
   - **Ejemplo**: `function rateUser(address _userAddress, uint8 _rating) public`

Estas funciones cubrirían aspectos clave de una aplicación de citas, desde la gestión de usuarios y la interacción, hasta la moderación y la monetización. Implementarlas te permitirá crear una plataforma más completa y segura, que ofrezca una buena experiencia de usuario.





// SPDX-License-Identifier: PRIVATE
pragma solidity ^0.8.4;

import "./ServiceAgreement.sol"; // Importar el contrato ServiceAgreement

contract ServiceManager {
    mapping(address => ServicesProvider) private serviceProviders;
    address[] private serviceProviderIndex;

    mapping(address => address[]) private clientAgreements; // Para almacenar acuerdos de servicio por cliente
    mapping(address => address[]) private providerAgreements;

    address public platformAddress; // Dirección de la plataforma

    enum ServiceCategory {
        Health,
        Development,
        Consultancy,
        Marketing,
        IAConsultancy
    }

    modifier validProviderOnly(address _provider) {
        require(serviceProviderIndex.length != 0, "No service providers");
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

    event RegisterServiceProvider(address indexed owner);
    event NewAgreement(
        address indexed client,
        address indexed provider,
        address agreementAddress
    );
    event ErrorNotice(string message);
    event ErrorNoticeBytes(bytes data);

    constructor(address _platformAddress) {
        platformAddress = _platformAddress; // Establecer la dirección de la plataforma en el constructor
    }

    function createNewServiceProvider(
        string memory _companyName,
        string memory _email,
        string memory _phone,
        uint256 _serviceAmount,
        ServiceCategory _serviceCategory
    ) external {
        require(
            serviceProviders[msg.sender].owner == address(0),
            "Service provider already exists"
        );

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
            validServiceProviders[i] = serviceProviders[currentAddress];
        }

        return validServiceProviders;
    }

    function createServiceAgreement(
        address _provider
    ) external validProviderOnly(_provider) {
        require(
            _provider != msg.sender,
            "providers cannot create service agreement with themselves"
        );

        uint256 amount = serviceProviders[_provider].serviceAmount;
        require(msg.sender.balance >= amount, "no tiene fondos suficientes");

        try new ServiceAgreement(msg.sender, _provider, amount, platformAddress) returns (
            ServiceAgreement serviceAgreement
        ) {
            address agreementAddress = address(serviceAgreement);

            clientAgreements[msg.sender].push(agreementAddress);
            providerAgreements[_provider].push(agreementAddress);

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



// SPDX-License-Identifier: PRIVATE
pragma solidity ^0.8.1;

/**
 * @title ServiceAgreement
 * Implements Service Agreement between two parties
 */
contract ServiceAgreement {
    address public client;
    address public provider;
    uint256 public termsAmount;
    address public platform; // Dirección de la plataforma
    uint256 public platformCommissionRate = 2; // 2% de comisión para la plataforma
    WorkStatus public agreementStatus;
    ClientApprovalStatus public clientApprovalStatus;
    Rating public clientRating;
    bool private agreementFulfilledOrNullified;

    constructor(address _client, address _provider, uint256 _termsAmount, address _platform) {
        client = _client;
        provider = _provider;
        termsAmount = _termsAmount;
        platform = _platform; // Establecer la dirección de la plataforma
        agreementStatus = WorkStatus.NotStarted;
        clientApprovalStatus = ClientApprovalStatus.WaitingForApproval;
        clientRating = Rating.UnRated;
        agreementFulfilledOrNullified = false;
    }

    modifier providerOnly() {
        require(
            msg.sender == provider,
            "Only the service provider can call this."
        );
        _;
    }

    modifier clientOnly() {
        require(msg.sender == client, "Only the client can call this.");
        _;
    }

    enum WorkStatus {
        NotStarted,
        Started,
        Completed,
        WillNotComplete
    }

    enum ClientApprovalStatus {
        WaitingForApproval,
        Approved,
        Unapproved
    }

    enum Rating {
        UnRated,
        OneStar,
        TwoStar,
        ThreeStar,
        FourStar,
        FiveStar
    }

    event ServiceStatusUpdate(
        address indexed agreementAddress,
        WorkStatus agreementStatus
    );

    event AgreementFulfilled(
        address indexed agreementAddress,
        Rating clientRating,
        ClientApprovalStatus clientApprovalStatus,
        WorkStatus agreementStatus
    );

    function updateServiceStatus(WorkStatus _status) external providerOnly {
        agreementStatus = _status;
        emit ServiceStatusUpdate(address(this), agreementStatus);
    }

    function updateClientApprovalStatus(
        ClientApprovalStatus _approve
    ) external clientOnly {
        require(
            agreementStatus == WorkStatus.Completed,
            "The contract must be marked as completed by the service provider"
        );
        clientApprovalStatus = _approve;
    }

    function rateServiceProvider(Rating _rating) external clientOnly {
        clientRating = _rating;
    }

    function deposit() external payable clientOnly {
        require(
            !agreementFulfilledOrNullified,
            "Agreement has already been fulfilled"
        );
    }

    function getAgreementDetails()
        external
        view
        returns (
            address,
            address,
            uint256,
            WorkStatus,
            ClientApprovalStatus,
            Rating,
            bool,
            uint256
        )
    {
        return (
            client,
            provider,
            address(this).balance,
            agreementStatus,
            clientApprovalStatus,
            clientRating,
            agreementFulfilledOrNullified,
            termsAmount
        );
    }

    function transferFundsToProvider() external providerOnly {
        require(
            !agreementFulfilledOrNullified,
            "This agreement has already been fulfilled or nullified"
        );
        require(
            address(this).balance >= termsAmount,
            "Contract balance requirement has not been met"
        );
        require(
            agreementStatus == WorkStatus.Completed &&
                clientApprovalStatus == ClientApprovalStatus.Approved,
            "Service was not completed or approved"
        );

        // Calcular y transferir la comisión a la plataforma
        uint256 commission = payPlatformCommission();
        
        // Transferir el monto restante al proveedor
        uint256 amountAfterCommission = address(this).balance - commission;
        closeOutBalance(provider, amountAfterCommission);
    }

    function payPlatformCommission() private returns (uint256) {
        uint256 commission = (termsAmount * platformCommissionRate) / 100;
        (bool success, ) = payable(platform).call{value: commission}("");
        require(success, "Commission transfer failed");
        return commission;
    }

    function refund() external clientOnly {
        require(
            !agreementFulfilledOrNullified,
            "This agreement has already been fulfilled or nullified"
        );
        require(
            agreementStatus == WorkStatus.WillNotComplete,
            "The agreement has not been marked as Will Not Complete"
        );
        require(address(this).balance > 0, "There are no funds to refund");

        closeOutBalance(client, address(this).balance);
    }

    function closeOutBalance(address _address, uint256 _amount) private {
        agreementFulfilledOrNullified = true;

        emit AgreementFulfilled(
            address(this),
            clientRating,
            clientApprovalStatus,
            agreementStatus
        );

        (bool success, ) = payable(_address).call{value: _amount}("");
        require(success, "Transfer unsuccessful");
    }
}
