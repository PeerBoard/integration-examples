import React from 'react';
import { createForum } from '@peerboard/core';

// Settings -> Hosting -> Board ID
const boardID = '<BOARD ID>';
// Settings -> Hosting -> Path Prefix
const prefix = '<PATH PREFIX>';

class ForumPage extends React.Component {

  containerRef = React.createRef();

  state = {
    error: null,
    forumReady: false,
  };

  async initForum() {
    // Get the token from your backend
    const jwtToken = await http.generateBearerToken();
    
    const options = {
      prefix,
      jwtToken,
      
      // in px
      minHeight: window.innerHeight - YOUR_HEADER_HEIGHT - YOUR_FOOTER_HEIGHT,
      
      // You can remove the loaded and forum will be showed to the user
      onReady: () => this.setState({
        forumReady: true,
      }),
  
      onFail: () => this.setState({
        error: "Failed to load forum",
      }),
      
      // Customize your title
      onTitleChanged: (title) =>
        window.document.title = "Community: " + title,
    };
    
    createForum(boardID, this.containerRef.current, options);
  }

  componentDidMount() {
    this.initForum().catch(err => this.setState({
      error: err.message,
    }));
  }

  render() {
    return (
      <div>
        {/* Show error, loader or render the forum */}
        {this.state.error && (this.state.error)}
        {!this.state.forumReady && 'Show a spinner...'}
        <div ref={this.containerRef}></div>
      </div>
    );
  }
}

