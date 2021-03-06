import React, { Component } from "react";
import "./App.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";

import Market from "./components/Market";
import Offline from "./components/Offline";
import Account from "./components/Account";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import AlertModal from "./components/AlertModal";
import ModalWrapper from "./components/ModalWrapper";
import {
  toggleTheme,
  loadTheme,
  initializeAppAsync,
  accountLoginAsync,
  appLoaded,
  marketLoadAsync,
  alertModalHide
} from "./actions";

class App extends Component {
  state = {
    navItems: [
      {
        label: "market",
        root: true
      },
      {
        label: "account",
        pathname: "/account"
      }
    ]
  };

  componentDidMount = async () => {
    this.props.loadTheme();
    const initialized = await this.props.initializeAppAsync();
    if (initialized) {
      await this.props.accountLoginAsync();
      await this.props.marketLoadAsync()
    }
    this.props.appLoaded()
  };

  renderAlertModal = () => {
    return (
      <AlertModal 
        theme={this.props.app.theme}
        type={this.props.alertModal.type}
      />
    );
  }

  renderMarket = () => {
    return (
      <React.Fragment>
        <div className={`App ${this.props.app.theme}`}>
          <Menu
            navItems={this.state.navItems}
            toggleTheme={this.props.toggleTheme}
            theme={this.props.app.theme}
            rootPath={`/market/${this.props.market.currentMarket}`}
          />

          <ModalWrapper
            theme={this.props.app.theme}
            show={this.props.alertModal.show}
            onHide={this.props.alertModalHide}
            renderFrontModal={this.renderAlertModal}
          />

          <div className="container">
            <div className="row">
              <div className="col-12">
                <Switch>
                  <Route exact path="/" component={Market} />
                  <Route path="/market/:marketSymbol?" component={Market} />
                  <Route path="/account" component={Account} />
                  <Route component={Market} />
                </Switch>
              </div>
            </div>
          </div>

          <Footer theme={this.props.app.theme} />
        </div>
      </React.Fragment>
    )
  }

  renderOfflinePage = () => {
    return (
      <div className={`App ${this.props.app.theme}`}>
        <Menu
          navItems={[]}
          toggleTheme={this.props.toggleTheme}
          theme={this.props.app.theme}
          rootPath='/'
        />

        <div className="container">
          <div className="row">
            <div className="col-12">
              <Offline 
                theme={this.props.app.theme}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <BrowserRouter>
        {this.props.app.offline && this.renderOfflinePage()}
        {!this.props.app.offline && this.renderMarket()}
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return state;
};

const mapActionsToProps = {
  toggleTheme,
  loadTheme,
  initializeAppAsync,
  accountLoginAsync,
  appLoaded,
  marketLoadAsync,
  alertModalHide
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(App);
