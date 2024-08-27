const API_URL = 'https://vcc.accupin.com/api/';

const updateVisageAPI = async (parentCourse, childCourse,	pinNumber, rotation, rotationType, rotationName, distance, front,	back, left, right, lati, long ) => {
    const url =  API_URL + `SaveCourseRotationSetsByClub`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            club_name: parentCourse,
            course_name: childCourse,
            pin_number: pinNumber,
            rotation: rotation,
            rotation_set_type: rotationType,
            marker: rotationName,
            up: back,
            down: front,
            left: left,
            right: right,
            distance: distance,
            latitude: lati,
            longitude: long
        })
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
        return json
    })
    .catch((error) => {
        console.log(error);
    });
		
};

const getEdgeXYAPI = async (imageUrl, imageWidth, imageHeight, pinX, pinY) => {
    const url =  API_URL + `getClubImageEdge`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: imageUrl,
            width: imageWidth,
            height: imageHeight,
            x: pinX,
            y: pinY
          
        })
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
        return json
    })
    .catch((error) => {
        console.log(error);
    });
		
};

const getActiveRotationAPI = async (clubName, courseName) => {
    const url =  API_URL + `getActiveRotation`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            club_name: clubName,
            course_name: courseName          
        })
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
        return json
    })
    .catch((error) => {
        console.log(error);
    });
		
};

const sendHistoryEmailAPI = async (clubName, courseName, emails, content) => {
    const url =  API_URL + `sendSubscriptionEmails`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parent_course_name: clubName,
            child_course_name: courseName,
            recipient_emails: emails,
            content: content
        })
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
        return json
    })
    .catch((error) => {
        console.log(error);
    });
		
};

const getConfirmGPSAPI = async (clubName, courseName, rotationType, rotation, pinNumber, marker) => {
    const url =  API_URL + `getCourseRotationPositionsByClubPin`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            club_name: clubName,
            course_name: courseName,
            rotation_type: rotationType,
            rotation_number: rotation,
            pin_number: pinNumber,
            marker: marker
        })
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
        return json
    })
    .catch((error) => {
        console.log(error);
    });
		
};
     
export default {
	updateVisageAPI,
    getEdgeXYAPI,
    getActiveRotationAPI,
    sendHistoryEmailAPI,
    getConfirmGPSAPI
};