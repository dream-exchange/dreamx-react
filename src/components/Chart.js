import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./Chart.scss";
import Ticker from "./Ticker.js";

class Chart extends Component {
  render() {
    return (
      <div className={`Chart card ${this.props.theme}`}>
        <Ticker
          theme={this.props.theme}
          tickers={this.props.tickers}
          currentMarket={this.props.currentMarket}
          changeMarket={this.props.changeMarket}
        />
      </div>
    );
  }
}

// const mapStateToProps = ({ chart }) => {
//  return { chart };
// };

// const mapActionsToProps = {
//  getChartData
// };

Chart.propTypes = {
  theme: PropTypes.string.isRequired,
  tickers: PropTypes.array.isRequired,
  currentMarket: PropTypes.string.isRequired,
  changeMarket: PropTypes.func.isRequired
};

export default Chart;