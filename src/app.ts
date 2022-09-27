import axios from 'axios';


// Code goes here!
const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

type GoogleGeocodingResponse = {
    results: {geometry: {location: {lat: number, lng: number}}}[];
    status: 'OK' | 'ZERO_RESULTS';
}

function searchAddressHandler(event: Event){
    event.preventDefault();
    const API_KEY = process.env.SECRET_API; 
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    document.head.append(script);
    const enteredAddress = addressInput.value;
    // send this to API
    axios.get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${API_KEY}`).then(
        response => {
            if (response.data.status !== 'OK') {
                throw new Error('Could not fetch location!')
            }
            const coordinates = response.data.results[0].geometry.location;
            const map = new google.maps.Map(document.getElementById("map")!, {
                center: coordinates,
                zoom: 16,
              });
            new google.maps.Marker({position: coordinates, map: map})
        }
    ).catch(err => {
        alert(err.message);
        console.log(err);
        }
        );

}

form?.addEventListener('submit', searchAddressHandler );