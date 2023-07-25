//let signProperties = [];

let selected = [];

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

function copyURL(str) {
    //var baseURL = "https://asl-lex.org/visualization/?sign=";
    var copyURL = str;
    const el = document.createElement('textarea')
    el.value = copyURL
    el.setAttribute('readonly', '')
    el.style.position = 'absolute'
    el.style.left = '-9999px'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    $("#linkicon").attr('title', 'Link copied!').tooltip('_fixTitle').tooltip('show');
  }


$.getJSON('data/sign_props.json', function (properties) {

    let videoHeight = 300;
    let videoWidth = 400;

    signProperties = properties

    entryIDArray = []

    let obj = signProperties.forEach(o => entryIDArray.push(o.EntryID));

    entryIDArray.sort()



    var arrayLength = entryIDArray.length;

    checklistStr = ""

    for (var i = 0; i < arrayLength; i++) {
        id = i+1;
        checklistStr += '<input type="checkbox" class="cb" id="sign' +id+ '" name="sign' +id+ '" value="'+entryIDArray[i]+'"><label for="sign' +id+'">'+entryIDArray[i]+'</label><br/>';
    }
    $('#checklist-container').append(checklistStr);


    signArray = []
    $('.cb').click(function() {
        $('ul').html("");
        $(".cb").each(function(){
            if($(this).is(":checked")){
              $('ul').append('<li>'+$(this).val()+'</li>')
              signArray.indexOf($(this).val()) === -1 ? signArray.push($(this).val()) : console.log("This item already exists");
          }
          else {
            signArray = signArray.filter(e => e !== $(this).val())
          }
        });
        if (signArray.length > 0) {
            myURL = "https://asl-lex.org/visualization/sign_chain.html"+ createQueryString("signs",signArray);
            document.getElementById("url").innerHTML = '<a href="'+myURL+'" target="_blank">Link</a><br/>Click to copy link &#128073 <i class="fas fa-link" id="linkicon" data-toggle="tooltip" data-placement="right" title="Copy direct link to sign" onclick="copyURL(\''+myURL+'\')"></i>';
        }
        });


    
});



//myURL = "https://asl-lex.org/visualization/"+ createQueryString("signs",ids);





console.log("Properties_test.js is running....")


