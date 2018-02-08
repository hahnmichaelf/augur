import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { formatDate } from 'utils/format-date'

import Styles from 'modules/reporting/components/reporting-header/reporting-header.styles'

export default class ReportingHeader extends Component {
  static propTypes = {
    heading: PropTypes.string.isRequired,
    showReportingEndDate: PropTypes.bool.isRequired,
    loadReportingWindowBounds: PropTypes.func.isRequired,
    reportingWindowStats: PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.props.loadReportingWindowBounds()
  }

  render() {
    const p = this.props

    const daysLeft = (p.reportingWindowStats.endTime - (new Date().getTime() / 1000)) / 86400

    const endDate = new Date(p.reportingWindowStats.endTime * 1000)
    const formattedDate = formatDate(endDate)

    const currentPeriodStyle = {
      width: `${((27 - daysLeft) / 27) * 100}%`
    }

    return (
      <article className={Styles.ReportingHeader}>
        <div className={Styles.ReportingHeader__header}>
          <div>
            { p.heading === 'Reporting' &&
              <h1 className={Styles.ReportingHeader__heading}>{p.heading}</h1>
            }
            { p.heading !== 'Reporting' &&
              <h1 className={Styles.ReportingHeader__heading}>Reporting: {p.heading}</h1>
            }
            { p.showReportingEndDate &&
              <span className={Styles.ReportingHeader__endDate}>Reporting cycle ends { formattedDate.formattedLocalShort }</span>
            }
            <span className={Styles.ReportingHeader__stake}> | </span><span className={Styles.ReportingHeader__stake}>{ p.reportingWindowStats.stake } REP Staked</span>
          </div>
          <div>
            Participate placeholder
          </div>
        </div>
        <div className={Styles['ReportingHeader__graph-wrapper']}>
          <div className={Styles.ReportingHeader__graph}>
            <div className={Styles['ReportingHeader__graph-current']}>
              <div style={currentPeriodStyle}>
                <span>{ Math.floor(daysLeft) } days left</span>
              </div>
            </div>
            <div className={Styles['ReportingHeader__graph-dispute']} />
          </div>
          <div className={Styles.ReportingHeader__labels}>
            <span>Current Cycle</span>
            <span>Dispute</span>
          </div>
        </div>
      </article>
    )
  }
}
