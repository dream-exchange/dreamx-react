import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";
import { CSSTransition } from "react-transition-group";

import "./Transfer.scss";
import { capitalize } from "../helpers";

class Transfer extends Component {
  componentDidUpdate = () => {
    this.disableScrolling();
  };

  disableScrolling = () => {
    if (this.props.show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  };

  onEsc = event => {
    if (event.keyCode === 27) {
      this.props.onHide();
    }
  };

  componentDidMount = () => {
    document.addEventListener("keydown", this.onEsc, false);
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.onEsc, false);
  };

  renderDepositModal = () => (
    <div className="modal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Deposit {capitalize(this.props.name)} (
              {this.props.symbol.toUpperCase()})
            </h5>
            <div className="close" onClick={this.props.onHide}>
              <ion-icon name="close-circle" />
            </div>
          </div>

          <div className="modal-body">
            <div className="input-group">
              <input
                onChange={this.props.onAmountChange}
                type="number"
                className="form-control"
                placeholder="Amount"
                spellCheck="false"
                value={this.props.amount}
              />
              <div className="input-group-append">
                <span className="input-group-text">DEPOSIT</span>
              </div>
            </div>
            <div className="invalid-feedback">{this.props.error}</div>
            <small className="form-text text-muted">
              Deposit entire balance
            </small>
          </div>
        </div>
      </div>

      <div className="backdrop" onClick={this.props.onHide} />
    </div>
  );

  renderWithdrawModal = () => (
    <div className="modal">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Withdraw {capitalize(this.props.name)} (
              {this.props.symbol.toUpperCase()})
            </h5>
            <div className="close" onClick={this.props.onHide}>
              <ion-icon name="close-circle" />
            </div>
          </div>

          <div className="modal-body">
            <div className="input-group">
              <input
                onChange={this.props.onAmountChange}
                type="number"
                className="form-control"
                placeholder="Amount"
                spellCheck="false"
                value={this.props.amount}
              />
              <div className="input-group-append">
                <span className="input-group-text">WITHDRAW</span>
              </div>
            </div>
            <small className="form-text text-muted">
              Withdraw entire balance
            </small>
          </div>
        </div>
      </div>

      <div className="backdrop" onClick={this.props.onHide} />
    </div>
  );

  render() {
    return (
      <CSSTransition
        in={this.props.show}
        timeout={{ enter: 0, exit: 300 }}
        className={`Transfer ${this.props.theme}`}
        unmountOnExit
      >
        <div>
          {this.props.type === "deposit" && this.renderDepositModal()}
          {this.props.type === "withdraw" && this.renderWithdrawModal()}
        </div>
      </CSSTransition>
    );
  }
}

// const mapStateToProps = ({ chart }) => {
//  return { chart };
// };

// const mapActionsToProps = {
//  getChartData
// };

Transfer.propTypes = {
  theme: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  onAmountChange: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired
};

export default Transfer;