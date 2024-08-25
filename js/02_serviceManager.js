import { ethers } from "ethers"; // Importa la biblioteca ethers para interactuar con la blockchain de Ethereum
import fs from "fs"; // Importa el módulo del sistema de archivos para leer y escribir archivos

(async function () {
  try {
    // Leer el ABI del contrato desde un archivo JSON
    const contractAbi = JSON.parse(
      fs.readFileSync("../contracts.json", "utf8")
    ).abi;

    // Leer la dirección del contrato desde un archivo JSON
    const address = JSON.parse(
      fs.readFileSync("../sm-address.json", "utf8")
    ).address;

    // Validar que el ABI y la dirección no estén vacíos
    if (!contractAbi || !Array.isArray(contractAbi)) {
      throw new Error("ABI del contrato no es válido o no se ha encontrado.");
    }
    if (!ethers.utils.isAddress(address)) {
      throw new Error("La dirección del contrato no es válida.");
    }

    // Crear un proveedor para conectarse a la red Ethereum
    const provider = new ethers.providers.JsonRpcProvider(
      "http://localhost:8545"
    );
    const network = await provider.getNetwork();
    console.log(`Conectado a la red: ${network.name}`);

    // Obtener el signer desde el proveedor (el primer cuenta del nodo local)
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    console.log(`Usando signer con la dirección: ${signerAddress}`);

    // Crear instancias del contrato para lectura y escritura
    const contractReader = new ethers.Contract(address, contractAbi, provider);
    const contractWrite = new ethers.Contract(address, contractAbi, signer);

    console.log(
      "Funciones disponibles en el contrato:",
      Object.keys(contractReader.functions)
    );

    // Agregar un nuevo proveedor de servicios
    await createServiceProvider(contractWrite, "Sara");

    // Llamar a la función de lectura del contrato para verificar los proveedores agregados
    await getServiceProviders(contractReader);


  } catch (error) {
    console.error("Error inicializando el contrato:", error.message);
  }

  // Función para crear un proveedor de servicio
  async function createServiceProvider(contractWrite, companyName) {
    try {
      const tx = await contractWrite.createNewServiceProvider(companyName, {
        gasLimit: 1003840,
        gasPrice: 1000000000,
      });
      console.log("Transacción enviada, esperando confirmación...", tx.hash);
      const receipt = await tx.wait(); // Espera la confirmación de la transacción
      console.log('receipt.status',receipt.status);
      console.log("Proveedor de servicio creado:", companyName);
    } catch (error) {
      console.error("Error al crear proveedor de servicio:", error);
    }
  }

  // Función para obtener la lista de proveedores de servicios
  async function getServiceProviders(contractReader) {
    try {
      if (typeof contractReader.getServiceProviders !== "function") {
        throw new Error(
          "La función getServiceProviders no existe en el contrato."
        );
      }
      const providers = await contractReader.getServiceProviders();
      console.log("Proveedores de servicios:", providers);
    } catch (error) {
      console.error("Error al obtener proveedores de servicios:", error);
    }
  }
})();
