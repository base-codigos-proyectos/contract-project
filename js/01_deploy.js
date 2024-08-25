import solc from 'solc'; // Importa el compilador de Solidity para compilar contratos
import fs from 'fs'; // Importa el módulo del sistema de archivos para leer y escribir archivos
import { ethers } from 'ethers'; // Importa la biblioteca ethers para interactuar con la blockchain de Ethereum

(async function () {
    // Función autoinvocada para gestionar la compilación y despliegue del contrato

    const contractComponents = compileContract();
    // Llama a la función para compilar el contrato y guarda el resultado en `contractComponents`

    if (contractComponents) {
        // Si la compilación fue exitosa (no es null), despliega el contrato
        await deployContract(contractComponents.abi, contractComponents.evm.bytecode.object);
        // Llama a la función para desplegar el contrato con el ABI y bytecode obtenidos
    }

    // Función para compilar el contrato
    function compileContract() {
        console.log("Compilando el contrato...");

        const input = {
            language: "Solidity",
            sources: {
                "ServiceManager.sol": {
                    content: fs.readFileSync("./contracts/ServiceManager.sol", "utf8")
                    // Lee el contenido del archivo de contrato Solidity para compilar
                }
            },
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200 // Configura el optimizador para mejorar la eficiencia del contrato
                },
                outputSelection: {
                    "*": {
                        "*": ["*"] // Selecciona todos los outputs posibles (ABI, bytecode, etc.)
                    }
                }
            }
        };

        // Compilación del contrato usando solc
        const compiled = solc.compile(JSON.stringify(input)); // Compila el contrato y devuelve un JSON stringificado
        const output = JSON.parse(compiled); // Parse el JSON compilado para obtener un objeto JavaScript

        // Verificar si el contrato existe en el output
        const contractName = "ServiceManager"; // Nombre del contrato a buscar en la salida compilada
        const contractOutput = output.contracts["ServiceManager.sol"][contractName]; 
        // Obtiene la salida del contrato especificado

        if (!contractOutput) {
            console.error(`Error: No se encontró el contrato ${contractName} en el output.`);
            // Si no se encuentra el contrato, muestra un error y retorna null
            return null;
        }

        // Guardar el ABI (Application Binary Interface) y el bytecode en un archivo JSON
        fs.writeFileSync("contracts.json", JSON.stringify(contractOutput, null, 2), "utf8");
        // Escribe el ABI y bytecode del contrato en un archivo JSON para referencia futura

        console.log("Contrato compilado y guardado en 'contracts.json'."); // Mensaje de éxito tras la compilación

        return contractOutput; // Retorna los componentes del contrato (ABI y Bytecode) para su uso posterior
    }

    // Función asíncrona para desplegar el contrato
    async function deployContract(abi, bytecode) {
        const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
        // Crea un proveedor de JSON-RPC apuntando a un nodo local de Ethereum
        const signer = provider.getSigner(); // Obtiene el firmante (cuenta para desplegar el contrato)

        console.log('Obteniendo gas limit y gas price...');
        const blockGasLimit = await provider.getBlock("latest").then(block => block.gasLimit);
        // Obtiene el límite de gas del último bloque minado

        console.log('Límite de gas del bloque actual:', blockGasLimit.toString());

        const gasPrice = await provider.getGasPrice();
        // Obtiene el precio actual del gas desde el proveedor
        console.log('Precio del gas:', gasPrice.toString());

        // Asegúrate de que el gasLimit sea seguro y positivo
        let gasLimit = ethers.BigNumber.from("7000000"); // Valor predeterminado para gas limit

        if (blockGasLimit.gt(gasLimit)) {
            gasLimit = blockGasLimit.sub(100000); // Ajusta el gas limit asegurando un margen de seguridad
        }

        console.log('Usando gasLimit:', gasLimit.toString());

        const factory = new ethers.ContractFactory(abi, bytecode, signer);
        // Crea una instancia de ContractFactory con el ABI, bytecode y firmante

        let contract = null;
        try {
            // Intenta desplegar el contrato con un límite y precio de gas especificados
            contract = await factory.deploy({
                gasLimit: gasLimit, // Límite de gas calculado para el despliegue
                gasPrice: gasPrice // Precio de gas obtenido
            });

            console.log('Contrato desplegado, dirección:', contract.address); 
            // Muestra la dirección del contrato desplegado

            // Guarda la dirección del contrato desplegado en un archivo JSON
            fs.writeFileSync(
                "sm-address.json",
                JSON.stringify({ address: contract.address })
            );

        } catch (error) {
            console.error('Error al desplegar el contrato:', error); 
            // Maneja y muestra errores que ocurran durante el despliegue
            return;
        }

        try {
            console.log('Esperando confirmación de transacción...');
            const receipt = await contract.deployTransaction.wait(); 
            // Espera a la confirmación de la transacción de despliegue
            console.log('Transacción confirmada:', receipt);

            // Guarda los detalles de la transacción de despliegue en un archivo JSON
            fs.writeFileSync("sm-trans.json", JSON.stringify(contract.deployTransaction));
        } catch (error) {
            console.error('Error en la transacción:', error); 
            // Maneja y muestra errores que ocurran durante la confirmación de la transacción
        }
    }

})();
