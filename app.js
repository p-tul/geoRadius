const Data = './data.json'
const url = 'https://success.spidergap.com/partners.json'
const settings = {method: 'Get'}

// script init
fetchPartners()
    
// CONSTANTS
const london = {lat: 51.515419, lng: -0.141099} //Londontown
let d = 0 // Search Radius in km
const radiusInput = document.getElementById('radius')

radiusInput.addEventListener('input', function(e) {
    d = this.valueAsNumber
    fetchPartners()
})

// FUNCTIONS
// =========

// Fetch list of partners from supplied URL
function fetchPartners() {
    fetch(Data)
        .then((res) => res.json())
        .then((data) => printNearbyPartners(data))
}

// Calculate the distance between two points
function distance(checkPoint, centerPoint) {
    let radCheckLat = Math.PI * checkPoint.lat/180 // convert lat to Radians
    let radCenterLat = Math.PI * centerPoint.lat/180 // convert lat to Radians
    let theta = checkPoint.lng - centerPoint.lng // find theta value
    let radTheta = Math.PI * theta/180 // convert theta to Radians
    let dist = Math.sin(radCheckLat) * Math.sin(radCenterLat) + Math.cos(radCheckLat) * Math.cos(radCenterLat) * Math.cos(radTheta) // trig function
    if (dist > 1) {
        dist = 1
    }
    dist = Math.acos(dist) //
    dist = dist * 180/Math.PI //
    dist = dist * 60 * 1.1515 //
    dist = dist * 1.609344 // convert to km
    dist = dist.toFixed(1)
    return dist
}

// Convert GeoData from string to number
function strToNum(string) {
    let commaPos = string.indexOf(',')
    let lat = parseFloat(string.substring(0, commaPos))
    let lng = parseFloat(string.substring(commaPos + 1, string.length))
    let output = {lat: lat, lng: lng}
    return output
}

// Create array of partners within given radius
function getNearbyPartners(partners) {
    const nearbyList = []
    partners.map((partner) => {
        partner.offices.map((office) => {
            let org = partner.organization
            let location = strToNum(office.coordinates)
            let distanceBetween = distance(location, london)
            if (distanceBetween <= d) {
                nearbyList.push({ organization: org, address: office.address, distance: distanceBetween }) // add to array
            }
        })
    })
    const sortedNearbyList = nearbyList.sort((a, b) => a.organization.localeCompare(b.organization)); // sort list ASC
    return sortedNearbyList
}

// Loop through results and print to console
function printNearbyPartners(data){
    let list = document.querySelector('#partner-list')
    list.innerHTML = ''
    let nearbyPartners = getNearbyPartners(data)
    nearbyPartners.map((partner) => {
        let tr = document.createElement('tr')
        tr.innerHTML =  '<td>' + partner.organization + '</td>' + 
                        '<td>' + partner.address + '</td>' + 
                        '<td>' + partner.distance + 'Km</td>'
        list.appendChild(tr)
    })
}
