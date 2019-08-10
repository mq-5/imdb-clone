/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react";
import { Spinner, Pagination } from "react-bootstrap";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledButtonDropdown
} from "reactstrap";
import {
  UncontrolledCollapse,
  FormGroup,
  Form,
  Label,
  Input,
  NavbarBrand,
  Navbar,
  Nav,
  Row,
  Col,
  Container
} from "reactstrap";
import MovieCards from "./MovieCards";
import Genres from "./Genres";
// import InputRange from "react-input-range";
import Slider from "./Slider";
import "./assets/css/blk-design-system-react.css";
import "./assets/css/nucleo-icons.css";
import "./App.css";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      page: 1,
      filtered: [],
      sortBy: "popularity.desc",
      year: { min: 1850, max: 2020 },
      rating: { min: 0, max: 10 },
      genre: null,
      isLoading: true
    };
  }
  getMovies = async page => {
    let sortBy = this.state.sortBy;
    let genre = this.state.genre || "";
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=4c5b4a5e627748117d4b24082672a9b4&sort_by=${sortBy}&page=${
        this.state.page
      }&primary_release_date.gte=${
        this.state.year.min
      }-1-1&primary_release_date.lte=${
        this.state.year.max
      }-12-31&vote_average.gte=${this.state.rating.min}&vote_average.lte=${
        this.state.rating.max
      }&with_genres=${genre}`
    );
    const jsonData = await response.json();
    this.setState(
      {
        movies: jsonData.results,
        total_pages: jsonData.total_pages,
        page: page,
        isLoading: false
      },
      () => this.searchMovies("")
    );
  };

  componentDidMount() {
    this.getMovies(1);
  }

  renderPagination() {
    let pages = [];
    for (let i = 1; i <= this.state.total_pages; i++) {
      pages.push(i);
    }
    return pages.map(page => {
      if (page <= this.state.page + 3 && page >= this.state.page - 3) {
        return (
          <Pagination.Item
            active={page === this.state.page}
            onClick={() => this.getMovies(page)}
          >
            {page}
          </Pagination.Item>
        );
      }
    });
  }

  searchMovies = term => {
    let filtered = this.state.movies.filter(
      movie =>
        movie.title.toLowerCase().includes(term.toLowerCase()) ||
        movie.overview.toLowerCase().includes(term.toLowerCase())
    );
    this.setState({ filtered: filtered });
  };

  render() {
    // console.log("state", this.state.rating);
    if (this.state.isLoading) {
      return (
        <div className="App-header">
          <Spinner animation="border" variant="light" />
        </div>
      );
    } else {
      return (
        <div className="App">
          <Navbar
            className="bg-success"
            collapseOnSelect
            sticky="top"
            expand="lg"
          >
            <Container>
              <button
                className="navbar-toggler"
                id="navbarTogglerDemo01"
                type="button"
              >
                <span className="navbar-toggler-bar navbar-kebab" />
                <span className="navbar-toggler-bar navbar-kebab" />
                <span className="navbar-toggler-bar navbar-kebab" />
              </button>
              <UncontrolledCollapse navbar toggler="#navbarTogglerDemo01">
                <NavbarBrand href="#pablo" onClick={e => e.preventDefault()}>
                  Hidden brand
                </NavbarBrand>
                <Nav className="mr-auto mt-2 mt-lg-0" navbar>
                  <UncontrolledDropdown nav>
                    <DropdownToggle
                      aria-expanded={false}
                      aria-haspopup={true}
                      caret
                      color="default"
                      data-toggle="dropdown"
                      href="#pablo"
                      id="navbarDropdownMenuLink"
                      nav
                      onClick={e => e.preventDefault()}
                    >
                      Sort By
                    </DropdownToggle>
                    <DropdownMenu aria-labelledby="navbarDropdownMenuLink">
                      <DropdownItem
                        href="#pablo"
                        onClick={() =>
                          this.setState({ sortBy: "popularity.desc" }, () =>
                            this.getMovies(this.state.page)
                          )
                        }
                      >
                        Popularity (Descending)
                      </DropdownItem>
                      <DropdownItem
                        href="#pablo"
                        onClick={() =>
                          this.setState({ sortBy: "popularity.asc" }, () =>
                            this.getMovies(this.state.page)
                          )
                        }
                      >
                        Popularity (Ascending)
                      </DropdownItem>
                      <DropdownItem
                        href="#pablo"
                        onClick={() =>
                          this.setState({ sortBy: "vote_average.desc" }, () =>
                            this.getMovies(this.state.page)
                          )
                        }
                      >
                        Rating (Descending)
                      </DropdownItem>
                      <DropdownItem
                        href="#pablo"
                        onClick={() =>
                          this.setState({ sortBy: "vote_average.asc" }, () =>
                            this.getMovies(this.state.page)
                          )
                        }
                      >
                        Rating (Ascending)
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Nav>
                <Form className="form-inline ml-auto">
                  <FormGroup className="no-border">
                    <Input
                      placeholder="Search"
                      className=" border-info"
                      type="text"
                      onChange={e => this.searchMovies(e.target.value)}
                    />
                  </FormGroup>
                </Form>
              </UncontrolledCollapse>
            </Container>
          </Navbar>
          <Row>
            <Col lg={3} md={12} className="filter">
              <h2 className="my-4">Filter</h2>
              <FormGroup className="border-top border-light pt-2">
                <Label for="inputGenre">
                  <h4>Genre</h4>
                </Label>
                <Input
                  type="select"
                  name="select"
                  id="inputGenre"
                  onChange={e =>
                    this.setState({ genre: e.target.value }, () =>
                      this.getMovies(1)
                    )
                  }
                >
                  <option value="">All</option>
                  <Genres />
                </Input>
              </FormGroup>
              <Slider
                min={1850}
                max={2020}
                name="Year"
                setValue={newRange =>
                  this.setState({ year: newRange }, () => this.getMovies(1))
                }
              />
              <Slider
                min={0}
                max={10}
                name="Rating"
                setValue={newRange =>
                  this.setState({ rating: newRange }, () => this.getMovies(1))
                }
              />
            </Col>
            <Col lg={9} md={12}>
              <Container className="d-flex flex-wrap justify-content-center">
                <MovieCards filtered={this.state.filtered} />
              </Container>
            </Col>
          </Row>
          <Pagination>
            <Pagination.First onClick={() => this.getMovies(1)} />
            <Pagination.Prev
              disabled={this.state.page === 1}
              onClick={() => this.getMovies(this.state.page - 1)}
            />
            {this.renderPagination()}
            <Pagination.Next
              disabled={this.state.page === this.state.total_pages}
              onClick={() => this.getMovies(this.state.page + 1)}
            />
            <Pagination.Last
              onClick={() => this.getMovies(this.state.total_pages)}
            />
          </Pagination>
          <footer className="">
            <h4>Created with ❤️ by Quyen</h4>
          </footer>
        </div>
      );
    }
  }
}

export default App;
