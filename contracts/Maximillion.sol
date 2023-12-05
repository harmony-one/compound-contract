// SPDX-License-Identifier: BSD-3-Clause
pragma solidity ^0.8.10;

import "./CONE.sol";

/**
 * @title Compound's Maximillion Contract
 * @author Compound
 */
contract Maximillion {
    /**
     * @notice The default cONE market to repay in
     */
    CONE public cONE;

    /**
     * @notice Construct a Maximillion to repay max in a CONE market
     */
    constructor(CONE cONE_) public {
        cONE = cONE_;
    }

    /**
     * @notice msg.sender sends ONE to repay an account's borrow in the cONE market
     * @dev The provided ONE is applied towards the borrow balance, any excess is refunded
     * @param borrower The address of the borrower account to repay on behalf of
     */
    function repayBehalf(address borrower) public payable {
        repayBehalfExplicit(borrower, cONE);
    }

    /**
     * @notice msg.sender sends ONE to repay an account's borrow in a cONE market
     * @dev The provided ONE is applied towards the borrow balance, any excess is refunded
     * @param borrower The address of the borrower account to repay on behalf of
     * @param cONE_ The address of the cONE contract to repay in
     */
    function repayBehalfExplicit(address borrower, CONE cONE_) public payable {
        uint received = msg.value;
        uint borrows = cONE_.borrowBalanceCurrent(borrower);
        if (received > borrows) {
            cONE_.repayBorrowBehalf{value: borrows}(borrower);
            payable(msg.sender).transfer(received - borrows);
        } else {
            cONE_.repayBorrowBehalf{value: received}(borrower);
        }
    }
}
