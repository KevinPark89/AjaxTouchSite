import React from 'react';
import ReactDOM from 'react-dom';
import { 
    BrowserRouter as Router, 
    Route, Link } from 'react-router-dom';

//Firebase configuration
var config = {
	apiKey: "AIzaSyAWHf99EGK2XIn7cCIw0xascGLmo37qMNQ",
	authDomain: "ajaxtouch-75e4c.firebaseapp.com",
	databaseURL: "https://ajaxtouch-75e4c.firebaseio.com",
	projectId: "ajaxtouch-75e4c",
	storageBucket: "ajaxtouch-75e4c.appspot.com",
	messagingSenderId: "642538945489"
};
firebase.initializeApp(config);

const teamDatabaseRef = firebase.database().ref('/posts');

//Main app component, all content on page is displayed here
class App extends React.Component {
	constructor() {
	    super();
	    this.state = {
	      createEmail: '',
	      createPassword: '',
	      loginEmail: '',
	      loginPassword: '',
	      signedIn: false,
	      postElement: undefined
	    }
	    this.handleChange = this.handleChange.bind(this);
	    this.createUser = this.createUser.bind(this);
	    this.signIn = this.signIn.bind(this);
	    this.signOut = this.signOut.bind(this);
	}
	handleChange(event, field) {
	    const newState = Object.assign({}, this.state);
	    newState[field] = event.target.value;
	    this.setState(newState);
	}
	signOut() {
	    firebase.auth().signOut().then(function(success) {
	    }, function(error) {
	    });
	}
	createUser(event) {
	    event.preventDefault();
	    const email = this.state.createEmail;
	    const password = this.state.createPassword;

	    firebase.auth().createUserWithEmailAndPassword(email, password)
	      .catch((error) => console.log(error.code, error.message));

  	}
  	signIn(event) {
  	    event.preventDefault();
  	    const email = this.state.loginEmail;
  	    const password = this.state.loginPassword;

  	    firebase.auth().signInWithEmailAndPassword(email, password)
  	      .then((success) => {
  	        console.log(`Logged in as ${success.email}`);
  	      }), (error) => {
  	        console.log(error);
  	    }
  	}
	render() {
		const signOutBtn = () => {
	  		if (firebase.auth().currentUser) { 
	  			return (<button className= "signOutButton" onClick={this.signOut}>Sign Out</button>)
	  		}
	  		else {
	  			return <div></div>
	  		}
	  	}
	  	const signInBtn = () => {
	  		if (firebase.auth().currentUser) { 
	  			return <div className="blankSpace"></div>
	  		}
	  		else {
	  			return (<button className="signInButton" onClick={this.signIn}>Sign In</button>)
	  		}
	  	}
	  	const form = () => {
	  		if (firebase.auth().currentUser) { 
	  			return (<BlogPost />)
	  		}
	  		else {
	  			return <div></div>
	  		}
	  	}
	  	const getWriteUp = () => {
		  	if (this.state.postElement !== undefined) {
			  	const postElementArr = [];
			  	let keys = Object.keys(this.state.postElement);
			for (let i = 0; i < keys.length; i++) {
			  	const key = keys[i];
			  	postElementArr.push(this.state.postElement[key]);
			}
			const option = (post, i) => {
			  	return (
			  		<div key={i} className="gameRecaps">
			  			<header>{post.team1} vs. {post.team2}</header>
			  			<p>{post.writeUp}</p>
			  		</div>
			  	);
			}
			const getWriteUp = postElementArr.map(option);
			  	return getWriteUp;
		  	}	
	  	}
    	return (
    		<Router>
	     		<div className="wrapper">
	     			<h1>Ajax Touch Football League</h1>
	     			<div className="nav">
		     			<Link to="/home">Home</Link>
		     			<Link to="/standings">Standings</Link>
	                    <Link to="/scores&schedules">Scores & Schedules</Link>
	                    <Link to="/statistics">Statistics</Link>
	     			</div>
	     			<Route path="/home" />
	     			<Route path="/standings" />
                    <Route path="/scores&schedules" />
                    <Route path="/statistics" />
                    <img className="logoImg" src="../../assets/ATFLlogo.jpg"></img>
 			        <p className="leagueDescription">Ajax Touch Football League, founded in 1977, is a recreational Men’s Touch Football draft league in the Durham Region.</p>
	     	 		<h3>Game Times & Location</h3>
	     	 		<div className="gameTimes">
	     	 			<p>Games are played on Saturday mornings @ Dennis OConnor, 80 Mandrake St, Ajax, ON L1S 5H4</p>
	     	 			<p>Game start times - 9:00 am, 10:30 am, and 12:00 pm.</p>
	     	 			<p>Refer to schedule for specifcs</p>
	     	 		</div>
	     	 		<h3>Game Recaps</h3>
	     	 		{getWriteUp()}
	     	 		<h4>Admin Login</h4>
	     	 		<div className="create-user">
 			          	<form onSubmit={(event) => this.createUser(event)}>
	 			            <input type="text" placeholder="Email" onChange={(event) => this.handleChange(event, "createEmail")}/>
	 			            <input type="password" placeholder="Password" onChange={(event) => this.handleChange(event, "createPassword")}/>
	 			            <button>Create User</button>
 			          	</form>
 			        </div>
	     	 		<div className="sign-in">
	                  	<form onSubmit={(event) => this.signIn(event)}>
	                    	<input className="email" type="text" placeholder="Email" onChange={(event) => this.handleChange(event, "loginEmail")} />
	                    	<input className="password" type="password" placeholder="Password" onChange={(event) => this.handleChange(event, "loginPassword")} />
	                    	{signInBtn()}
	                    	{signOutBtn()}
	                  	</form>
	                </div>
	                {form()}
	     		</div>
	     	</Router>
    	);
	}
	componentDidMount() {
	    firebase.auth().onAuthStateChanged((user) => {
	      if (user) {
	        this.setState({loggedIn: true});
	      } else {
	        this.setState({loggedIn: false});
	      }
	    })
	    firebase.auth().signOut().then(function() {
	      // Sign-out successful.
	    }).catch(function(error) {
	      // An error happened.
	    });
	    teamDatabaseRef.on('value', (snapshot) => {
	      this.setState({postElement: snapshot.val()});
	    });
	
	}
}

//This component houses the different aspects of the blog post. The dropdown menus for the team selection as well
//as the text area for the game recap. This component then pushes our 'posts' up to Firebase to be stored and
//displays the results on the webpage as well.
class BlogPost extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 'tes'
		}

		this.handleSubmit = this.handleSubmit.bind(this);
		}

		handleSubmit(e, info) {
			e.preventDefault();
			teamDatabaseRef.push({team1: info.team1, team2: info.team2, writeUp: info.value});
    		
		}

		render() {
			return (
				<div>
					<WriteUp handleSubmit={this.handleSubmit}/>
				</div>
			);
		}
}


//This component contains items needed to complete a writeup. This writeup is eventually sent to firebase
//via the 'BlogPost' component
class WriteUp extends React.Component {
	constructor(props) {
    	super(props);
   		this.state = {
      		value: 'Game write-up.',
      		team1: 'Dickson Printing',
			team2: 'Dickson Printing'
    	};
    	this.getTeam = this.getTeam.bind(this);
    	this.handleChange = this.handleChange.bind(this);
    	this.handleSubmit = this.handleSubmit.bind(this);
  		}
  		getTeam(event) {
		    this.setState({[event.target.name]: event.target.value});
		}
  		handleSubmit(e) {
  			const bostObj = {
  				value: this.state.value,
  				team1: this.state.team1,
  				team2: this.state.team2
  			}
  			this.props.handleSubmit(e, bostObj);
  		}
	  	handleChange(event) {
	    	this.setState({value: event.target.value});
	  	}

	  	render() {
	    	return (
	      		<form onSubmit={this.handleSubmit}>
		      		<TeamNames 
		      			getTeam={this.getTeam}
		      			team2={this.state.team2}
		      			team1={this.state.team1} />
	        		<label>
	          			<textarea className="teams" value={this.state.value} onChange={this.handleChange} />
	        		</label>
	        		<input className="submitButton" type="submit" value="Submit" />
	      		</form>
	    	);
		}
}

//This component pulls the team names stored in firebase and allows them to be accessed from a dropdown menu
class TeamNames extends React.Component {
	constructor(props) {
		super(props);

		this.state= {
			teams: []
		}
	}
	componentDidMount() {
		firebase.database().ref("/teams").on("value", (snapshot) => {
			this.setState({teams: snapshot.val()});
		});
	}
	  render() {
	  	const option = (team, i) => {
	  		return <option key={i} value={team}>{team}</option>
	  	}
	  	const teamOption = this.state.teams.map(option)
	    return (
	      <div>
		        <label>
			          Pick the two teams that played:
			          <select className="teams" name="team1" value={this.props.team1} onChange={this.props.getTeam}>
			          		{teamOption}
			          </select>
			          <select className="teams" name="team2" value={this.props.team2} onChange={this.props.getTeam}>
			          		{teamOption}
			          </select>
		        </label>
	      </div>
	    );
	}
}

class Standings extends React.Component {
    render() {
        return (
            <div>
                Standings
            </div>
        )
    }
}

class ScoresAndSchedules extends React.Component {
    render() {
        return (
            <div>
                Scores & Schedules
            </div>
        )
    }
}

class Statistics extends React.Component {
    render() {
        return (
            <div>
                Statistics
            </div>
        )
    }
}

class Home extends React.Component {
    render() {
        return (
            <div>
                Home
            </div>
        )
    }
}


ReactDOM.render(<App />, document.getElementById('app'));
