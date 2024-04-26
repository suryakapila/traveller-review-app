import './App.css';
import {useState, useEffect} from 'react';
import {Map, NavigationControl, Marker, Popup} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/Place';
import StarIcon from '@mui/icons-material/Star';
import {format} from 'timeago.js';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const pinAddSuccess=() =>{
  toast.success("Pin added successfully!")
}

const pinAddFail = () =>{
  toast.error("Failed to add pin")
}

const userNotLoggedIn = () =>{
  toast.error('You need to be logged in to add a pin');
}

const userLoggedOut = (user) =>{
  toast.warning(`User ${user} logged out successfully`);
}

function App() {
  const myStorage = window.localStorage;
  const[currentUser, setCurrentUser] = useState(myStorage.getItem('currentUser'));
  const[showRegister, setShowRegister] = useState(false);
  const[showLogin, setShowLogin] = useState(false);

  const [pins, setPins] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const [viewPort, setViewPort] = useState({
    latitude: 17,
    longitude: 78,
    zoom: 8,
  });
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [rating, setRating] = useState(1);

  useEffect(() => {
    const user = myStorage.getItem('user');
    if (user) {
    setCurrentUser(JSON.parse(user));
    }
    const getPins = async () => {
        try{
          const response = await axios.get('/pins/');
          setPins(response.data);
        }catch(e){
          console.log(e);
        }
    }

    getPins();
  }
  , []);

  function handleMarkerClicked(id, lat, long){
    setCurrentPlaceId(id);
    setViewPort({...viewPort, latitude: lat, longitude: long});
  }

  const handleAddPin = (e) => {
    console.log(e);
    let lat = e.lngLat.lat;
    let lng = e.lngLat.lng;
    setNewPlace({
      latitude: lat,
      longitude: lng,
    });
  }

  const handleSubmit = async (e) => {
  //tobe implemented
    e.preventDefault();
    const newPin = {
      userName: currentUser,
      title: title,
      desc: desc,
      rating: rating,
      latitude: newPlace.latitude,
      longitude:newPlace.longitude ,
    };
    try{
      if(!currentUser){
        //produce error message
        userNotLoggedIn();
      }
      const response = await axios.post('/pins/', newPin);
      pinAddSuccess();
      setPins([...pins, response.data]);
      setNewPlace(null);
      setRating(1);
      setTitle('');
      setDesc('');
    } catch(e){
      //notify error
      pinAddFail();
      console.log(e);
    }
  }

  const handleLogout = () => {
    myStorage.removeItem('user');
    userLoggedOut(currentUser);
    setCurrentUser(null);
  }

  return (
    <div>
     <Map
     container={'map'}
     projection={'globe'}
     initialViewState={{viewPort}}
     mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
     style={{width: '100vw', height: '100vh'}}
     mapStyle='mapbox://styles/suryakapila/clvevdhod00p101o0doprhv0o'
     onDblClick={handleAddPin}
     >
      <ToastContainer
      position='top-left'
      theme='dark'
      autoClose={3000}
      />
      <NavigationControl />
      {
        pins.map(pin => (
        <>
          <Marker
            longitude={pin.longitude}
            latitude={pin.latitude}
            anchor = 'center'
          >
            <LocationOnIcon
            className='icon'
            onClick={() => handleMarkerClicked(pin._id, pin.latitude, pin.longitude)}
            style={{fontSize: visualViewport.zoom * 2, color: pin.userName === currentUser ? 'tomato' : 'slateBlue'}}
            />
          </Marker>
          {
            pin._id === currentPlaceId && (
              <Popup
              longitude = {pin.longitude}
              latitude = {pin.latitude}
              closeOnClick = {false}
              closeOnMove = {false}
              onClose={() => setCurrentPlaceId(null)}
              anchor = 'left'
              >
                <div className='card'>
                  <label>Place</label>
                  <h4 className='place'>{pin.title}</h4>
                  <label>Review</label>
                  <h4 className='desc'>{pin.desc}</h4>
                  <label>Rating</label>
                  <div className='stars'>{Array(pin.rating).fill(<StarIcon className='star'/>)}</div>
                  <label>Information</label>
                  <div className='info'>
                    <span className='username'>Created by <b>{pin.userName}</b></span>
                    <span className='date'>{format(pin.updatedAt) }</span>
                  </div>
                </div>

              </Popup>
            )
          }

        </>
        ))
      }
      {
        newPlace && (
            <Popup
            latitude = {newPlace.latitude}
            longitude = {newPlace.longitude}
            closeOnClick={false}
            closeOnMove={false}
            onClose={() => setNewPlace(null)}
            anchor = 'left'
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input placeholder='Enter a title...'
                  onChange={(e)=> setTitle(e.target.value)} />

                  <label>Review</label>
                  <textarea placeholder='Say us something about this place...'
                  onChange={(e)=> setDesc(e.target.value)} />

                  <label>Rating</label>
                  <select onChange={(e)=> setRating(e.target.value)}>
                    <option value='1'>1</option>
                    <option value='2'>2</option>
                    <option value='3'>3</option>
                    <option value='4'>4</option>
                    <option value='5'>5</option>
                  </select>

                  <button className='submitButton' type='submit' >Add Pin!</button>
                </form>
              </div>

            </Popup>
          )
      }
     </Map>

     <div className='footer'>
       <div className='footerDown'>
        {
            currentUser ? (
              <button className='button logout' onClick={handleLogout}>Logout</button>
            ) : (
              <div className='buttons'>
                <button className='button login' onClick={()=>setShowLogin(true)}>Sign In</button>
                <button className='button register' onClick={()=>setShowRegister(true)}>Sign Up</button>
              </div>
            )
        }
      </div>
     </div>

    {showRegister && <Register setShowRegister={setShowRegister} />}
    {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}
    </div>
  );
}

export default App;
