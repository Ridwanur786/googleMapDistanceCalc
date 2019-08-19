
var placeSearch,originautocomplete;
/*var componentForm = {

    street_number:'short_name',
    route:'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};*/

 google.maps.event.addDomListener(window,'load',function initAutocomplete()
{
    originautocomplete = new google.maps.places.Autocomplete((document.getElementById('source')),
    {
        types:['geocode']
    });
originautocomplete.setComponentRestrictions({
    'country': ['us']
});

var destinationautocomplete = new google.maps.places.Autocomplete((document.getElementById('destination')),
    {
        types: ['geocode']
    });
destinationautocomplete.setComponentRestrictions
({
    'country': ['us']
});

   /* function fillInAddress() {
        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();

        for (var component in componentForm) {
            document.getElementById(component).value = '';
            document.getElementById(component).disabled = false;
        }

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                var val = place.address_components[i][componentForm[addressType]];
                document.getElementById(addressType).value = val;
            }
        }
    }*/

function geolocate()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function(position)
        {
         var geolocation =
             {
                 lat: position.coords.latitude,
                 lng: position.coords.longitude
             };
         var circle= new google.maps.Circle({
             center:geolocation,
             radius:position.coords.accuracy
         });
             new google.maps.places.Autocomplete.setBounds(circle,getBounds());
        });

    }
}
});

function calculateDistance()
{
    var origin = document.getElementById('source').value;
    var destination = document.getElementById('destination').value;

    var geocoder = new google.maps.Geocoder();
    var service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
        unitSystem:  google.maps.UnitSystem.IMPERIAL,
        avoidHighways:false,
        avoidTolls:false,
        //avoidFerris: false
    },
        function (response, status) {
        if(status!=google.maps.DistanceMatrixStatus.OK)
        {
            $('#result').html(err);
        }else{
            var originList = response.originAddresses;
            var destinationList = response.destinationAddresses;
            var outputDiv = document.getElementById('result');
            outputDiv.innerHTML = '';
            for (var i = 0; i<originList.length; i++)
            {
                if( results = response.rows[0].elements[0].status==='ZERO_RESULTS')
                {
                    outputDiv.innerHTML+="Better get on the plane.No Driving route found";
                }else
                {
                     results = response.rows[i].elements;
                    for (var j = 0; j < results.length; j++)
                    {
                        outputDiv.innerHTML += originList[i] + '' + 'to'+ '' + destinationList[j] + ':' + results[j].distance.text + '' +'in' + results[j].duration.text + '<br>';
                    }
                }

            }
        }}
        );
}
$(document).ready(function()
{
	$('#source','#destination').on('focus',function()
	{
		geolocate();
	});
	
	$('#btn').on('click',function()
	{
		calculateDistance();
	});
});
