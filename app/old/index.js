
// Embedded url
var url = "https://22qzx6fqi8.execute-api.us-east-1.amazonaws.com/First/snippets";

function createSnippet(e){
    var password = document.getElementById("snippetPassword").value;
    
	var data = {};
    data["password"] = password;
    var json = JSON.stringify(data);
    console.log("JSON: " + json);
	
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    
	//send data as JSON
    xhr.send(json);
	
    // Process the response an update GUI
    xhr.onloadend = function() {
        console.log(xhr);
        if(xhr.readyState === XMLHttpRequest.DONE){
            if(xhr.status === 200){
                console.log("XHR: " + xhr.responseText);
                var jsonResponse = JSON.parse(xhr.responseText);
				var snipID = jsonResponse["body"]["result"]
                document.getElementById("snippetId").value = snipID;
				window.open("snippet.html" + '#' + snipID, "_self");
				
            }else if(xhr.status === 400){
                alert("Unable to create Snippet");
            }
        } else {
            document.getElementById("snippetId").value = "What happened?"
        }
    }
}

function existingSnippet(e){
	var snippetId = document.getElementById("snippetId").value;
	
	var exist_url = url + "/" + snippetId;
	
	var xhr = new XMLHttpRequest();
    xhr.open("GET", exist_url, true);

    //send data as JSON
    xhr.send();

    // Process the response an update GUI
    xhr.onloadend = function() {
        console.log(xhr);
        if(xhr.readyState === XMLHttpRequest.DONE){
            if(xhr.status === 200){
                console.log("XHR: " + xhr.responseText);
                var jsonResponse = JSON.parse(xhr.responseText);
				console.log(jsonResponse);
				
				if (Object.keys(jsonResponse).length === 6){
					window.open("snippet.html" + '#' + snippetId, "_self");
				}
				
            }else if(xhr.status === 400){
                alert("Unable to create Snippet");
            }
        } else {
            document.getElementById("snippetId").value = "What happened?"
        }
    }
}