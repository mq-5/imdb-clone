import React from "react";
import "./App.css";
import {
  Button,
  Row,
  Col,
  Container,
  Spinner,
  Nav,
  NavDropdown,
  Navbar,
  Pagination,
  Form,
  FormControl
} from "react-bootstrap";
import MovieCards from "./MovieCards";
import Genres from "./Genres";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";

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
    console.log("api", genre, jsonData);
    this.setState({
      movies: jsonData.results,
      total_pages: jsonData.total_pages,
      page: page,
      isLoading: false
    });
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
    console.log("state", this.state);
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
            collapseOnSelect
            sticky="top"
            expand="lg"
            bg="dark"
            variant="dark"
          >
            <Navbar.Brand href="#home">Home Cinema</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <NavDropdown title="Sort By" id="collasible-nav-dropdown">
                  <NavDropdown.Item
                    href="#action/3.2"
                    onClick={() =>
                      this.setState({ sortBy: "popularity.desc" }, () =>
                        this.getMovies(this.state.page)
                      )
                    }
                  >
                    Popularity (Descending)
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="#action/3.1"
                    onClick={() =>
                      this.setState({ sortBy: "popularity.asc" }, () =>
                        this.getMovies(this.state.page)
                      )
                    }
                  >
                    Popularity (Ascending)
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="#action/3.4"
                    onClick={() =>
                      this.setState({ sortBy: "vote_average.desc" }, () =>
                        this.getMovies(this.state.page)
                      )
                    }
                  >
                    Rating (Descending)
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="#action/3.3"
                    onClick={() =>
                      this.setState({ sortBy: "vote_average.asc" }, () =>
                        this.getMovies(this.state.page)
                      )
                    }
                  >
                    Rating (Ascending)
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Nav>
                <Form inline>
                  <FormControl
                    type="text"
                    onChange={e => this.searchMovies(e.target.value)}
                    placeholder="Search"
                    className="mr-sm-2"
                  />
                  <Button disable variant="outline-success">
                    Search
                  </Button>
                </Form>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Row>
            <Col lg={3} md={12} className="filter">
              <h3 className="my-4">Filter</h3>
              <h5 className="mt-3"> Genres </h5>
              <Form.Control
                as="select"
                onChange={e =>
                  this.setState({ genre: e.target.value }, () =>
                    this.getMovies(1)
                  )
                }
              >
                <option value="">All...</option>
                <Genres />
              </Form.Control>
              <h5 className="mt-3"> Year </h5>
              <InputRange
                maxValue={2020}
                minValue={1850}
                value={this.state.year}
                onChange={year =>
                  this.setState({ year }, () => this.getMovies(this.state.page))
                }
              />
              <h5 className="mt-3"> Rating </h5>
              <InputRange
                maxValue={10}
                minValue={0}
                value={this.state.rating}
                onChange={rating =>
                  this.setState({ rating }, () =>
                    this.getMovies(this.state.page)
                  )
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
          <footer>
            <h5>Created with ❤️ by Quyen</h5>
          </footer>
        </div>
      );
    }
  }
}

export default App;
