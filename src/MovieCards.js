import React, { Component } from "react";
import { Button, Card, Accordion } from "react-bootstrap";

export default class MovieCards extends Component {
  render() {
    return this.props.filtered.map(movie => {
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
}
