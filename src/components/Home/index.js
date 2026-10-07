import {Component} from 'react'
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

class Home extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    categoriesData: [],
    activeCategory: 'All',
    cart: {},
  }

  componentDidMount() {
    this.getCategoriesData()
    this.syncCartFromLocalStorage()
  }

  getCategoriesData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const url = 'https://apis2.ccbp.in/nxt-mart/category-list-details'

    try {
      const response = await fetch(url)

      if (response.ok === true) {
        const fetchedData = await response.json()

        const formattedData = fetchedData.categories.map(eachCategory => ({
          name: eachCategory.name,
          products: eachCategory.products.map(eachProduct => ({
            id: eachProduct.id,
            name: eachProduct.name,
            weight: eachProduct.weight,
            price: eachProduct.price,
            image: eachProduct.image,
          })),
        }))

        this.setState(
          {
            categoriesData: formattedData,
            apiStatus: apiStatusConstants.success,
          },
          this.syncCartFromLocalStorage,
        )
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  syncCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem('cartData')

    if (storedCart !== null) {
      try {
        const parsedCart = JSON.parse(storedCart)

        const cartMap = {}

        parsedCart.forEach(item => {
          cartMap[item.id] = Number(item.count) || 0
        })

        this.setState({cart: cartMap})
      } catch (error) {
        this.setState({cart: {}})
      }
    } else {
      this.setState({cart: {}})
    }
  }

  saveCartToLocalStorage = updatedCartMap => {
    const {categoriesData} = this.state

    const cartArray = []

    Object.keys(updatedCartMap).forEach(id => {
      const numericId = parseInt(id, 10)
      const count = updatedCartMap[id]

      if (count > 0) {
        let foundProduct = null

        categoriesData.forEach(category => {
          const product = category.products.find(
            eachProduct => eachProduct.id === numericId,
          )

          if (product) {
            foundProduct = product
          }
        })

        if (foundProduct) {
          cartArray.push({
            id: foundProduct.id,
            name: foundProduct.name,
            weight: foundProduct.weight,
            price: foundProduct.price,
            image: foundProduct.image,
            count,
          })
        }
      }
    })

    localStorage.setItem('cartData', JSON.stringify(cartArray))
  }

  onClickCategory = categoryName => {
    this.setState({activeCategory: categoryName})
  }

  onIncrementCount = id => {
    this.setState(prevState => {
      const updatedCart = {
        ...prevState.cart,
        [id]: (prevState.cart[id] || 0) + 1,
      }

      this.saveCartToLocalStorage(updatedCart)

      return {
        cart: updatedCart,
      }
    })
  }

  onDecrementCount = id => {
    this.setState(prevState => {
      const currentCount = prevState.cart[id] || 0

      const updatedCart = {
        ...prevState.cart,
      }

      if (currentCount <= 1) {
        delete updatedCart[id]
      } else {
        updatedCart[id] = currentCount - 1
      }

      this.saveCartToLocalStorage(updatedCart)

      return {
        cart: updatedCart,
      }
    })
  }

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

      <h1>Oops! Something Went Wrong</h1>

      <p>
        We are having some trouble processing your request. Please try again.
      </p>

      <button
        type="button"
        className="retry-button"
        onClick={this.getCategoriesData}
      >
        Retry
      </button>
    </div>
  )

  renderProductsListView = () => {
    const {categoriesData, activeCategory, cart} = this.state

    const filteredCategories =
      activeCategory === 'All'
        ? categoriesData
        : categoriesData.filter(category => category.name === activeCategory)

    return (
      <div className="home-route-wrapper">
        <div className="home-content">
          <ul className="mobile-categories-list">
            <li
              className={`mobile-category-item ${
                activeCategory === 'All' ? 'mobile-active-category' : ''
              }`}
              onClick={() => this.onClickCategory('All')}
            >
              <div className="mobile-category-card">
                <img
                  src="https://res.cloudinary.com/dpfiewupj/image/upload/v1789841786/Group_7419.svg"
                  alt="All"
                  className="mobile-category-image"
                />
              </div>

              <span className="mobile-category-title">All</span>
            </li>

            {categoriesData.map(eachCategory => {
              const isActive = activeCategory === eachCategory.name

              return (
                <li
                  key={eachCategory.name}
                  className={`mobile-category-item ${
                    isActive ? 'mobile-active-category' : ''
                  }`}
                  onClick={() => this.onClickCategory(eachCategory.name)}
                >
                  <div className="mobile-category-card">
                    <img
                      src={
                        eachCategory.products[0]?.image ||
                        'https://res.cloudinary.com/dpfiewupj/image/upload/v1789841786/Group_7419.svg'
                      }
                      alt={eachCategory.name}
                      className="mobile-category-image"
                    />
                  </div>

                  <span className="mobile-category-title">
                    {eachCategory.name}
                  </span>
                </li>
              )
            })}
          </ul>

          <div className="categories-sidebar-wrapper">
            <h1 className="categories-heading">Categories</h1>

            <ul className="categories-sidebar">
              <li
                className={`category-item ${
                  activeCategory === 'All' ? 'active-category' : ''
                }`}
                onClick={() => this.onClickCategory('All')}
              >
                <a href="#All" className="category-link">
                  All
                </a>
              </li>

              {categoriesData.map(eachCategory => {
                const isActive = activeCategory === eachCategory.name

                return (
                  <li
                    key={eachCategory.name}
                    className={`category-item ${
                      isActive ? 'active-category' : ''
                    }`}
                    onClick={() => this.onClickCategory(eachCategory.name)}
                  >
                    <a href={`#${eachCategory.name}`} className="category-link">
                      {eachCategory.name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="products-display-container">
            {filteredCategories.map(eachCategory => (
              <div
                key={eachCategory.name}
                id={eachCategory.name}
                className="category-section"
              >
                <div className="category-header-wrapper">
                  <h2 className="category-title">
                    {eachCategory.name} <span className="arrow">&gt;</span>
                  </h2>

                  <button type="button" className="view-all-button">
                    View all
                  </button>
                </div>

                <ul className="products-horizontal-list">
                  {eachCategory.products.map(eachProduct => {
                    const count = cart[eachProduct.id] || 0

                    const formattedPrice =
                      typeof eachProduct.price === 'number'
                        ? `₹ ${eachProduct.price.toFixed(2)}`
                        : eachProduct.price

                    return (
                      <li
                        key={eachProduct.id}
                        className="product-card"
                        data-testid="product"
                      >
                        <div className="product-image-container">
                          <img
                            src={eachProduct.image}
                            alt={eachProduct.name}
                            className="product-image"
                          />
                        </div>

                        <div className="product-details-and-action">
                          <div className="product-info">
                            <p className="product-name">{eachProduct.name}</p>

                            <p className="product-weight">
                              {eachProduct.weight}
                            </p>

                            <p className="product-price">{formattedPrice}</p>
                          </div>

                          <div className="action-container">
                            {count === 0 ? (
                              <button
                                type="button"
                                className="add-button"
                                data-testid="add-button"
                                onClick={() =>
                                  this.onIncrementCount(eachProduct.id)
                                }
                              >
                                Add
                              </button>
                            ) : (
                              <div className="quantity-controller">
                                <button
                                  type="button"
                                  className="controller-button"
                                  data-testid="decrement-count"
                                  onClick={() =>
                                    this.onDecrementCount(eachProduct.id)
                                  }
                                >
                                  -
                                </button>

                                <span
                                  className="active-count"
                                  data-testid="active-count"
                                >
                                  {count}
                                </span>

                                <button
                                  type="button"
                                  className="controller-button"
                                  data-testid="increment-count"
                                  onClick={() =>
                                    this.onIncrementCount(eachProduct.id)
                                  }
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  renderAllViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      case apiStatusConstants.success:
        return this.renderProductsListView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="home-container">
        <Header />
        {this.renderAllViews()}
      </div>
    )
  }
}

export default Home
