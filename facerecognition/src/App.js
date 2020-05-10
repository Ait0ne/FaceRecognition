import React, { Fragment } from 'react';
import Navigation from './components/Navigation/navigation';
import Logo from './components/Logo/logo';
import ImageLinkForm from './components/ImageLinkForm/imagelinkform';
import Rank from './components/Rank/rank.js';
import Particles from 'react-particles-js';
import Clarifai from  'clarifai';
import './App.css';
import FaceRecognition from './components/FaceRecognition/facerecognition.js';
import SignIn from './components/SignIn/signin';
import Register from './components/Register/register';

const app = new Clarifai.App ({
  apiKey: '56ffb22395f9404a91007ecd47b1c959'
});


const pars = {
  particles: {
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5,
        
      }
    },
  }
}
const initialstate = {
  input: '',
  imageUrl: '',
  box: {},
  route:'signin',
  isSignedIn: false,
  user: {
    id: '',
    name:'',
    email: '',
    entries: 0,
    joined: ''
  }
}
class App extends React.Component {
  constructor() {
    super();
    this.state = initialstate
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }     
    })
  }


  calculateFaceLocation = (data) => {
    const clarifyFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifyFace.left_col * width,
      topRow: clarifyFace.top_row *height,
      rightCol: width - clarifyFace.right_col * width,
      bottomRow: height-clarifyFace.bottom_row * height
    }
  }



  displayFaceBox = (box) => {
    this.setState({box: box})
  }


  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    console.log(this.state.input)
    app.models.predict(Clarifai.FACE_DETECT_MODEL,this.state.input)
    .then(response => {
      if (response) {
        fetch('http://localhost:8000/image',{
          method: 'put',
          headers: {'Content-type': 'application/json'},
          body: JSON.stringify({
              id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
      }
      this.displayFaceBox(this.calculateFaceLocation(response));


    })
    .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signout' ) {
      this.setState(initialstate)
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState ({route: route})
  }


  render() {
    return (
      <div className="App">
        <Particles params={pars} className='particles'/>
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
        <Logo />
        { this.state.route === 'signin'|| this.state.route === 'signout' 
        ? <Fragment>
            <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
          </Fragment>
        :( this.state.route === 'home' 
        ?
        <Fragment>
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
        </Fragment>
        :<Fragment>
          <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
        </Fragment>
        )}

      </div>
    );
  }
}

export default App;



      // /* <Logo />
      // <ImageLinkForm />
      // <FaceRecognition /> */