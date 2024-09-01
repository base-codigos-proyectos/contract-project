// SPDX-License-Identifier: PRIVATE
pragma solidity ^0.8.1;

/**
 * @title ServiceAgreement
 * Implements Service Agreement between two parties
 */
contract ServiceAgreement {
    address client;
    address provider;
    uint256 termsAmount;
    WorkStatus public agreementStatus;
    ClientApprovalStatus public clientApprovalStatus;
    Rating public clientRating;
    bool private agreementFulfilledOrNullified;

    constructor(address _client, address _provider, uint256 _termsAmount) {
        client = _client;
        provider = _provider;
        termsAmount = _termsAmount;
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
        closeOutBalance(provider, address(this).balance);
    }

    function refund() external clientOnly{
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
