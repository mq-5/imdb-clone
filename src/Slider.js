import React from "react";
import { Row, Col } from "reactstrap";
// plugin that creates slider
import Slider from "D:/Learning/CoderSchool/imdb-clone/node_modules/nouislider";

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    var item = document.getElementById(this.props.name);
    let slider = Slider.create(item, {
      start: [this.props.min, this.props.max],
      connect: [false, true, false],
      step: 1,
      range: { min: this.props.min, max: this.props.max }
    });
    this.setState({ slider: slider });
  }

  render() {
    console.log("==============", this.state.slider && this.state.slider.get());
    return (
      <Row>
        <Col xs={12} md={12}>
          <h4 className="title">{this.props.name}</h4>
          <p className="small font-italic text-center">
            From{" "}
            {this.state.slider &&
              this.state.slider
                .get()
                .map(value => value.slice(0, -3))
                .join(" to ")}
          </p>
          <div className="d-flex justify-content-around">
            <small>{this.props.min}</small>
            <div
              className="slider slider-primary"
              id={this.props.name}
              onClickCapture={() => {
                this.state.slider.on("change", (str, handler, values) => {
                  this.props.setValue({ min: values[0], max: values[1] });
                });
              }}
            />
            <small>{this.props.max}</small>
          </div>
        </Col>
      </Row>
    );
  }
}

export default Example;
