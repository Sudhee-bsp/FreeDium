import React from "react";
import { Switch, Route, HashRouter } from "react-router-dom";

import "./App.css";
import Blog from "./Components/Blog/Blog";
import SingleBlog from "./Components/SingleBlog/SingleBlog";
import Footer from "./Components/Footer/footer";

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Switch>
          <Route path="/:id" exact component={SingleBlog}></Route>
          <Route path="/" exact component={Blog}></Route>
        </Switch>
      </HashRouter>
      <Footer />
    </div>
  );
}

export default App;
