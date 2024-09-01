const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Monetization Contract", function () {
  let Monetization;
  let monetization;
  let owner;
  let addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    Monetization = await ethers.getContractFactory("Monetization");
    monetization = await Monetization.deploy(2); // 2% comisión
    await monetization.deployed();
  });

  it("Should set the correct commission rate", async function () {
    expect(await monetization.commissionRate()).to.equal(2);
  });

  it("Should process payment and transfer commission correctly", async function () {
    // Asegúrate de que addr1 tenga fondos suficientes
    await ethers.provider.send("hardhat_setBalance", [
      addr1.address,
      ethers.utils.parseEther("10").toHexString(),
    ]);

    // Verificar el saldo del owner antes del pago
    const initialBalance = await ethers.provider.getBalance(owner.address);

    // Procesar el pago
    const tx = await monetization.connect(addr1).processPayment(owner.address, {
      value: ethers.utils.parseEther("5"),
    });
    await tx.wait();

    // Verificar el saldo del owner después del pago
    const newBalance = await ethers.provider.getBalance(owner.address);
    const commission = ethers.utils.parseEther("5").mul(2).div(100); // 2% comisión
    const expectedBalance = initialBalance.add(commission);

    // Usar closeTo para evitar errores por pequeñas discrepancias debido a gas
    expect(newBalance).to.be.closeTo(expectedBalance, ethers.utils.parseEther("0.001")); // Tolerancia para el costo del gas
  });

  it("Should allow the owner to set a new commission rate", async function () {
    await monetization.setCommissionRate(5); // Cambiar la comisión a 5%
    expect(await monetization.commissionRate()).to.equal(5);
  });
});
