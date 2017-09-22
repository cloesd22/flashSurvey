export function serverGET(url, callback){
//performs an AJAX GET request from the server
//inputs: request url, callback, returns data
    var serverResponse;
    

    if (window.XMLHttpRequest){
        var requestObject = new XMLHttpRequest();
    }else{
        var requestObject = new ActiveXObject("Microsoft.XMLHTTP");
    }

    requestObject.onreadystatechange = function(){

        if (requestObject.readyState==4 & requestObject.status==200){
            
            requestObject.onload=function(){
                serverResponse = requestObject.responseText;
                if (callback) callback(serverResponse);    
            }

        }
    }

    requestObject.open('GET',url,true);
    requestObject.send();

    return 'Test Success';
}


export function serverPOST (url, callback,data){
//performs an AJAX POST request to the server
//inputs: request url, callback, data to send
    var serverResponse;
    

    if (window.XMLHttpRequest){
        var requestObject = new XMLHttpRequest();
    }else{
        var requestObject = new ActiveXObject("Microsoft.XMLHTTP");
    }

    requestObject.onreadystatechange = function(){

        if (requestObject.readyState==4 & requestObject.status==200){
            requestObject.onload=function(){
                serverResponse = requestObject.responseText;
                if (callback) callback(serverResponse);
            }

        }
    }

    requestObject.open('POST',url,true);
    requestObject.send(data);

    return 'Test Success';
}

