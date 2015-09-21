const AppRoot = require('./madscience/AppRoot.jsx');
const ProfileList = require('./madscience/ProfileList.jsx');
const ProfilePage = require('./madscience/ProfilePage.jsx');
const Router = require('react-router');
const { Route, Link, DefaultRoute } = require('react-router');

document.addEventListener("DOMContentLoaded", function(event) {
  const root = document.getElementById("app");
  const routes =
    <Route path="/" handler={AppRoot}>
      <DefaultRoute name="profileList" handler={ProfileList} />
      <Route name="profile" path="people/:id" handler={ProfilePage} />
    </Route>;

    Router.run(routes, function(Handler) {
        React.render(<Handler />, root);
    });
});
