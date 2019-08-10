import React from "react";
import { CardTitle, Row, Col } from "reactstrap";
// plugin that creates slider
import Slider from "D:/Learning/CoderSchool/imdb-clone/node_modules/nouislider";

class Example extends React.Component {
  onchange = () => {
    Slider.noUiSlider.on("change.one", function() {
      console.log(111111111111);
    });
  };
  componentDidMount() {
    var year = this.refs.year;
    var rating = this.refs.rating;
    Slider.create(year, {
      start: [1850, 2020],
      connect: [false, true, false],
      step: 1,
      range: { min: 1850, max: 2020 }
    });
    Slider.create(rating, {
      start: [0, 10],
      connect: [false, true, false],
      step: 1,
      range: { min: 0, max: 10 }
    });
  }
  render() {
    return (
      <Row>
        <Col xs={12} md={12}>
          <h4 className="title">Year</h4>
          <div className="d-flex justify-content-around">
            <small>1850</small>
            <div className="slider slider-success" ref="year" />
            <small>2020</small>
          </div>
          <br />
          <h4 className="title">Rating</h4>
          <div className="d-flex justify-content-around">
            <small>0</small>
            <div className="slider slider-success" ref="rating" />
            <small>10</small>
          </div>
        </Col>
      </Row>
    );
  }
}

export default Example;
