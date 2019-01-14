import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { searchedInput } from '../action/action_searched_input';
import { parseInput } from '../action/action_parse_input';
import { getVideoResults } from '../action/action_get_video_results';
import { getForumResults } from '../action/action_get_forum_results';
import { clearResults } from '../action/action_clear_results';
import { getUser } from '../action/action_user';
import REACT_APP_URL from '../url';

import('../styles/home.css');

class Home extends Component {
  constructor(props) {
    super(props);
    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.state = {
      searchInput: this.props.searchInput || '',
      coolNum: 0,
      coolSaying: ''
    };
    this.signInSignOut = this.signInSignOut.bind(this);
    this.toggler = this.toggler.bind(this);
  }

  componentDidMount() {
    this.props.getUser();
  }

  onInputChange(event) {
    this.setState({ searchInput: event.target.value });
  }

  onFormSubmit(event) {
    this.props.clearResults();
    const input = this.state.searchInput.trim();
    event.preventDefault();
    this.props.searchedInput(input);
    this.props.parseInput(input);
    this.props.getVideoResults(input);
    this.props.getForumResults(input);
    this.props.history.push('/search');
  }

  signInSignOut(user) {
    const login = `${REACT_APP_URL}/auth/login`;
    const logout = `${REACT_APP_URL}/auth/logout`;
    if (user.username === undefined) {
      return (
        <div className="registerSignIn">
          <a
            href="https://github.com/join?source=header-home"
            className="homeSwag"
          >
            Register
          </a>
          <a href={login} className="homeSignIn">
            Sign In
          </a>
        </div>
      );
    } else {
      return (
        <span className="registerSignIn">
          <span className="homeUsername">{user.username}</span>
          <a href={logout} className="homeSignOut">
            Sign Out
          </a>
        </span>
      );
    }
  }

  toggler() {
    const coolBroSayings = [
      "That's Cool Bro!",
      "You're Really Cool!",
      'CCCOOOOOOLLL!!!',
      'OMG That Was So Cool!',
      'A/C Coool!',
      'Ahhhhh... So Cool!',
      'OK, STOP IT!',
      'STOP!',
      "YOU'RE HURTING ME!!!",
      'I SAID STOP!'
    ];
    this.setState(
      (prevState) => {
        return { coolNum: prevState.coolNum + 1 };
      },
      () => {
        if (this.state.coolNum % 2 === 1) {
          const coolIndex = Math.floor(this.state.coolNum / 2);
          this.setState({ coolSaying: coolBroSayings[coolIndex] });
        } else {
          this.setState({ coolSaying: '' });
        }
      }
    );
  }

  render() {
    return (
      <div>
        <div className="homeNav">
          <Link to="/shop" className="homeSwag">
            Swag
          </Link>
          {this.signInSignOut(this.props.user)}
        </div>
        <div className="jumbotron mainSearch">
          <div className="titleAndToggle">
            <h1 className="display-4">KISS I.T.</h1>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round" onClick={this.toggler} />
            </label>
          </div>
          <form onSubmit={this.onFormSubmit}>
            <div className="searchDiv">
              <input
                type="text"
                name="search-bar"
                placeholder="Search Kiss IT"
                onChange={this.onInputChange}
                value={this.state.searchInput}
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </div>
          </form>
          <p>Developers' Search Tool</p>
          <p>#mySyntaxIsCorrect ;-P</p>
          <table>
            <tbody className="homeShortcuts">
              <tr>
                <td>--lib</td>
                <td>{'{Search Node.js Libraries}'}</td>
              </tr>
              <tr>
                <td>--lib-repo</td>
                <td>{'{Search Repositories with Node.js Libraries}'}</td>
              </tr>
              <tr>
                <td>--lib-Files</td>
                <td>{'{Search Files with Node.js Libraries}'}</td>
              </tr>
            </tbody>
          </table>
          <br />
          <p id="coolBroSaying">{this.state.coolSaying}</p>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ searchInput, user }) {
  return { searchInput, user };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      searchedInput,
      parseInput,
      getVideoResults,
      getForumResults,
      getUser,
      clearResults
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
