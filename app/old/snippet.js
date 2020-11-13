var snippetID = "";
var url = "https://22qzx6fqi8.execute-api.us-east-1.amazonaws.com/First/snippets/";

function loadSnippet(e){
	
	var init_url = url + snippetID;
	
	var xhr = new XMLHttpRequest();
    xhr.open("GET", init_url, true);

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
				
				var timestampNum = jsonResponse["timestamp"];
				var unixDate = new Date(timestampNum);
				
				document.getElementById("timestampText").textContent += unixDate.toLocaleString();
				
				document.getElementById("infoArea").value = jsonResponse["info"];
				document.getElementById("textArea").value = jsonResponse["text"];
				document.getElementById("languageText").textContent += jsonResponse["language"];
				
            }else if(xhr.status === 400){
                alert("Unable to get Snippet");
            }
		}
    }
}

function saveText(e){
	
	var text_url = url + snippetID + "/updateText";
	
	var snipText = document.getElementById("textArea").value;
	
	var backspace = String.fromCharCode(8);
	var formfeed = String.fromCharCode(12);
	var newline = String.fromCharCode(10);
	var carriage = String.fromCharCode(13);
	var tab = String.fromCharCode(9);
	var quote = String.fromCharCode(34);
	var backslash = String.fromCharCode(92);
	
	var cursedArray = [backslash, backspace, formfeed, newline, carriage, tab, quote];
	var blessedArray = ['\\', '\\b', '\\f', '\\n', '\\r', '\\t', '\\"']

	snipText = snipText.replace(/[\x5c\x08\x0c\x0a\x0d\x09\x22]/g, function(x) {
                var i = cursedArray.indexOf(x);
  
                return blessedArray[i];
			});
	
	var data = {};
	
	data["text"] = snipText;
	var json = JSON.stringify(data);
	
	var xhr = new XMLHttpRequest();
	xhr.open("POST", text_url, true);
	
    console.log("JSON: " + json);
	console.log(text_url);
	
	xhr.setRequestHeader("Content-Type", "application/json");
	
    //send data as JSON
    xhr.send(json);
	
    // Process the response an update GUI
    xhr.onloadend = function() {
        console.log(xhr);
        if(xhr.readyState === XMLHttpRequest.DONE){
            if(xhr.status === 200){
                console.log("XHR: " + xhr.responseText);
                var jsonResponse = JSON.parse(xhr.responseText);
				console.log(jsonResponse);
            }else if(xhr.status === 404){
                alert("Unable to update text");
            }
        } else {
            console.log("Didn't processes");
        }
    }
}

window.onload = function() {
	snippetID = window.location.hash.substring(1);
	document.getElementById("snippetId").textContent += " " + snippetID;
	
	loadSnippet(this);
}

