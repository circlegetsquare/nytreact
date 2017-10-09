import React, { Component } from "react";
import DeleteBtn from "../../components/DeleteBtn";
import SaveBtn from "../../components/SaveBtn";
import API from "../../utils/API";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Input, FormBtn } from "../../components/Form";
import helpers from '../../utils/helpers';

class Books extends Component {
  state = {
    books: [],
    title: "",
    url: "",
    results: [],
    searchTerm: ""
  };

  // LIFECYCLE EVENT
  componentDidMount() {
    this.loadBooks();
  }

  // EVENTS
    handleSaveClick = (item) => {
      console.log('save button clicked');
      helpers.postSaved(item.headline.main, item.web_url, item.pub_date).then(function() {
        console.log(item);
      }).then(this.loadBooks())
    }

  loadBooks = () => {
    API.getBooks()
      .then(res =>
        this.setState({ books: res.data, title: "", url: "" })
      )
      .catch(err => console.log(err));
  };

  deleteBook = id => {
    API.deleteBook(id)
      .then(res => this.loadBooks())
      .catch(err => console.log(err));
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.term) {
      helpers.runQuery(this.state.term, this.state.start, this.state.end)
      .then((data) => {
        this.setState({ results: data.docs });
      });
    }
  };

  //LIFECYCLE EVENT
  render() {
    
    return (
      <Container fluid>
        <Row>
          <form>
            <Input
              value={this.state.term}
              onChange={this.handleInputChange}
              name="term"
              placeholder="Keyword (required)"
            />
            <Input
              value={this.state.start}
              onChange={this.handleInputChange}
              name="start"
              placeholder="Start Year"
            />
            <Input
              value={this.state.end}
              onChange={this.handleInputChange}
              name="end"
              placeholder="End Year"
            />
            <FormBtn
              disabled={!(this.state.term)}
              onClick={this.handleFormSubmit}
            >
              Search
            </FormBtn>
          </form>
          <hr />
        </Row>
      
        <Row>
          <Col size="md-6">
            <div>
              <h3>Search Results</h3>
            </div>                     
              {this.state.results.length ? (
              <List>
                {this.state.results.map(result => (
                  <ListItem key={ result._id }>
                    <div><strong><a href={ result.web_url } target="blank"> { result.headline.main } </a></strong>
                      <SaveBtn onClick={() => this.handleSaveClick(result)} />
                    </div> 
                  </ListItem>
                ))}
                
                </List>
            ) : (
              <h5>No results to display: enter search terms above find articles</h5>
            )}
          </Col>

          <Col size="md-6">
            <div>
              <h3>Saved Articles</h3>
            </div>
            {this.state.books.length ? (
              <List>
                {this.state.books.map(book => (
                  <ListItem key={book._id}>
                      <strong><a href={ book.url } target="blank"> { book.title } </a></strong>
                    <DeleteBtn onClick={() => this.deleteBook(book._id)} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <h5>No saved articles to display</h5>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Books;

