import React from 'react';
import { createForum } from '@peerboard/core';

// Settings -> Hosting -> Board ID
const boardID = '<BOARD ID>';
// Settings -> Hosting -> Path Prefix
const pathPrefix = '<PATH PREFIX>';

class ForumPage extends React.Component {

  containerRef = React.createRef();

  state = {
    error: null,
    loading: true,
  };

  async createPeerBoard() {
    const jwtToken = await http.post('https://api.myapp.com/create-token-for-peerboard');
    
    const options = {
      jwtToken,

      prefix: pathPrefix,

      // Recommended setting so that the forum container
      // will always occupy all available space
      minHeight: window.innerHeight,

      // Update your page title according to the forum state
      onTitleChanged: title =>
        window.document.title = 'Your title ' + title,
      
      // You can remove the loaded and forum will be showed to the user
      onReady: () => this.setState({
        loading: false,
      }),
  
      onFail: () => this.setState({
        error: "Failed to load forum...",
      }),
    };
    
    createForum(boardID, this.containerRef.current, options);
  }

  componentDidMount() {
    this.createPeerBoard().catch(err => this.setState({
      error: err.message,
    }));
  }

  render() {
    return (
      <div>
        {this.state.error && this.state.error}
        {this.state.loading && 'Loading...'}
        <div ref={this.containerRef}></div>
      </div>
    );
  }
}

