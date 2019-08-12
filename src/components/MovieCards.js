import React, { Component } from "react";
import { Button, Card, Accordion } from "react-bootstrap";

export default class MovieCards extends Component {
  render() {
    return this.props.filtered.map(movie => {
      return (
        <Card style={{ width: "14rem", margin: 10 }}>
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
              <a href="#" className="h4">
                {movie.title} ({movie.release_date.slice(0, 4)})
              </a>
            </Card.Title>
            <p>
              Rating: {movie.vote_average}{" "}
              <i
                class="fa fa-star"
                aria-hidden="true"
                style={{ color: "yellow" }}
              />{" "}
              ({movie.vote_count} votes) <br />
              Popularity: {movie.popularity}
            </p>
            <Accordion>
              <Accordion.Toggle
                as={Button}
                variant="link"
                eventKey="0"
                className="btn-neutral"
              >
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
            <Button className="btn-round btn-success" size="sm">
              Watch
            </Button>
            <Button
              className="m-2 btn-round btn-primary"
              size="sm"
              onClick={() => this.props.toggle(movie.id)}
            >
              Trailer
            </Button>
          </Card.Body>
        </Card>
      );
    });
  }
}
