import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import MarketOutcomeChartHeaderOrders from 'modules/market/components/market-outcome-charts--header-orders/market-outcome-charts--header-orders'

import { ASKS, BIDS } from 'modules/order-book/constants/order-book-order-types'
import { BUY, SELL } from 'modules/transactions/constants/types'

import { compose, reverse, sortBy, take } from 'lodash/fp'

import Styles from 'modules/market/components/market-outcome-charts--orders/market-outcome-charts--orders.styles'
import StylesHeader from 'modules/market/components/market-outcome-charts--header/market-outcome-charts--header.styles'

const askLimit = compose(
  take(5),
  sortBy('price.value'),
)

const bidLimit = compose(
  take(5),
  reverse,
  sortBy('price.value'),
)


export default class MarketOutcomeOrderbook extends Component {
  static propTypes = {
    sharedChartMargins: PropTypes.object.isRequired,
    orderBook: PropTypes.object.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    updateHoveredPrice: PropTypes.func.isRequired,
    updateSeletedOrderProperties: PropTypes.func.isRequired,
    updatePrecision: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired,
    headerHeight: PropTypes.number.isRequired,
    selectedOutcome: PropTypes.any,
    hoveredPrice: PropTypes.any,
    marketMidpoint: PropTypes.any,
  }

  constructor(props) {
    super(props)

    this.state = {
      hoveredOrderIndex: null,
      hoveredSide: null,
    }
  }

  render() {
    const {
      fixedPrecision,
      orderBook,
      sharedChartMargins,
      updateHoveredPrice,
      updatePrecision,
      updateSeletedOrderProperties,
      isMobile,
      headerHeight,
    } = this.props
    const s = this.state

    const asks = askLimit((orderBook.asks || []), 5)
    const bids = bidLimit((orderBook.bids || []), 5)

    return (
      <section
        className={Styles.MarketOutcomeOrderBook}
        style={{ paddingBottom: sharedChartMargins.bottom }}
      >
        <MarketOutcomeChartHeaderOrders
          fixedPrecision={fixedPrecision}
          updatePrecision={updatePrecision}
          isMobile={isMobile}
          headerHeight={headerHeight}
        />
        <div
          ref={(asks) => { this.asks = asks }}
          className={classNames(Styles.MarketOutcomeOrderBook__Side, Styles['MarketOutcomeOrderBook__side--asks'])}
        >
          {asks.map((order, i) => (
            <div
              key={order.cumulativeShares}
              className={
                classNames(
                  Styles.MarketOutcomeOrderBook__row,
                  {
                    [Styles['MarketOutcomeOrderBook__row--head']]: i === orderBook.asks.length - 1,
                    [Styles['MarketOutcomeOrderBook__row--hover']]: i === s.hoveredOrderIndex && s.hoveredSide === ASKS,
                    [Styles['MarketOutcomeOrderbook__row--hover-encompassed']]: s.hoveredOrderIndex !== null && s.hoveredSide === ASKS && i > s.hoveredOrderIndex,
                  },
                )
              }
              onMouseEnter={() => {
                updateHoveredPrice(order.price.value)
                this.setState({
                  hoveredOrderIndex: i,
                  hoveredSide: ASKS,
                })
              }}
              onMouseLeave={() => {
                updateHoveredPrice(null)
                this.setState({
                  hoveredOrderIndex: null,
                  hoveredSide: null,
                })
              }}
            >
              <button
                className={Styles.MarketOutcomeOrderBook__RowItem}
                onClick={() => updateSeletedOrderProperties({
                  orderPrice: order.price.value.toString(),
                  orderQuantity: order.cumulativeShares.toString(),
                  selectedNav: BUY,
                })}
              >
                <span>{order.shares.value.toFixed(fixedPrecision).toString()}</span>
              </button>
              <button
                className={Styles.MarketOutcomeOrderBook__RowItem}
                onClick={() => updateSeletedOrderProperties({
                  orderPrice: order.price.value.toString(),
                  selectedNav: BUY,
                })}
              >
                <span>{order.price.value.toFixed(fixedPrecision).toString()}</span>
              </button>
              <button
                className={Styles.MarketOutcomeOrderBook__RowItem}
                onClick={() => updateSeletedOrderProperties({
                  orderPrice: order.price.value.toString(),
                  orderQuantity: order.cumulativeShares.toString(),
                  selectedNav: BUY,
                })}
              >
                <span>{order.cumulativeShares.toFixed(fixedPrecision).toString()}</span>
              </button>
            </div>
          ))}
        </div>
        <div className={Styles.MarketOutcomeOrderBook__Midmarket} />
        <div className={classNames(Styles.MarketOutcomeOrderBook__Side, Styles['MarketOutcomeOrderBook__side--bids'])} >
          {(bids).map((order, i) => (
            <div
              key={order.cumulativeShares}
              className={
                classNames(
                  Styles.MarketOutcomeOrderBook__row,
                  {
                    [Styles['MarketOutcomeOrderBook__row--head']]: i === 0,
                    [Styles['MarketOutcomeOrderBook__row--hover']]: i === s.hoveredOrderIndex && s.hoveredSide === BIDS,
                    [Styles['MarketOutcomeOrderbook__row--hover-encompassed']]: s.hoveredOrderIndex !== null && s.hoveredSide === BIDS && i < s.hoveredOrderIndex,
                  },
                )
              }
              onMouseEnter={() => {
                updateHoveredPrice(order.price.value)
                this.setState({
                  hoveredOrderIndex: i,
                  hoveredSide: BIDS,
                })
              }}
              onMouseLeave={() => {
                updateHoveredPrice(null)
                this.setState({
                  hoveredOrderIndex: null,
                  hoveredSide: null,
                })
              }}
            >
              <button
                className={Styles.MarketOutcomeOrderBook__RowItem}
                onClick={() => updateSeletedOrderProperties({
                  orderPrice: order.price.value.toString(),
                  orderQuantity: order.cumulativeShares.toString(),
                  selectedNav: SELL,
                })}
              >
                <span>{order.shares.value.toFixed(fixedPrecision).toString()}</span>
              </button>
              <button
                className={Styles.MarketOutcomeOrderBook__RowItem}
                onClick={() => updateSeletedOrderProperties({
                  orderPrice: order.price.value.toString(),
                  selectedNav: SELL,
                })}
              >
                <span>{order.price.value.toFixed(fixedPrecision).toString()}</span>
              </button>
              <button
                className={Styles.MarketOutcomeOrderBook__RowItem}
                onClick={() => updateSeletedOrderProperties({
                  orderPrice: order.price.value.toString(),
                  orderQuantity: order.cumulativeShares.toString(),
                  selectedNav: SELL,
                })}
              >
                <span>{order.cumulativeShares.toFixed(fixedPrecision).toString()}</span>
              </button>
            </div>
          ))}
        </div>
        <div className={classNames(StylesHeader.MarketOutcomeChartsHeader__stats, Styles.MarketOutcomeOrderBook__stats)}>
          <div className={StylesHeader['MarketOutcomeChartsHeader__stat--right']}>
            <span className={StylesHeader['MarketOutcomeChartsHeader__stat-title']}>
              bid qty
            </span>
          </div>
          <div className={StylesHeader['MarketOutcomeChartsHeader__stat--right']}>
            <span className={StylesHeader['MarketOutcomeChartsHeader__stat-title']}>
              price
            </span>
          </div>
          <div className={StylesHeader['MarketOutcomeChartsHeader__stat--right']}>
            <span className={StylesHeader['MarketOutcomeChartsHeader__stat-title']}>
              depth
            </span>
          </div>
        </div>
      </section>
    )
  }
}
