"use strict";

const { serviceProvider1, serviceProvider2 } = require("./testAccount");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Service Providers", () => {
    let ServiceManager, instance, owner, provider, client, nonServiceAgreementAccount, tx;
    
    beforeAll(async () => {
        // Obtén la fábrica de contratos para el contrato "ServiceManager"
        ServiceManager = await ethers.getContractFactory("ServiceManager");
    });

    beforeEach(async () => {
        // Obtén los signers disponibles
        [owner, provider, client] = await ethers.getSigners();

        // Despliega una nueva instancia del contrato
        instance = await ServiceManager.deploy();
        await instance.deployed();
    });

    it("should allow for storing and retrieving a new service provider", async () => {
        // Llama a la función para crear un nuevo proveedor de servicios
        const sptx = await instance
            .connect(provider)
            .createNewServiceProvider(
                serviceProvider1.companyName,
                serviceProvider1.email,
                serviceProvider1.phone,
                serviceProvider1.serviceAmount,
                serviceProvider1.serviceCategory
            );

        // Espera la confirmación de la transacción
        const receipt = await sptx.wait();

        // Asegúrate de que la transacción fue exitosa
        expect(receipt.status).to.equal(1);
    });
});
