import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Cart extends Component {
  state = {
    cartList: [],
    isOrderPlaced: false,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCartDataFromLocalStorage()
  }

  getCartDataFromLocalStorage = () => {
    this.setState(
      {
        apiStatus: apiStatusConstants.inProgress,
      },
      () => {
        try {
          const stringifiedCartData = localStorage.getItem('cartData')

          if (stringifiedCartData === null) {
            this.setState({
              cartList: [],
              apiStatus: apiStatusConstants.success,
            })

            return
          }

          const parsedCartData = JSON.parse(stringifiedCartData)

          if (Array.isArray(parsedCartData)) {
            this.setState({
              cartList: parsedCartData,
              apiStatus: apiStatusConstants.success,
            })
          } else {
            this.setState({
              cartList: [],
              apiStatus: apiStatusConstants.success,
            })
          }
        } catch (error) {
          this.setState({
            apiStatus: apiStatusConstants.failure,
          })
        }
      },
    )
  }

  updateLocalStorage = updatedCartList => {
    localStorage.setItem('cartData', JSON.stringify(updatedCartList))
  }

  onIncrementQuantity = id => {
    this.setState(prevState => {
      const updatedCartList = prevState.cartList.map(eachItem => {
        if (eachItem.id === id) {
          return {
            ...eachItem,
            count: Number(eachItem.count) + 1,
          }
        }

        return eachItem
      })

      this.updateLocalStorage(updatedCartList)

      return {
        cartList: updatedCartList,
      }
    })
  }

  onDecrementQuantity = id => {
    this.setState(prevState => {
      const updatedCartList = prevState.cartList
        .map(eachItem => {
          if (eachItem.id === id) {
            return {
              ...eachItem,
              count: Number(eachItem.count) - 1,
            }
          }

          return eachItem
        })
        .filter(eachItem => Number(eachItem.count) > 0)

      this.updateLocalStorage(updatedCartList)

      return {
        cartList: updatedCartList,
      }
    })
  }

  onCheckoutOrder = () => {
    localStorage.removeItem('cartData')

    this.setState({
      cartList: [],
      isOrderPlaced: true,
    })
  }

  renderEmptyCartView = () => (
    <div className="empty-cart-container">
      <img
        src="https://res.cloudinary.com/dpfiewupj/image/upload/v1789457793/Logo.png"
        alt="empty cart"
        className="empty-cart-image"
      />

      <h1>Your cart is empty</h1>

      <Link to="/">
        <button type="button" className="shop-now-button">
          Shop Now
        </button>
      </Link>
    </div>
  )

  renderSuccessOrderView = () => (
    <div className="success-order-container">
      <div className="success-icon-container">
        <img
          src="https://res.cloudinary.com/dpfiewupj/image/upload/v1789457793/Group_7417.png"
          alt="success icon"
        />
      </div>

      <h1>Payment Successful</h1>

      <p>Thank you for ordering.</p>

      <p>Your payment is successfully completed.</p>

      <Link to="/">
        <button type="button" className="return-home-button">
          Return to Homepage
        </button>
      </Link>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#00701a" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://res.cloudinary.com/dpfiewupj/image/upload/v1789457793/Group_7519.png"
        alt="failure view"
        className="failure-image"
      />

      <h1>Oops! Something went wrong</h1>

      <p>We are having some trouble</p>

      <button
        type="button"
        className="retry-button"
        onClick={this.getCartDataFromLocalStorage}
      >
        Retry
      </button>
    </div>
  )

  renderCartItemsView = () => {
    const {cartList} = this.state

    const totalItemsCount = cartList.length

    let totalPriceAmount = 0
    cartList.forEach(eachItem => {
      const itemCount = Number(eachItem.count) || 0
      const priceString = String(eachItem.price || '0')
      const numericPrice = parseFloat(priceString.replace(/[^\d.]/g, ''))

      if (!Number.isNaN(numericPrice)) {
        totalPriceAmount += numericPrice * itemCount
      }
    })
    return (
      <div className="cart-content-container">
        <div className="mobile-cart-header">
          <Link to="/" className="back-link">
            <img
              src="https://res.cloudinary.com/dpfiewupj/image/upload/v1789841802/arrow-leftarrow_left.svg"
              alt="back arrow"
              className="back-arrow-img"
            />
          </Link>
          <h1 className="mobile-title">Checkout</h1>
        </div>

        <div className="desktop-cart-heading-row">
          <h1 className="desktop-cart-heading">Items</h1>
          <span className="mobile-items-count-top">
            Items ({totalItemsCount})
          </span>
        </div>

        <div className="cart-card">
          <ul className="cart-list">
            {cartList.map(eachCartItem => (
              <li
                key={eachCartItem.id}
                className="cart-item"
                data-testid="cartItem"
              >
                <div className="cart-item-details">
                  <img
                    src={eachCartItem.image}
                    alt={eachCartItem.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <h2>{eachCartItem.name}</h2>
                    <p className="cart-item-weight">{eachCartItem.weight}</p>
                    <p className="cart-item-price">{eachCartItem.price}</p>
                  </div>
                </div>

                <div className="cart-quantity-controller">
                  <button
                    type="button"
                    data-testid="decrement-quantity"
                    onClick={() => this.onDecrementQuantity(eachCartItem.id)}
                  >
                    -
                  </button>
                  <span data-testid="item-quantity">{eachCartItem.count}</span>
                  <button
                    type="button"
                    data-testid="increment-quantity"
                    onClick={() => this.onIncrementQuantity(eachCartItem.id)}
                  >
                    +
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary-container">
            <h1 className="total-price-text" data-testid="total-price">
              {`Total (${totalItemsCount} ${
                totalItemsCount === 1 ? 'item' : 'items'
              }) : ₹ ${totalPriceAmount}`}
            </h1>

            <button
              type="button"
              className="checkout-button"
              onClick={this.onCheckoutOrder}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    )
  }

  renderCartContent = () => {
    const {cartList, isOrderPlaced, apiStatus} = this.state

    if (isOrderPlaced) {
      return this.renderSuccessOrderView()
    }

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      case apiStatusConstants.success:
        if (cartList.length === 0) {
          return this.renderEmptyCartView()
        }

        return this.renderCartItemsView()

      default:
        return null
    }
  }

  render() {
    const {apiStatus} = this.state

    return (
      <div className="cart-route-container">
        <Header />

        <div className="cart-body">{this.renderCartContent()}</div>

        {apiStatus !== apiStatusConstants.failure && <Footer />}
      </div>
    )
  }
}

export default Cart
