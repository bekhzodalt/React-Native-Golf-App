export function getDistance (
    lati1, long1, lati2, long2
) {
    const step1 = degsToRads(90 - lati2);
    const step2 = Math.cos(step1);
    const step3 = degsToRads(90-lati1);
    const step4 = Math.cos(step3);
    const step5 = step4 * step2;
    const step6 = degsToRads(90 - lati2);
    const step7 = Math.sin(step6);
    const step8 = degsToRads(90 - lati1);
    const step9 = Math.sin(step8);
    const step10 = step9 * step7;
    const step11 = degsToRads(long2 - long1);
    const step12 = Math.cos(step11);
    const step13 = step12 * step10;
    const step14 = step13 + step5;
    const step15 = Math.acos(step14);
    const step16 = step15 * 6371;
    const step17 = step16 / 1.609;
    const step18 = step17 * 1760;

    return step18;
}

export function degsToRads (deg){
    return (deg * Math.PI) / 180.0;
}

export function radsToDegs (rad){
    return rad * 180 / Math.PI;
}

export const getAccrossDown =(pinItem, courseData) => {
    const m8 = getM8(pinItem, courseData);			
    const n8 = getN8(pinItem, courseData);			
    const o8 = getO8(courseData, n8);			
    const pinWidth = getPinWidth(o8, m8);			
    const pinHeight = getPinHeight(o8, m8);
    
    const percentAccross = getPecentAccross(courseData, pinWidth);
    const percentDown = getPercentDown(courseData, pinHeight);

    return {percentAccross, percentDown}
}

const getM8 = (historyItem, courseData) => {
    const combined_lat = Number(historyItem.lat);
    const combined_long = Number(historyItem.long);

    const ul_lat = parseFloat(courseData.ul_lat);
    const ul_long = parseFloat(courseData.ul_long);

    let step1 = degsToRads(90 - ul_lat);
    let step2 = Math.cos(step1);
    let step3 = degsToRads(90 - combined_lat);
    let step4 = Math.cos(step3);
    let step5 = step4 * step2;
    let step6 = degsToRads(90 - ul_lat);
    let step7 = Math.sin(step6);
    let step8 = degsToRads(90 - combined_lat);
    let step9 = Math.sin(step8);
    let step10 = step9 * step7;
    let step11 = degsToRads(ul_long - combined_long);
    let step12 = Math.cos(step11);
    let step13 = step12 * step10;
    let step14 = step13 + step5;
    let step15 = Math.acos(step14);
    let step16 = step15 * 6371;
    let step17 = step16 / 1.609;
    let step18 = step17 * 1760;

    return step18;
}

const getN8 = (historyItem, courseData) => {
    const combined_lat = Number(historyItem.lat);
    const combined_long = Number(historyItem.long);

    const ul_lat = parseFloat(courseData.ul_lat);
    const ul_long = parseFloat(courseData.ul_long);

    let step1 = degsToRads(combined_lat)
    let	step2 = Math.cos(step1)
    let	step3 = degsToRads(ul_lat)
    let	step4 = Math.sin(step3)
    let	step5 = step4 * step2
    let	step6 = degsToRads(combined_lat)
    let	step7 = Math.sin(step6)
    let	step8 = degsToRads(ul_lat)
    let	step9 = Math.cos(step8)
    let	step10 = step9 * step7
    let	step11 = degsToRads(ul_long - combined_long)
    let	step12 = Math.cos(step11)
    let	step13 = step12 * step10
    let	step14 = step5 - step13
    let	step15 = degsToRads(ul_long - combined_long)
    let	step16 = Math.sin(step15)
    let	step17 = degsToRads(ul_lat)
    let	step18 = Math.cos(step17)
    let	step19 = step18 * step16
    let	step20 = Math.atan2(step19, step14)
    let	step21 = radsToDegs(step20)
    let	step22 = step21 % 360

    return step22
    
}

const getO8 = (courseData, n8) => {
    const orientation = parseFloat(courseData.orientation);
    const ret = (n8 + orientation) % 360;

    return ret;
}

const getPinWidth = (o8, m8) => {
    let step1 = degsToRads(o8)
    let step2 = Math.sin(step1)
    let step3 = step2 * m8
    let step4 = Math.abs(step3)

    return step4;
}

const getPinHeight = (o8, m8) => {
    let step1 = degsToRads(o8)
    let step2 = Math.cos(step1)
    let step3 = step2 * m8
    let step4 = Math.abs(step3)

    return step4;
}

const getPecentAccross = (courseData, pinWidth) => {
    let val = Math.round(pinWidth * 100 / parseFloat(courseData.image_width_yards)) / 100;
    return val;
}

const getPercentDown = (courseData, pinHeight) => {
    let val = Math.round(pinHeight  * 100 / parseFloat(courseData.image_height_yards)) / 100; 
    return val;
}