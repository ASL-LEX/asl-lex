
// object that will contain refrences to dom elements
const domObjs = {
    mainLeft: document.getElementById("main-left"),
    leftSideBar: document.getElementById("left-side"),
    tabContent: document.getElementsByClassName("tab-content"),
    tabLinks: document.getElementsByClassName('tab-links'),
};


// handling of the left sidebar
let openLeftSideBar = () => {
    // get the left side bar dom object
    domObjs.leftSideBar.style.width = '250px';
    domObjs.mainLeft.style.marginLeft = '250px';
};

// handling of the right sidebar
let closeLeftSideBar = () => {
    domObjs.leftSideBar.style.width = '0';
    domObjs.mainLeft.style.marginLeft = '0';
};

// handling search tab
let openTab = (evt, content) => {
    let tabContent, tabLinks;
    tabContent = domObjs.tabContent;

    //
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = 'none';
    }

    tabLinks = domObjs.tabLinks;

    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    document.getElementById(content).style.display = "block";
    evt.currentTarget.className += " active";
};

