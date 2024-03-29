/* eslint-disable jsx-a11y/accessible-emoji */
import React from "react";
import { Spinner, Pagination } from "react-bootstrap";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
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
  Container,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";

import MovieCards from "./components/MovieCards";
import Genres from "./components/Genres";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import YouTube from "react-youtube";

import "./assets/css/blk-design-system-react.css";
import "./assets/css/nucleo-icons.css";
import "./App.css";

// import Modal from "./components/Modal";
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
      genre: "",
      isLoading: true,
      modal: false,
      trailerTitle: ""
    };
  }
  getMovies = async page => {
    let sortBy = this.state.sortBy;
    let genre = this.state.genre;
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=4c5b4a5e627748117d4b24082672a9b4&sort_by=${sortBy}&page=${page}&primary_release_date.gte=${
        this.state.year.min
      }-1-1&primary_release_date.lte=${
        this.state.year.max
      }-12-31&vote_average.gte=${this.state.rating.min}&vote_average.lte=${
        this.state.rating.max
      }&with_genres=${genre}`
    );
    const jsonData = await response.json();
    // console.log("data", jsonData);
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

  getTrailerKey = async movieId => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=4c5b4a5e627748117d4b24082672a9b4`
      );
      const jsonData = await response.json();
      // console.log("Hello", jsonData.results[0].key);
      this.setState({
        id: jsonData.results[0].key,
        modal: true,
        trailerTitle: jsonData.results[0].name
      });
    } catch (TypeError) {
      alert("Opps! Trailer for this movie is not available");
    }
  };

  toggle = movieId => {
    if (!this.state.modal) {
      this.getTrailerKey(movieId);
    } else {
      this.setState({ modal: false });
    }
  };

  renderPagination() {
    let pages = [];
    for (let i = 1; i <= Math.min(this.state.total_pages, 1000); i++) {
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

  searchMovies = async term => {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=4c5b4a5e627748117d4b24082672a9b4&query=${term}&page=1`
    );
    const jsonData = await response.json();
    let filtered = this.state.movies.filter(
      movie =>
        movie.title.toLowerCase().includes(term.toLowerCase()) ||
        movie.overview.toLowerCase().includes(term.toLowerCase())
    );
    let result = jsonData.results || filtered;
    this.setState({ filtered: result });
  };

  render() {
    const opts = {
      height: "420",
      width: "700",
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };

    if (this.state.isLoading) {
      return (
        <div className="App-header">
          <Spinner
            animation="border"
            variant="light"
            style={{ width: "3rem", height: "3rem" }}
          />
        </div>
      );
    } else {
      return (
        <div className="App">
          <Modal
            size="lg"
            isOpen={this.state.modal}
            toggle={this.toggle}
            className={this.props.className}
          >
            <ModalHeader toggle={this.toggle}>
              {this.state.trailerTitle}
            </ModalHeader>
            <ModalBody className="text-center">
              <YouTube videoId={this.state.id} opts={opts} />
            </ModalBody>
          </Modal>
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
                  Home Cine
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
                        active={this.state.sortBy === "popularity.desc"}
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
                        active={this.state.sortBy === "popularity.asc"}
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
                        active={this.state.sortBy === "vote_average.desc"}
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
                        active={this.state.sortBy === "vote_average.asc"}
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
                      id="searchField"
                      onChange={e => this.searchMovies(e.target.value)}
                    />
                  </FormGroup>
                </Form>
              </UncontrolledCollapse>
            </Container>
          </Navbar>
          <Row>
            <Col lg={3} md={12} className="filter">
              <h1 className="my-4 mx-0">Filter</h1>
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
              <div className="mt-3">
                <h4>Year</h4>
                <InputRange
                  maxValue={2020}
                  minValue={1850}
                  value={this.state.year}
                  onChange={year =>
                    this.setState({ year }, () => this.getMovies(1))
                  }
                />
              </div>
              <div className="mt-3">
                <h4>Rating</h4>
                <InputRange
                  maxValue={10}
                  minValue={0}
                  value={this.state.rating}
                  onChange={rating =>
                    this.setState({ rating }, () => this.getMovies(1))
                  }
                />
              </div>
            </Col>
            <Col lg={9} md={12}>
              <Container className="d-flex flex-wrap justify-content-center">
                <MovieCards
                  filtered={this.state.filtered}
                  toggle={this.toggle}
                />
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
              disabled={
                this.state.page === Math.min(this.state.total_pages, 1000)
              }
              onClick={() => this.getMovies(this.state.page + 1)}
            />
            <Pagination.Last
              onClick={() =>
                this.getMovies(Math.min(this.state.total_pages, 1000))
              }
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
