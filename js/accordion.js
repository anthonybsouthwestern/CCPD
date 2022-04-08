/**
 * Andres Orozco
 * This is pretty much the entire thing in an async function. The problem I was facing was that the entire program was completing
 * before the fetch statement had a chance to load eveything. The solution is to put everything in an async function so "await"
 * basically halts everything, which is what we want to do. We WANT the entire program to wait until the JSON information
 * is loaded and usable before creating the fellowships accordion.
 */
 async function createAccordion() {

  /**
   * Andres Orozco
   * This code sets up which panel to start at. So theoretically, when the website is up, CCPD staff can click the panel they want to send
   * someone, copy the URL, send it, they can paste it into their browser, and the website will open up with that panel.
   */
   var firstURL = window.location.href
   var indexOfFragID = firstURL.indexOf("#")
   var theNum = firstURL.substring(indexOfFragID+1)
   var theInt = parseInt(theNum)
   var startingPanel = theInt - 1

  /*creates fellowship dictionary with each fellowship name 
  as the key and then attaches the fellowship 
  information to each fellowship name (like a hash table)
  Does NOT display on page
  */
  var fellowships = {}
  var fellowship_ids = {}
  fellowships_json_data.forEach(function(item) {
  if(!(item.name in fellowships)){
    fellowships[item.name] = [item] // adds new fellowship name to array
    fellowship_ids[item.name] = item.fellowship_id
  }
  else
      fellowships[item.name].push(item) // adds the information for that fellowship
  })
  
  // console.log(fellowships);

 /*Dictionaries that contain all fellowship keys, 
 and the name you actually want it to be labeled as on the web page
 Different dictionaries will be used in different quadrants in format method.
  */
  var newFellowshipSpecialKeys = {
    "description": "Description",
    "website": "Website"
  }

  var newFellowshipRequirementKeys = {
    "gpa": "Minimum GPA",
    "age": "Age",
    "citizenship": "US Citizen/National/Permanent Resident",
    "requires_campus_endorsement_nomination": "Requires Campus Endorsement or Nomination",
  }

  var newFellowshipDetailKeys = {
    "level_of_study": "Level Of Study",
    "field_of_study_interests": "Field of Study or Interests",
    "location_of_study": "Location of Study",
    "specific_location": "Specific Location",
  }

  var newFellowshipOtherKeys = {
    "other" : "Other Details/Requirements"
  }
  
  /*creates outer accordion layer:
    creates an expandable drop down object for each fellowship.
    content inside each fellowship object is still empty at this point.
    Does display on page
  */
  //console.log(fellowships)
  var html = $.map(fellowships, function(body, fellowship) {
  return "<h1 id='" + fellowship_ids[fellowship] + "'>" + fellowship + "</h1>" + // fellowship name header
    "<div>" + $.map(body, function(item, i) {
        //console.log(i, item)
        return format(item)
    }).join("") + "</div>"
  }).join("")


  
  /*Creates inner accordion layer:
  seperates the inner accordion layer into different rows/columns
  depending on the type of content that needs to be displayed in that specific quadrant
  */
  function format(item){
    var formatted_item = ""
    formatted_item += "<div class = 'inner_accordion_layer'>"
    
    formatted_item += "<div class='row'>"
    formatted_item += "<div>" + sectionFormat(newFellowshipSpecialKeys, item) +"</div>"
    formatted_item += "</div>"

    formatted_item += "<div class='row'>"
    formatted_item += "<div class='column'><h5>Details</h5>" + sectionFormat(newFellowshipDetailKeys, item) +"</div>"
    formatted_item += "<div class='column'> <h5>Requirements</h5>" +sectionFormat(newFellowshipRequirementKeys, item)+ "</div>"
    formatted_item += "</div>"

    formatted_item += "<div class='row'>"
    formatted_item += "<div>" + sectionFormat(newFellowshipOtherKeys, item) +"</div>"
    formatted_item += "</div>"

    formatted_item += "</div>"
    return formatted_item
  }
  
  /*Fills inner accordion layer:
    grabs the content for each fellowship from the fellowship 
    hashtable and adds it into the empty fellowship content object.
    content inside each fellowship object is no longer empty at this point.
    Does display on page.
  */
  function sectionFormat(newFellowshipKeys, item){
    return $.map(item, function(line, key) {
      var fellowship_details = ""
      if((key in newFellowshipKeys) && line != null){
        if(key == "description")
          fellowship_details += "<h3>" + line + "</h3>"
        else if (key == "website")
          fellowship_details += "<element class = \"p1\">" + '<a href="' + line + '"target="_blank">' + "Visit This Fellowship Site" + "</a>" + "</element class = \"p1\">"
        else if(key != "other")
          fellowship_details += "<h4>" + newFellowshipKeys[key] + "</h4><div><p>" + line + "</p></div>"
        else
          fellowship_details += "<h4>Other Details and Requirements</p>" + "</h4><div><p>" + line + "</p></div>"
      }
      
      return fellowship_details
    }).join("")
    }
  
  /*Attaches outer and inner layer to each other to create complete accordion object.
  Places accordion object to fellowship-accordion div placeholder from index.html.
  */
 // USED: https://jqueryui.com/accordion/ for accordion functions/interactions
  $(function(){
  //console.log(html)
  $("#fellowship-accordion").append(html)
  //$("#fellowship-accordion").children("div").accordion()
  $("#fellowship-accordion").accordion({
    collapsible: true,
    active: startingPanel,
    autoHeight: false,
    /**
     * Andres Orozco
     * This code specifies that when a panel is activated in the accordion, change the URL
     */
    activate: function( event, ui ) {
      /**
       * This Stack OVerflow post exactly fixed the issue of closing and reopening the same panel
       * https://stackoverflow.com/questions/20062540/jquery-accordion-scrolls-to-top-on-activate-then-breaks-on-second-click
       */
      if(!ui.newHeader.length) {
        // https://stackoverflow.com/questions/1397329/how-to-remove-the-hash-from-window-location-url-with-javascript-without-page-r
        history.pushState("", document.title, window.location.pathname + window.location.search);
      }else {
        // Gets the activated panel
        var currentHeaderID = ui.newHeader

        // Get the one-based ID of the panel in the accordion
        var fellowShipNumberOneBased = currentHeaderID[0].id

        // Change the URL to match "#" + theNumber
        window.location.hash = "#" + fellowShipNumberOneBased
      }
    }
})


  })
  //console.log(html)

}