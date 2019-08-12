// import React from "react";
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
// import YouTube from "react-youtube";

// class ModalExample extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       modal: false
//     };

//     this.toggle = this.toggle.bind(this);
//   }

//   toggle() {
//     this.setState(prevState => ({
//       modal: !prevState.modal
//     }));
//   }

//   getTrailerKey = async () => {
//     const response = await fetch(`https://api.themoviedb.org/3/movie/${
//       this.props.id
//     }/videos?api_key=4c5b4a5e627748117d4b24082672a9b4
//     `);
//     const jsonData = await response.json();
//     // console.log("Hello", jsonData.results[0].key);
//     this.setState({ id: jsonData.results[0].key });
//   };

//   componentDidMount() {
//     this.getTrailerKey();
//   }
//   render() {
//     const opts = {
//       height: "390",
//       width: "640",
//       playerVars: {
//         // https://developers.google.com/youtube/player_parameters
//         autoplay: 1
//       }
//     };
//     return <div />;
//   }
// }

// export default ModalExample;
