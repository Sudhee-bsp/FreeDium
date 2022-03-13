import React, { Component } from "react";
import Axios from "axios";
import moment from "moment";
import c from "./SingleBlog.module.css";
import Spinner from "../Spinner/Spinner";

export class SingleBlog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      singlePost: {},
      titleid:
        props.location.pathname +
        (props.location.search ? props.location.search : ""),
      // titleid: props.location.pathname.replace(/[^\w\s]/gi, ""),
      avatar: "",
      profileLink: "",
      error: null,
      isloading: true,
    };
  }

  mediumURL =
    "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@" +
    localStorage.getItem("usernameid");

  componentDidMount() {
    Axios.get(this.mediumURL)
      .then((data) => {
        const avatar = data.data.feed.image;
        const profileLink = data.data.feed.link;
        const res = data.data.items;
        const posts = res.filter((item) => item.categories.length > 0);

        for (let i in posts) {
          const title = "/" + posts[i].title;

          let tit = title;
          tit = tit.replace(/[^\w\s]/gi, "");

          let statetit = this.state.titleid;
          statetit = statetit.replace(/[^\w\s]/gi, "");

          console.log(tit);
          console.log(statetit);

          if (tit === statetit) {
            let post = posts[i];
            console.log("Inside post", post);
            this.setState((p) => ({
              singlePost: post,
              avatar: avatar,
              profileLink: profileLink,
              isloading: false,
            }));
          }
        }
      })
      .catch((e) => {
        this.setState({ error: e.toJSON() });
        console.log("errrrrr");
        console.log(e);
      });
  }

  render() {
    let post;
    if (this.state.singlePost) {
      post = (
        <>
          <h2>{this.state.singlePost.title}</h2>
          <div className={c.avatar}>
            <a
              href={this.state.profileLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                src={this.state.avatar}
                alt="profile"
                width="75"
                height="75"
              />
            </a>

            <a
              href={this.state.profileLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              <p>{this.state.singlePost.author}</p>
            </a>
            <p>
              {moment(this.state.singlePost.pubDate).format("MMM Do, YYYY")}
            </p>
          </div>

          <div
            className={c.content}
            dangerouslySetInnerHTML={{ __html: this.state.singlePost.content }}
          ></div>

          <div>
            TAGS:{"  "}
            <span class="badge badge-info">
              {this.state.singlePost.categories}
            </span>
          </div>
        </>
      );
    }
    if (this.state.isloading) {
      post = <Spinner />;
    }
    if (this.state.error) {
      let error = this.state.error.code
        ? this.state.error.code
        : this.state.error.name;
      let errorMsg = this.state.error.message;
      post = (
        <>
          <h2 className="red center1">{error}</h2>
          <p className="errorMessage center1">{errorMsg}</p>
        </>
      );
    }

    return <div className={`container ${c.center} mt-4 mb-5`}>{post}</div>;
  }
}

export default SingleBlog;
