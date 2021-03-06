import React, { Component } from "react";
// import { connect } from "react-redux";
import PropTypes from "prop-types";

import "./TransferModal.scss";
import { capitalize } from "../helpers";
import InlineForm from "./InlineForm";

class TransferModal extends Component {
  renderFee = () => {
    return (
      <div className="fee d-xs-block d-sm-flex">
        <small>
          Fee ({this.props.feeInPercentage}%): <b>{this.props.fee}</b>
        </small>
        <small>
          You will receive: <b>{this.props.receiving}</b>
        </small>
      </div>
    );
  };

  render() {
    return (
      <div className={`TransferModal ${this.props.theme}`}>
        <div className="modal-header">
          <h5 className="modal-title">
            {capitalize(this.props.type)} {capitalize(this.props.name)} (
            {this.props.symbol.toUpperCase()})
          </h5>
          <div className="close" onClick={this.props.onHide}>
            <ion-icon name="close-circle" />
          </div>
        </div>

        <div className="modal-body">
          <InlineForm
            onAmountChange={this.props.onAmountChange}
            error={this.props.error}
            value={this.props.amount}
            pending={this.props.pending}
            theme={this.props.theme}
            onSubmit={this.props.onSubmit}
            type={this.props.type}
            inputPlaceHolder={"Amount"}
          />
          <small
            className="form-text text-muted"
            onClick={this.props.enterEntireBalance}
          >
            {capitalize(this.props.type)} entire balance
          </small>
          {this.props.type === "withdraw" && this.renderFee()}
        </div>
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

TransferModal.propTypes = {
  theme: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  onAmountChange: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pending: PropTypes.bool.isRequired,
  enterEntireBalance: PropTypes.func.isRequired,
  fee: PropTypes.string.isRequired,
  feeInPercentage: PropTypes.string.isRequired,
  receiving: PropTypes.string.isRequired
};

export default TransferModal;
