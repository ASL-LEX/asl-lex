console.log("from user-interface js");

// object that will contain refrences to dom elements
const domObjs = {
    mainLeft: document.getElementById("main-left"),
    mainRight: document.getElementById("main-right"),
    leftSideBar: document.getElementById("left-side"),
    rightSideBar: document.getElementById("right-side"),
}


// handling of the left sidebar
let openLeftSideBar = () => {
    // get the left side bar dom object
    domObjs.leftSideBar.style.width = '250px';
    domObjs.mainLeft.style.marginLeft = '250px';
}

// handling of the right sidebar
let closeLeftSideBar = () => {
    domObjs.leftSideBar.style.width = '0';
    domObjs.mainLeft.style.marginLeft = '0';
}

let openRightSideBar = () => {
    // get the right side bar dom object
    domObjs.rightSideBar.style.width = '250px';
    domObjs.mainRight.style.marginRight = '250px';
}

let closeRightSideBar = () => {
    // get the right side bar dom object
    domObjs.rightSideBar.style.width = '0';
    domObjs.mainRight.style.marginRight = '0';
}