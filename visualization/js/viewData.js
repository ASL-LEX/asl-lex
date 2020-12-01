// LOADER
$(window).on('load', function () {
  setTimeout(removeLoader, 50) //wait for page load PLUS less than 1 second.
})

function removeLoader () {
  $('#loadingDiv').fadeOut(500, function () {
    // fadeOut complete. Remove the loading div
    $('#loadingDiv').remove() //makes page more lightweight
  })
}

function getFilteredNodesProps (graphCodes, sign_props, attributes) {
  let hashed_props = hashSignProps(sign_props)
  let result = []
  for (code of graphCodes) {
    if (hashed_props[code]) {
      result.push(processPropRecord(hashed_props[code], attributes))
    }
  }
  return result
}

function processPropRecord (propertyObj, attributes) {
  let property_strings_to_split = ['SignType.2.0', 'SignTypeM2.2.0', 'SecondMinorLocationM2.2.0', 'MovementM2.2.0', 'MinorLocationM2.2.0', 'MinorLocation.2.0', 'Flexion.2.0', 'NonDominantHandshape.2.0', 'SecondMinorLocation.2.0', 'Movement.2.0', 'ThumbPosition.2.0', 'SignTypeM3.2.0']

  let result = []
  for (key in propertyObj) {
    if (attributes.indexOf(key) != -1) {
      if (propertyObj[key] != null) { // anything that isn't null or undefined, but let 0s go through
        let node_prop_value = null
        if (property_strings_to_split.includes(key)) {
          node_prop_value = propertyObj[key].split(/(?=[A-Z])/).join(' ')
        } else {
          node_prop_value = propertyObj[key]
        }
        result.push(node_prop_value)
      } else {
        result.push('N/A')
      }
    }
  }
  return result
}

function hashSignProps (property_data) {
  let hashed_properties = {}
  for (let prop of property_data) {
    hashed_properties[prop['Code']] = prop
  }
  return hashed_properties
}

$(document).ready(function () {

  let gCodes = localStorage.getItem('gCodes')
  gCodes = gCodes.split(',')
  let properties = []
  const sign_prop_promise = $.getJSON('data/sign_props.json', function (signProperties) {
    properties = signProperties
  })

  sign_prop_promise.then(
    function (fulfilled) {

      // let excluded_feature_list = ["index", "Code", "YouTube Video", "VimeoVideoHTML", "VimeoVideo", "color_code", "group_id", "SignBankEnglishTranslations", "SignBankAnnotationID", "SignBankLemmaID"];
      let excluded_feature_list = ['YouTube Video', 'VimeoVideoHTML', 'VimeoVideo', 'color_code', 'group_id', 'SignBankEnglishTranslations', 'SignBankAnnotationID', 'SignBankLemmaID']

      let attributes = []
      for (key in properties[0]) {
        if (!excluded_feature_list.includes(key) && property_display_names[key])
          attributes.push(key)
      }
      properties = (getFilteredNodesProps(gCodes, properties, attributes))
      let columns = []
      for (attr of attributes) {
        columns.push({ title: property_display_names[attr] })
      }
      $('#datatable').DataTable({
        data: properties,
        columns: columns,
        lengthMenu: [[20, 50, 100, -1], [20, 50, 100, 'All']],
        dom: 'Blfrtip',
        buttons: [
          'csv', 'excel'
        ]
      })
    }, function (err) {
      console.log(err)
    }
  )

  window.onbeforeunload = function () {
    localStorage.removeItem('gCodes')
    return ''
  }

})
