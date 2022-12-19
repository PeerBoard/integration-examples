import React from "react";
import PeerBoard from "@peerboard/core";

function CommunityPage() {
  const container = React.useRef(null);
  const [jwtToken, setJwtToken] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    // Optionally, get the token to seamlessly authenticate the user.
    // Note that this is pseudocode, the exact implementation depends on the http(http, axios, graphql) library and your backend.
    // If you have SSR we suggest to inject the token on page render to improve loading performance.
    const jwtTokenReq = http.post('https://myapp.com/api/secure-create-token-for-peerboard').
      then(res => {
        if (res.statusIsOK()) {
          setJwtToken(res.jwtToken);
          setError(null);
        } else {
          throw new Error(res.error);
        }
      }).
      catch(err => {
        setError(err);
      });

    return function cleanup() {
      // https://dev.to/viclafouch/cancel-properly-http-requests-in-react-hooks-and-avoid-memory-leaks-pd7
      jwtTokenReq.cancel();
    };
  }, []);

  // Run effect on component render
  React.useEffect(() => {
    if (!jwtToken) {
      return;
    }
    setLoading(true);

    // Settings -> Hosting -> Path prefix
    const prefix = PREFIX_FROM_SETTINGS;
    // Settings -> Hosting -> Board ID
    const communityID = BOARD_ID_FROM_SETTINGS;

    const options = {
      jwtToken,
      prefix,

      // Optional. Recommended setting so that the forum container
      // will always occupy all available space
      // replace HEADER_HEIGHT and FOOTER_HEIGHT with your values
      // Check that window is defined for SSR cases
      // By default 80% of the screen height is used.
      minHeight: typeof window !== 'undefined' ?
        window.innerHeight - HEADER_HEIGHT - FOOTER_HEIGHT : undefined,

      // Update your page title according to the forum state
      onTitleChanged: title =>
        window.document.title = "Your app community: " + title,
    };

    // save the promise to use in cleanup
    const promise = PeerBoardSDK.createForum(communityID, container.current, options).
      then(() => {
        // Here you can remove any loading indicators
        setLoading(false);
      }).
      catch(err => {
        // Show error to the user, report to sentry
        setLoading(false);
        setError(err);
      });

    // We're suggesting to do cleanup everything the page dynamically, for example, on component unmount in React
    // We support calling createForum in SSR is safe, in that case null will be returned, so you need to check that
    return function cleanup() {
      promise.then(api => {
        if (api) {
          api.destroy();
        }
      });
    };
  }, [jwtToken]); // Don't forget to specify jwtToken as dependency

  return (
    <div>
      {loading && 'Loading... We suggest using beautiful spinner'}
      {error && <div>Something went wrong. Please try later</div>}
      <div ref={container}></div>
    </div>
  );
}

export default CommunityPage;
