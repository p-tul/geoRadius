const https = require('https')
const url = 'https://success.spidergap.com/partners.json'
const settings = {method: 'Get'}

// script init
fetchPartners()
    
// CONSTANTS
const london = {lat: 51.515419, lng: -0.141099} //Londontown
const d = 100 // Search Radius in km


// FUNCTIONS
function fetchPartners() {
    https.get(url, (res) => {
        let body = ""

        res.on("data", (chunk) => {
            body += chunk
        })

        res.on("end", () => {
            try {
                let json = JSON.parse(body)
                printNearbyPartners(json)
            } catch (error) {
                console.error(error.message)
            }
        })
    }).on("error", (error) => {
        console.error(error.message)
    })
}

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

function strToNum(string) {
    let commaPos = string.indexOf(',')
    let lat = parseFloat(string.substring(0, commaPos))
    let lng = parseFloat(string.substring(commaPos + 1, string.length))
    let output = {lat: lat, lng: lng}
    return output
}

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

function printNearbyPartners(data){
    const nearbyList = []; // RESULT
    let nearbyPartners = getNearbyPartners(data)
    console.log(`Partners within ${d}km of our office in London`)
    console.log('-------------')
    nearbyPartners.map((partner) => {
        console.log('-------------')
        console.log('')
        console.log(`Organization: ${partner.organization}`)
        console.log(`Address: ${partner.address}`)
        console.log(`Distance: ${partner.distance}km`)
        console.log('')
    })
}
