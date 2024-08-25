
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
// Indica la licencia bajo la cual se distribuye el contrato. En este caso, es una licencia privada.

pragma solidity ^0.8.4;
// Especifica la versión del compilador de Solidity que debe usarse. Aquí se está utilizando la versión 0.8.4.

contract ServiceManager {
    // Define un contrato llamado ServiceManager.
    struct ServicesProvider {
         string  companyName;
        string  email;
        string  phone;
        uint256 serviveAmount;
    }
    // string[] serviceProviders;
    // Declara un array dinámico de cadenas de texto llamado `serviceProviders` para almacenar los nombres de los proveedores de servicios.

    function createNewServiceProvider(
        string memory _companyName,
        string memory _email,
        string memory _phone,
        uint256 _serviveAmount
        ) external {
        // Función pública (externa) que permite agregar un nuevo proveedor de servicios al array.
        // `_companyName` es el nombre de la compañía que se agrega a la lista.

        // serviceProviders.push(_companyName);
        // Añade el nombre de la compañía proporcionada a la lista de `serviceProviders`.
    }

    function getServiceProviders() external view returns (string[] memory) {
        // Función pública (externa) y de solo lectura (view) que devuelve la lista de proveedores de servicios.
        // La función retorna un array de cadenas de texto que contiene los nombres de los proveedores de servicios.

        return serviceProviders;
        // Devuelve el array `serviceProviders`.
    }
}


// SPDX-License-Identifier: PRIVATE
// Indica la licencia bajo la cual se distribuye el contrato. En este caso, es una licencia privada.

pragma solidity ^0.8.4;
// Especifica la versión del compilador de Solidity que debe usarse. Aquí se está utilizando la versión 0.8.4.

contract ServiceManager {
    // Define un contrato llamado ServiceManager.
    struct ServicesProvider {
        string companyName;
        string email;
        string phone;
        uint256 serviveAmount;
    }
    // string[] serviceProviders;
    // Declara un array dinámico de cadenas de texto llamado `serviceProviders` para almacenar los nombres de los proveedores de servicios.

    function createNewServiceProvider(
        string memory _companyName,
        string memory _email,
        string memory _phone,
        uint256 _serviveAmount
    ) external {
        // Función pública (externa) que permite agregar un nuevo proveedor de servicios al array.
        // `_companyName` es el nombre de la compañía que se agrega a la lista.
        // serviceProviders.push(_companyName);
        // Añade el nombre de la compañía proporcionada a la lista de `serviceProviders`.
    }

    function getServiceProviders() external view returns (string[] memory) {
        // Función pública (externa) y de solo lectura (view) que devuelve la lista de proveedores de servicios.
        // La función retorna un array de cadenas de texto que contiene los nombres de los proveedores de servicios.

        return serviceProviders;
        // Devuelve el array `serviceProviders`.
    }
}
