import React, { Component } from "react";
import Axios from "axios";
import ShowBlog from "../ShowBlog/ShowBlog";
// import Spinner from "../Spinner/Spinner";

export class Blog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: {
        ptitle: "",
        name: "",
        avtar: "",
        profileurl: "",
      },
      item: [],
      isloading: true,
      error: "",
      username: "",
    };
  }

  onChange = (e) => {
    const { value } = e.target;
    this.setState({
      username: value,
      error: "",
    });
  };

  handleButtonClicked = (e) => {
    e.preventDefault();
    this.search(this.state.username);
    localStorage.setItem("usernameid", this.state.username);
  };

  search = (username) => {
    const mediumURL = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`;
    console.log(username);
    console.log(mediumURL);

    Axios.get(mediumURL)
      .then((data) => {
        // console.log(data.data)
        const avatar = data.data.feed.image;
        const profileLink = data.data.feed.link;
        const res = data.data.items;
        const posts = res.filter((item) => item.categories.length > 0);

        const title = data.data.feed.title;

        this.setState(
          (pre) => ({
            profile: {
              ...pre.profile,
              ptitle: title.replace(/[^\w\s]/gi, ""),
              profileurl: profileLink,
              avtar: avatar,
            },
            item: posts,
            isloading: false,
          }),
          () => {
            console.log(this.state);
          }
        );
        console.log(data, res);
      })
      .catch((e) => {
        // this.setState({ error: e.toJSON() });
        this.setState({ error: e });
        console.log(e);
      });
  };

  componentDidMount() {}

  render() {
    let post;

    if (this.state.item) {
      post = this.state.item.map((post, index) => (
        <ShowBlog key={index} {...post} {...this.state.profile} {...index} />
      ));
    }
    if (this.state.isloading) {
      // post = <Spinner />;
      post = (
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <center>
                    <h2>Read Free Blogs</h2>
                  </center>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (this.state.error) {
      // let error = this.state.error.code
      //   ? this.state.error.code
      //   : this.state.error.name;
      // let errorMsg = this.state.error.message;
      // post = (
      //   <>
      //     <h2 className="red center1">{error}</h2>
      //     <p className="errorMessage center1">{errorMsg}</p>
      //   </>
      // );
      post = (
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <center>
                    <h2>No username found!</h2>
                  </center>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-6 offset-md-3 mb-4">
            <div className="form-group">
              <label htmlFor="username">
                <h3>Enter Medium username</h3>
              </label>

              <input
                type="text"
                className="form-control"
                name="username"
                placeholder="username"
                value={this.state.username}
                onChange={this.onChange}
              />
            </div>
            <div className="form-group">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={this.handleButtonClicked.bind(this)}
              >
                Search
              </button>
            </div>
          </div>

          {post}
        </div>
      </div>
    );
  }
}

export default Blog;
