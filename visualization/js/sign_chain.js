//let signProperties = [];



function createQueryString(varStr,queryArray) {

    queryString = "?"+varStr + "=" + encodeURIComponent(JSON.stringify(queryArray));
    return queryString;
}

function parseQueryStringFromURL(varStr,urlString) {
    // create a URL object from the string
    const url = new URL(urlString);

    // get the query string
    const receivedQueryString = url.searchParams.get(varStr);

    // convert the query string to an array
    const receivedIds = JSON.parse(receivedQueryString);

    return receivedIds;

}


const sign_prop_promise = $.getJSON('data/sign_props.json', function (properties) {

    let videoHeight = 300;
    let videoWidth = 400;

    signProperties = properties
    //console.log(signProperties)

    signsFromURL = parseQueryStringFromURL("signs",window.location.href)
    
    var arrayLength = signsFromURL.length;

    for (var i = 0; i < arrayLength; i++) {
        let obj = signProperties.find(o => o.EntryID === signsFromURL[i]);
        console.log(obj);
        console.log(obj.VimeoVideoHTML)

        let video = 
      "<div id='sidebarVideoDiv'>" +
      "<iframe width='" + videoWidth + "' height='" + videoHeight + "' src=" + obj.VimeoVideo + "?title=0&byline=0&portrait=0&background=1&loop=1 frameborder='0' allow='autoplay; fullscreen' allowfullscreen></iframe>" +
      "</div>";

        $('#data-container').append(video);
        //document.write(obj.VimeoVideoHTML);
    }

    //signsFromURL.forEach(item => let obj = signProperties.find(o => o.EntryID === );console.log(item));

    //let obj = signProperties.find(o => o.EntryID === 'apple');


});

//myURL = "https://asl-lex.org/visualization/"+ createQueryString("signs",ids);




console.log("Properties_test.js is running....")


