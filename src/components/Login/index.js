import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import Background from '../Background'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showPassword: false,
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onToggleShowPassword = () => {
    this.setState(prevState => ({showPassword: !prevState.showPassword}))
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {
      username,
      password,
      showPassword,
      showSubmitError,
      errorMsg,
    } = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-route-container">
        <Background />
        <div className="login-container">
          <div className="login-card">
            <div className="logo-container">
              <div className="brand-logo">
                <img
                  src="https://res.cloudinary.com/dpfiewupj/image/upload/v1789457794/Logo_2.png"
                  alt="login website logo"
                />
              </div>
            </div>

            <form onSubmit={this.onSubmitForm} className="form">
              <div className="input-group">
                <label className="input-label" htmlFor="username">
                  Username
                </label>
                <div className="input-field-container">
                  <img
                    src="https://res.cloudinary.com/dpfiewupj/image/upload/v1789841802/Group_9.svg"
                    alt="user icon"
                    className="input-icon"
                  />
                  <input
                    type="text"
                    id="username"
                    className="user-input"
                    value={username}
                    onChange={this.onChangeUsername}
                    placeholder="Username"
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="password">
                  Password
                </label>
                <div className="input-field-container">
                  <img
                    src="https://res.cloudinary.com/dpfiewupj/image/upload/v1789841802/lock-circle.svg"
                    alt="lock icon"
                    className="input-icon"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="user-input"
                    value={password}
                    onChange={this.onChangePassword}
                    placeholder="Password"
                  />
                </div>
              </div>

              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id="showPasswordCheckbox"
                  checked={showPassword}
                  onChange={this.onToggleShowPassword}
                />
                <label
                  htmlFor="showPasswordCheckbox"
                  className="checkbox-label"
                >
                  Show Password
                </label>
              </div>

              <button type="submit" className="login-button active">
                Login
              </button>

              {showSubmitError && <p className="error-message">*{errorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
