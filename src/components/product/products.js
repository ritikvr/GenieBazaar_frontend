import { useDispatch, useSelector } from "react-redux";
import "./Products.css";
import { Fragment, useEffect, useState } from "react";
import Product from "../home/Product";
import { fetchProducts } from "../../store/product-actions";
import Loader from "../layout/loader/Loader";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import { Slider } from "@mui/material";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import MetaData from "../layout/MetaData";
import { useDebounce } from "use-debounce";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

const PrettoSlider = styled(Slider)({
  color: "#D7B16F",
  height: 4,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 12,
    width: 12,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 12,
    background: "unset",
    padding: 0,
    width: 40,
    height: 40,
    borderRadius: "50% 50% 50% 0",
    backgroundColor: "#CC9B47",
    transformOrigin: "bottom left",
    transform: "translate(50%, -100%) rotate(-45deg) scale(0)",
    "&::before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translate(50%, -100%) rotate(-45deg) scale(1)",
    },
    "& > *": {
      transform: "rotate(45deg)",
    },
  },
});

const categories = [
  "Men's Clothing",
  "Women's Clothing",
  "Footwear",
  "Accessories(bags, hats, jewelry)",
  "Computers & Laptops",
  "Smartphones & Accessories",
  "Cameras & Photography",
];

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 150000]);
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);

  const dispatch = useDispatch();
  const { products, loading, resultPerPage, filteredProductCount } =
    useSelector((state) => state.product);

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("query") ?? "";

  const [priceValue] = useDebounce(price, 500);
  const [ratingValue] = useDebounce(rating, 500);

  useEffect(() => {
    console.log("1");
    dispatch(
      fetchProducts(keyword, currentPage, priceValue, category, ratingValue)
    );
    // eslint-disable-next-line
  }, [dispatch, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    console.log("2");
    dispatch(fetchProducts(keyword, 1, priceValue, category, ratingValue));
    // eslint-disable-next-line
  }, [priceValue, category, ratingValue, keyword]);

  return (
    <Fragment>
      <MetaData title="Products -- Ecommerce" />
      {!loading && products.length === 0 ? (
        <div className="empty-cart">
          <RemoveShoppingCartIcon />
          <Typography>No product in your cart</Typography>
          <Link to="/products">view products</Link>
        </div>
      ) : (
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <div className="product-container">
              {products &&
                products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
            </div>
          )}
          <div className="filter-box">
            <Typography>
              <b>Price</b>
            </Typography>
            <PrettoSlider
              value={price}
              onChange={(event, newPrice) => setPrice(newPrice)}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={150000}
            />
            <Typography>
              <b>Categories</b>
            </Typography>
            <ul className="category-box">
              {categories.map((c) => (
                <li
                  className="category-link"
                  style={{ color: category === c && "#cc9b47" }}
                  key={c}
                  onClick={() => {
                    if (category && category === c) {
                      setCategory("");
                    } else {
                      setCategory(c);
                    }
                  }}
                >
                  {c}
                </li>
              ))}
            </ul>
            <fieldset>
              <Typography component="legend">
                <b>Rating</b>
              </Typography>
              <PrettoSlider
                value={rating}
                onChange={(event, newRating) => {
                  setRating(newRating);
                }}
                valueLabelDisplay="auto"
                aria-labelledby="continuous-slider"
                min={0}
                max={5}
              />
            </fieldset>
          </div>

          {!loading && (
            <>
              {resultPerPage < filteredProductCount && (
                <div className="pagination-box">
                  <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resultPerPage}
                    totalItemsCount={filteredProductCount}
                    onChange={(e) => setCurrentPage(e)}
                    nextPageText="Next"
                    prevPageText="Prev"
                    firstPageText="first"
                    lastPageText="last"
                    itemClass="page-item"
                    linkClass="page-link"
                    activeClass="pageItemActive"
                    activeLinkClass="pageLinkActive"
                    disabledClass="disable"
                    hideDisabled={true}
                  />
                </div>
              )}
            </>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};
export default Products;
