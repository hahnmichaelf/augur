import {
	formatEther,
	formatPercent,
	formatShares
} from '../../../../utils/format-number';

import {
	BINARY,
	CATEGORICAL,
	SCALAR
} from '../../../markets/constants/market-types';

import {
	TRADING_FEE_DEFAULT,
	TRADING_FEE_MIN,
	TRADING_FEE_MAX,
	INITIAL_LIQUIDITY_DEFAULT,
	INITIAL_LIQUIDITY_MIN,
	MAKER_FEE_DEFAULT,
	MAKER_FEE_MIN,
	MAKER_FEE_MAX,
	INITIAL_FAIR_PRICE_DEFAULT,
	STARTING_QUANTITY_DEFAULT,
	STARTING_QUANTITY_MIN,
	SIZE_OF_BEST_DEFAULT,
	PRICE_WIDTH_DEFAULT,
	PRICE_DEPTH_DEFAULT
} from '../../../create-market/constants/market-values-constraints';

export const select = (formState) => {
	const obj = {
		tradingFeePercent: formState.tradingFeePercent || TRADING_FEE_DEFAULT,
		makerFeePercent: formState.makerFeePercent || MAKER_FEE_DEFAULT,
		initialLiquidity: formState.initialLiquidity || INITIAL_LIQUIDITY_DEFAULT,
		initialFairPrices: !!formState.initialFairPrices.values ? formState.initialFairPrices : { ...formState.initialFairPrices, ...initialFairPrices(formState) },
		startingQuantity: formState.startingQuantity || STARTING_QUANTITY_DEFAULT,
		sizeOfBest: formState.sizeOfBest || SIZE_OF_BEST_DEFAULT,
		priceWidth: formState.priceWidth || PRICE_WIDTH_DEFAULT,
		priceDepth: formState.priceDepth || PRICE_DEPTH_DEFAULT
	};
	return obj;
};

export const initialFairPrices = (formState) => {
	const setInitialFairPrices = (labels) => {
		let values = [];

		labels.map((cV, i) => {
			values[i] = {
				label: cV,
				value: INITIAL_FAIR_PRICE_DEFAULT
			}
		})

		return { values }
	};

	switch(formState.type){
		case BINARY:
			return setInitialFairPrices(['Yes', 'No']);
		case SCALAR:
			return setInitialFairPrices(['⇧', '⇩']);
		case CATEGORICAL:
			let labels = [];

			formState.categoricalOutcomes.map((val, i) => {
				labels[i] = val;
			});

			return setInitialFairPrices(labels);

		default:
			break;
	}
};

// Validators
export const validateTradingFee = (tradingFeePercent) => {
	const parsed = parseFloat(tradingFeePercent);
	if (!tradingFeePercent) {
		return 'Please specify a trading fee %';
	}
	if (parsed !== tradingFeePercent) {
		return 'Trading fee must be a number';
	}
	if (parsed < TRADING_FEE_MIN || parsed > TRADING_FEE_MAX) {
		return `Trading fee must be between ${
		formatPercent(
			TRADING_FEE_MIN,
			true).full
		} and ${formatPercent(TRADING_FEE_MAX, true).full}`;
	}
};

export const validateMakerFee = (makerFeePercent) => {
	const parsed = parseFloat(makerFeePercent);

	if(!makerFeePercent)
		return 'Please specify a maker fee %';
	if(parsed !== makerFeePercent)
		return 'Maker fee must be as number';
	if(parsed < MAKER_FEE_MIN || parsed > MAKER_FEE_MAX)
		return `Maker fee must be between 
			${formatPercent(MAKER_FEE_MIN, true).full
			} and ${
			formatPercent(MAKER_FEE_MAX, true).full}`
};

export const validateMarketInvestment = (initialLiquidity) => {
	const parsed = parseFloat(initialLiquidity);
	if (!initialLiquidity) {
		return 'Please provide some initial liquidity';
	}
	if (parsed !== initialLiquidity) {
		return 'Initial liquidity must be numeric';
	}
	if (parsed < INITIAL_LIQUIDITY_MIN) {
		return `Initial liquidity must be at least ${
			formatEther(INITIAL_LIQUIDITY_MIN).full
		}`;
	}
};

export const validateStartingQuantity = (startingQuanity) => {
	const parsed = parseFloat(startingQuanity)
	if(!startingQuanity)
		return 'Please provide a starting quantity';
	if(parsed !== startingQuanity)
		return 'Starting quantity must be numeric';
	if(parsed < STARTING_QUANTITY_MIN)
		return `Starting quantity must be at least ${formatShares(STARTING_QUANTITY_MIN).full}`;
}

export const isValid = (formState) => {
	if(	validateTradingFee(formState.tradingFeePercent) 		||
		validateMakerFee(formState.makerFeePercent) 			||
		validateMarketInvestment(formState.initialLiquidity)	||
		validateStartingQuantity(formState.startingQuantity))
		return false;

	return true;
};

export const errors = (formState) => {
	const errs = {};

	if (formState.tradingFeePercent !== undefined) {
		errs.tradingFeePercent = validateTradingFee(formState.tradingFeePercent);
	}

	if (formState.initialLiquidity !== undefined) {
		errs.initialLiquidity =
		validateMarketInvestment(formState.initialLiquidity);
	}

	return errs;
};
