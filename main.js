var gmail;

//TODO : Populate this using an AJAX call so that we don't have to reinstall the plugin
var allKickdrumCustomerDomains = ["kickdrum.com", "kickdrumtech.com", 
                                    "sharestream.com", "atlassian.com",
                                    "examsoft.com", "idera.com"];

function refresh(f) {
  if( (/in/.test(document.readyState)) || (undefined === Gmail) ) {
    setTimeout('refresh(' + f + ')', 10);
  } else {
    f();
  }
}


/**
* Called automatically when a recipient is changed in an open compose window
*/
function onRecipientChange(compose) {
    var fromEmail = compose.from() || gmail.get.user_email();
    var sendingMailFromKickdrum = fromEmail.indexOf("kickdrumtech.com") > 1;
    
    recipients = [];
    recipients = recipients.concat(compose.to());
    recipients = recipients.concat(compose.cc());
    recipients = recipients.concat(compose.bcc());
    
    //console.log("From Email = " + fromEmail);
    //console.log("Recipients = " + recipients);
    
    var composeDiv = $(compose.$el);
    var composeId = compose.id() + "-alert";

    if (isKickdrumCustomer(recipients) && !sendingMailFromKickdrum) {
        showAlert(composeId, composeDiv);
    }
    else {
        hideAlert(composeId, composeDiv);
    }
}

function alertRowExists(composeId, composeDiv) {
    if(composeDiv.find("#" + composeId).length) {
        return true;
    }
    return false;
}

function createAlert(composeId, composeDiv) {
    var msg = "WARNING : Sending email to KD customer from non-KD email account!";
    var subjectBox = composeDiv.find("input[name=subject]");
    $('<div style="color:red;display:none" id="' + composeId + '"><span>' + msg + '</span><hr/></div>')
        .insertAfter(subjectBox);
}

function showAlert(composeId, composeDiv) {
    if(!alertRowExists(composeId, composeDiv)) {
        createAlert(composeId, composeDiv);
    }
    composeDiv.find("#" + composeId).show('fast');
}

function hideAlert(composeId, composeDiv) {
    if(alertRowExists(composeId, composeDiv)) {
        composeDiv.find("#" + composeId).hide('slow');
    }
}

function isKickdrumCustomer(recipients) {
    var domains = extractDomains(recipients);
    var customerDomains = $(domains).filter(allKickdrumCustomerDomains);
    return customerDomains.length > 0 ? true  : false;
}


function extractDomains(recipients) {
    var extractDomain = function(email) {
        domain = email.substr(email.indexOf("@") + 1);
        if (domain[domain.length - 1] === '>') {
            domain = domain.substr(0, domain.length-1);
        }
        return domain;
    }
    var domains = $.unique($.map(recipients, extractDomain));
    return domains;
}

var main = function(){
  gmail = new Gmail();
  gmail.observe.on("recipient_change", onRecipientChange);
}


refresh(main);
