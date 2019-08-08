import React from "react";
import "./App.css";
import {
  Button,
  Card,
  Spinner,
  Accordion,
  Nav,
  NavDropdown,
  Navbar,
  Pagination,
  Form,
  FormControl
} from "react-bootstrap";
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      page: 1,
      filtered: [],
      source: "top_rated"
    };
  }

  getMovies = async page => {
    let source = this.state.source;
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${source}?api_key=4c5b4a5e627748117d4b24082672a9b4&page=${page}`
    );
    const jsonData = await response.json();
    console.log("JSON", jsonData);
    this.setState({
      movies: jsonData.results,
      total_pages: jsonData.total_pages,
      page: page
    });
    this.filterMovies("");
  };

  componentDidMount() {
    this.getMovies(1);
  }

  renderMovieCards() {
    return this.state.filtered.map(movie => {
      return (
        <Card style={{ width: "18rem", margin: 10 }}>
          <Card.Img
            variant="top"
            src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
          />
          <Card.Body
            style={{
              minHeight: "5rem",
              overflow: "auto",
              padding: 7
            }}
          >
            <Card.Title>
              <a href="#">
                {movie.title} ({movie.release_date.slice(0, 4)})
              </a>
            </Card.Title>
            <small className="font-italic">
              Rating: {movie.vote_average}⭐ ({movie.vote_count} votes) <br />
              Popularity: {movie.popularity}
            </small>
            <Accordion>
              <Accordion.Toggle as={Button} variant="link" eventKey="0">
                Overview
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <Card.Text className="text-left">{movie.overview}</Card.Text>
                </Card.Body>
              </Accordion.Collapse>
            </Accordion>
          </Card.Body>
          <Card.Body className="py-2">
            <Button className="m-2"> Watch</Button>
            <Button className="m-2 btn-secondary"> Trailer</Button>
          </Card.Body>
        </Card>
      );
    });
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

  filterMovies = term => {
    let filtered = this.state.movies.filter(movie =>
      movie.title.toLowerCase().includes(term.toLowerCase())
    );
    this.setState({ filtered: filtered });
  };

  selectSource(selection) {
    this.setState({ source: selection });
    this.forceUpdate();
    this.getMovies(1);
  }

  render() {
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
                <NavDropdown
                  title="Select Collection"
                  id="collasible-nav-dropdown"
                >
                  <NavDropdown.Item
                    href="#action/3.1"
                    onClick={() => this.selectSource("top_rated")}
                  >
                    Top Rated
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="#action/3.2"
                    onClick={() => this.selectSource("now_playing")}
                  >
                    Now Playing
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="#action/3.3"
                    onClick={() => this.selectSource("popular")}
                  >
                    Popular
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    href="#action/3.4"
                    onClick={() => this.selectSource("upcoming")}
                  >
                    Upcoming
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Nav>
                <Form inline>
                  <FormControl
                    type="text"
                    onLoad={e => this.filterMovies(" ")}
                    onChange={e => this.filterMovies(e.target.value)}
                    placeholder="Search"
                    className="mr-sm-2"
                  />
                  <Button variant="outline-success">Search</Button>
                </Form>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <h1>{this.state.source.split("_").join(" ")}</h1>
          <div className="d-flex flex-wrap justify-content-center">
            {this.renderMovieCards()}
          </div>
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
