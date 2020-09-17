import React, {Component} from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
      term: 'tacos',
      returnedList: [],
      offset: 0,
      currentBusiness: {},
      order: 'asc'
    }
    this.searchLocation = this.searchLocation.bind(this);
    this.searchTermChange = this.searchTermChange.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.viewDetails = this.viewDetails.bind(this);
    this.sortList = this.sortList.bind(this);
    this.closeDetails = this.closeDetails.bind(this);
  }
  searchLocation(event) {
    if(event) {
      event.preventDefault();
      this.setState({
        offset: 0
      });
    }   
    axios.get(`https://colorful-halibut.glitch.me/api/v1/businesses/search?location=${this.state.location}&term=${this.state.term}&offset=${this.state.offset}`).then(response => {
        this.setState(prevState => {
          return {
            returnedList: response.data.businesses,
            offset: prevState.offset + 20
          }
        })
      }).catch(error => {
        this.setState({
          returnedList: ['No Matches Found']
        })
      });
  }
  searchTermChange(event) {
    this.setState({
      location: event.target.value
    })
  }
  nextPage(event) {
     this.searchLocation();
  }
  viewDetails(event) {
    let businessid = event.target.getAttribute('data-businessid') || event.target.closest('li').getAttribute('data-businessid');
    axios.get(`https://colorful-halibut.glitch.me/api/v1/businesses/${businessid}`).then(response => {
        console.log(response.data)
        this.setState({
          currentBusiness: response.data
        })
      }).catch(error => {
        console.log(error)
      });
  }
  closeDetails(event) {
    this.setState({
      currentBusiness: {}
    })
  }
  sortList(event) {
    let newSort = this.state.returnedList;
    if (event.target.getAttribute('data-order') === 'asc') {
      newSort = this.state.returnedList.sort((a, b) => (a.rating > b.rating ? -1 : 1));
    } else {
      newSort = this.state.returnedList.sort((a, b) => (a.rating > b.rating ? 1 : -1));
    }    
    let newOrder = this.state.order === 'asc' ? 'desc' : 'asc'
    this.setState({
      returnedList: newSort,
      order: newOrder
    })
  }

  render() {  
      let listitems = this.state.returnedList.map(item => {
         return <li className="listitem" key={item.id} data-businessid={item.id} onClick={this.viewDetails}><span className="image"><img src={item.image_url} alt={item.name} /></span><span className="details"><h2>{item.name} - {item.rating}</h2><p className="address">{item.location.display_address[0]}<br />{item.location.display_address[1]}</p></span></li>
      });
    
    return (
      <div className="App">
        <header className="App-header">
          <h1>Get your tacos here!</h1>
          <form onSubmit={this.searchLocation}>
            <input type="text" placeholder="Enter Location (eg San Francisco, 01234, Texas, RI)" name="searchterm" value={this.state.location} onChange={this.searchTermChange} />
            <input type="submit" value="Search" />
          </form>         
        </header>
        <main>
            <section id="returnedList">
              {this.state.returnedList.length > 0 &&
                <section className="sorting">
                    <div onClick={this.sortList} data-order={this.state.order}>Sort</div>
                    <button className="next" onClick={this.nextPage}>Next Page</button>
                </section>
              }
              <ul>
                  {listitems}
              </ul>
            </section>
            {this.state.currentBusiness.id && 
              <section id="businessDetails">
                <span className="close" onClick={this.closeDetails}>Close</span>
                <img src={this.state.currentBusiness.image_url} alt={this.state.currentBusiness.name}/>
                <h1>{this.state.currentBusiness.name}</h1>
                <p>{this.state.currentBusiness.location.display_address[0]}</p>
                <p>{this.state.currentBusiness.location.display_address[1]}</p>
                <a href="`tel: ${item.phone}`">{this.state.currentBusiness.phone}</a>
                <a href={this.state.currentBusiness.url}>Website</a>
              </section>
            }
        </main>
      </div>
    );
  }
}

export default App;
