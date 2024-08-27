"use strict";

const { serviceProvider1, serviceProvider2 } = require("./testAccount");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Service Providers", () => {
  let ServiceManager,
    instance,
    owner,
    provider,
    client,
    nonServiceAgreementAccount,
    tx;

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

  describe("Service Providers", () => {
    //
    it("should allow for success transation registering a service provoder", async () => {
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

    it("emits an event including provider address on creation of a new service provider", async () => {
      await expect(
        instance
          .connect(provider)
          .createNewServiceProvider(
            serviceProvider1.companyName,
            serviceProvider1.email,
            serviceProvider1.phone,
            serviceProvider1.serviceAmount,
            serviceProvider1.serviceCategory
          )
      )
        .to.emit(instance, "RegisterServiceProvider") // Asegúrate de usar "RegisterServiceProvider" aquí
        .withArgs(provider.address);
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
    it("should allow for retrieving multiple service providers", async () => {
      await instance
        .connect(provider)
        .createNewServiceProvider(
          serviceProvider1.companyName,
          serviceProvider1.email,
          serviceProvider1.phone,
          serviceProvider1.serviceAmount,
          serviceProvider1.serviceCategory
        );
      await instance
        .connect(client) // Cambiar a 'client' para usar una dirección diferente
        .createNewServiceProvider(
          serviceProvider2.companyName,
          serviceProvider2.email,
          serviceProvider2.phone,
          serviceProvider2.serviceAmount,
          serviceProvider2.serviceCategory
        );

      const value = await instance.getAllServiceProviders();

      expect(value.length).to.equal(2);
    });

    it("Get Service Providers will return empty array if there are no service providers", async () => {
      const value = await instance.getAllServiceProviders();

      expect(value.length).to.equal(0);
    });

    it("should keep integrity of the providers index", async () => {
      await instance
        .connect(provider)
        .createNewServiceProvider(
          serviceProvider1.companyName,
          serviceProvider1.email,
          serviceProvider1.phone,
          serviceProvider1.serviceAmount,
          serviceProvider1.serviceCategory
        );
      await instance
        .connect(client)
        .createNewServiceProvider(
          serviceProvider2.companyName,
          serviceProvider2.email,
          serviceProvider2.phone,
          serviceProvider2.serviceAmount,
          serviceProvider2.serviceCategory
        );

      const [, , , , , , index2] = await instance.getServiceProvider(
        provider.address
      );
      expect(index2).to.be.equal(0);

      const [, , , , , , index3] = await instance.getServiceProvider(
        client.address
      );
      expect(index3).to.be.equal(1);
    });

    it("emits an event including provider address on creation of a new service provider", async () => {});
  });
  describe("Service Provider Errors", () => {
    it("should return error when there are no service providers", async () => {
      await expect(
        instance.connect(provider).getServiceProvider(client.address)
      ).to.be.revertedWith("No service providers");
    });

    it("should return error when a service provider address doesn't exist", async () => {
      await instance
        .connect(provider)
        .createNewServiceProvider(
          serviceProvider1.companyName,
          serviceProvider1.email,
          serviceProvider1.phone,
          serviceProvider1.serviceAmount,
          serviceProvider1.serviceCategory
        );

      await expect(
        instance.getServiceProvider(client.address)
      ).to.be.revertedWith("Service provider does not exist");
    });
  });

  describe("Service Agreements", () => {
    let retrieved;

    beforeEach(async () => {
      await instance
        .connect(provider)
        .createNewServiceProvider(
          serviceProvider1.companyName,
          serviceProvider1.email,
          serviceProvider1.phone,
          serviceProvider1.serviceAmount,
          serviceProvider1.serviceCategory
        );

      [retrieved] = await instance
        .connect(client)
        .getServiceProvider(provider.address);
    });

    it("should have a valid service provider after setup", async () => {
      retrieved = await instance
        .connect(provider)
        .getServiceProvider(provider.address);

      expect(retrieved.companyName).to.equal(serviceProvider1.companyName);
      expect(retrieved.email).to.equal(serviceProvider1.email);
    });

    it("should create a new ServiceAgreement between Provider and client", async () => {
      await instance.connect(client).createServiceAgreement(retrieved);

      const clientAgreements = await instance.getClientServiceAgreements(
        client.address
      );
      const providerAgreements = await instance.getProviderServiceAgreements(
        provider.address
      );

      expect(clientAgreements.length).to.be.equal(1);
      expect(providerAgreements.length).to.be.equal(1);
    });
    
  });
  describe("ServiceManager Service Agreement Errors", () => {
    let retrieved, amount, tx;

    beforeEach(async () => {
        await instance
            .connect(provider)
            .createNewServiceProvider(
                serviceProvider1.companyName,
                serviceProvider1.email,
                serviceProvider1.phone,
                ethers.utils.parseUnits("20000", "ether"),
                serviceProvider1.serviceCategory
            );

        [retrieved, , , , , amount] = await instance
            .connect(provider)
            .getServiceProvider(provider.address);
    });

    it("should not allow providers to create agreements with themselves", async () => {
        await expect(
            instance.connect(provider).createServiceAgreement(provider.address)
        ).to.be.revertedWith("providers cannot create service agreemt with theserves");
    });

    it("should not allow agreement for less than the specified service amount", async () => {
        try {
            await instance
                .connect(client) // Cliente sin suficientes fondos
                .createServiceAgreement(retrieved);
            expect.fail("Expected error not thrown");
        } catch (err) {
            expect(err.message).to.include("no tiene fondos sufucientes"); // Mensaje ajustado en español
        }
    });

});



});
