// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "../PriceOracle.sol";

/// @notice Interface of a Band Oracle contract for base/quote price fetching
interface IStdReference {
    struct ReferenceData {
        /// base/quote exchange rate scaled by 1e18
        uint256 rate;
        /// timestamp of the last time base price was updated
        uint256 lastUpdatedBase;
        /// timestamp of the last time quote price was updated
        uint256 lastUpdatedQuote;
    }

    /// @notice The default quote used for compound is USD
    function getReferenceData(string memory _base, string memory _quote) external view returns (ReferenceData memory);
}

/// @notice Band Price Oracle Contract returns USD value of cToken's underlying asset
contract BandPriceOracle is PriceOracle {
    error ArraySizeMismatch();
    error PriceZero();
    error OracleDataOutdated();

    /// @notice cToken mapping to the Band Oracle supported tickers (e.g. c1ETH -> ETH)
    mapping(CToken => string) public cTokenSymbols;

    /// @notice cToken mapping to underlying asset lowest denominations
    mapping(CToken => uint256) public baseUnits;

    /// @notice Band Oracle reference contract
    IStdReference public ref;

    /// @notice The maximum allowed period since the latest updated data
    uint256 public constant ORACLE_STALENESS_THRESHOLD = 2 hours;

    /// @notice The decimals of the retrieved price of the oracle
    uint256 public constant ORACLE_DECIMALS = 18;

    /// @notice The default quote used for compound is USD
    string public constant QUOTE = "USD";

    /// @notice Construct a cToken configuration
    /// @dev cTokens, _symbols and _baseUnits have to be passed in array in the exact sequence for each param.
    /// @param _ref Contract of the Band Oracle price feed
    /// @param _cTokens Compound cToken address array
    /// @param _symbols CToken's underlying asset symbol array that is supported by Band
    /// @param _baseUnits Smallest denomination array for underlying tokens (e.g. 1000000 for USDC)
    constructor(IStdReference _ref, CToken[] memory _cTokens, string[] memory _symbols, uint256[] memory _baseUnits) {
        if (_cTokens.length != _symbols.length && _cTokens.length != _baseUnits.length) {
            revert ArraySizeMismatch();
        }

        ref = _ref;

        for (uint256 i = 0; i < _cTokens.length; i++) {
            cTokenSymbols[_cTokens[i]] = _symbols[i];
            baseUnits[_cTokens[i]] = _baseUnits[i];
        }
    }

    /// @notice Get the price of a provided asset from the Band Oracle
    /// @dev Function retrieves price from the Band Oracle in a USD format (QUOTE = "USD")
    /// @param _base The symbol of an asset supported by Band
    /// @return Price scaled 1e18
    function _retrievePrice(string memory _base) internal view returns (IStdReference.ReferenceData memory) {
        IStdReference.ReferenceData memory data = ref.getReferenceData(_base, QUOTE);

        /// Revert if oracle data is not reliable (zero or outdated)
        if (data.rate == 0) revert PriceZero();

        if (
            block.timestamp - data.lastUpdatedQuote < ORACLE_STALENESS_THRESHOLD &&
            block.timestamp - data.lastUpdatedBase < ORACLE_STALENESS_THRESHOLD
        ) {
            revert OracleDataOutdated();
        }
        return data;
    }

    /// @notice Get the price of an underlying cToken asset in expected format by Comptroller
    /// @dev Comptroller expects this format: unscaledPrice * 1e36 / base_units
    /// @param cToken The cToken market address
    /// @return Underlying asset's price scaled by the expected format
    function getUnderlyingPrice(CToken cToken) external view override returns (uint256) {
        IStdReference.ReferenceData memory data = _retrievePrice(cTokenSymbols[cToken]);
        /// expected result format is of a raw (unscaled) price * 1e36 / base_units
        /// however, Band Oracle returns price scaled by 1e18
        /// therefore subtracting oracle decimals to fit the expected format
        return (data.rate * (10 ** (36 - ORACLE_DECIMALS))) / baseUnits[cToken];
    }
}
