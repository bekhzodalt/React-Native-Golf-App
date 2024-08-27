import { version } from "react/cjs/react.production.min";

const API_URL = 'https://5yjcrgi025.execute-api.us-east-1.amazonaws.com/accupin_dev/';

const getClubListAPI = async (email) => {
    const url =  API_URL + `clubs`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        email_address: email
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

const getRotationListAPI = async (parentCourse, childCourse) => {
    const url =  API_URL + `rotations`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parent_course_name: parentCourse,
            child_course_name: childCourse
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
const checkRotationListAPI = async (parentCourse, childCourse) => {
    const url =  API_URL + `checkrotationlist`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parent_course_name: parentCourse,
            child_course_name: childCourse
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

const getPinListAPI = async (parentCourse, childCourse, rotation, rotationType) => {
    const url =  API_URL + `all-pins`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parent_course_name: parentCourse,
            child_course_name: childCourse,
            rotation: rotation,
            type_id: rotationType
        })
    })
    .then((response) => response.json())
    .then((json) => {
        return json
    })
    .catch((error) => {
        console.log(error);
    });
		
};

const getRotationCoordsAPI = async (parentCourse, childCourse, rotation, rotationType) => {
    const url =  API_URL + `getRotationCoords`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parent_course_name: parentCourse,
            child_course_name: childCourse,
            rotation: rotation,
            type_id: rotationType
        })
    })
    .then((response) => response.json())
    .then((json) => {
        return json
    })
    .catch((error) => {
        console.log(error);
    });
		
};

const getPinLocationAPI = async (parentCourse, childCourse, pinNumber) => {
    const url =  API_URL + `starter-coordinate`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parent_course_name: parentCourse,
            child_course_name: childCourse,
            pin_number: pinNumber
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

const getAccuCaddieAPI = async (parentCourse, childCourse, pinNumber, rotation, rotationType) => {
    const url =  API_URL + `getpinneargreen`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parent_course_name: parentCourse,
            child_course_name: childCourse,
            pin_number: pinNumber,
            rotation: rotation,
            type_id: rotationType
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

const getPlacementAPI = async (parentCourse, childCourse, pinNumber, userLati, userLong, rotation, rotationType) => {
    const url =  API_URL + `compute-paces`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parent_course_name: parentCourse,
            child_course_name: childCourse,
            pin_number: pinNumber,
            user_lat: userLati,
            user_long: userLong,
            rotation: rotation,
            type_id: rotationType
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

const updatePacesAPI = async (parentCourse, childCourse, pinNumber, rotation, rotationType, distance, front, back, left, right, lat, long, getMode, accuracy) => {
    const url =  API_URL + `update-paces-alt`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parent_course_name: parentCourse,
            child_course_name: childCourse,
            pin_number: pinNumber,
            rotation: rotation,
            type_id: rotationType,
            up: back,
            down: front,
            left: left,
            right: right,
            distance: distance,
            lat: lat,
            long: long,
            getMode: getMode,
            accuracy: accuracy
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

const getEmailList = async (parentCourse, childCourse) => {
    const url =  API_URL + `all-emails`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parent_course_name: parentCourse,
            child_course_name: childCourse
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

const getUserType = async (email) => {
    const url =  API_URL + `getusertype`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email_address: email
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

const sendEmail = async (parentCourse, childCourse, rotation, emails, content, isCompare, isHistory) => {
    const url =  API_URL + `send-emails`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parent_course_name: parentCourse,
            child_course_name: childCourse,
            rotation: rotation,
            recipient_emails: emails,
            content: content,
            isCompare:isCompare,
            isHistory: isHistory
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

const addEmails = async (parentCourse, childCourse, emails) => {
    const url =  API_URL + `add-email`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parent_course_name: parentCourse,
            child_course_name: childCourse,
            new_email: emails
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

const sendVisageStatusAPI = async (clubName, courseName, pinNumber, rotation) => {
    const url =  API_URL + `send-email-about-visage`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parent_course_name: clubName,
            child_course_name: courseName,
            pin_number: pinNumber,
            rotation: rotation
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

const checkIsVisageClub = async (clubName, courseName) => {
    const url =  API_URL + `getisvisage`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parent_course_name: clubName,
            child_course_name: courseName
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

const updateActiveRotation = async (clubName, courseName, rotationType, rotationNumber) => {
    const url =  API_URL + `updateactiverotation`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parent_course_name: clubName,
            child_course_name: courseName,
            rotation_type: rotationType,
            rotation_number: rotationNumber
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

const sendConfirmEmailAPI = async (parentCourse, childCourse, rotation, pinNumber, recipientEmails, content, method, emailStr, version, accuracy) => {
    const url =  API_URL + `send-confirm-email-alt`;
    return fetch(url, {
        method: 'POST',
        headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            parent_course_name: parentCourse,
            child_course_name: childCourse,
            rotation: rotation,
            pin_number: pinNumber,
            recipient_emails: recipientEmails,
            content: content,
            method: method,
            email: emailStr,
            version: version,
            accuracy: accuracy
        })
    })
    .then((response) => response.json())
    .then((json) => {
        return json
    })
    .catch((error) => {
        console.log(error);
    });
};
     
export default {
	getClubListAPI,
    getRotationListAPI,
    getPinListAPI,
    getPinLocationAPI,
    getPlacementAPI,
    updatePacesAPI,
    checkRotationListAPI,
    getEmailList,
    sendEmail,
    addEmails,
    getUserType,
    getAccuCaddieAPI,
    getRotationCoordsAPI,
    sendVisageStatusAPI,
    checkIsVisageClub,
    updateActiveRotation,
    sendConfirmEmailAPI
};