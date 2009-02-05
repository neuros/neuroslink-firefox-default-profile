/*
*neurostv-fullscreen Firefox extension
*Listen to page/tab changes, and change browser.fullscreen.autohide accordingly
*support@neurostechnology.com
*Copyright 2009 Neuros Technology and Jason Shah
*/

var ntvfullscreen_urlBarListener = {
  QueryInterface: function(aIID)
  {
   if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
       aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
       aIID.equals(Components.interfaces.nsISupports))
     return this;
   throw Components.results.NS_NOINTERFACE;
  },

  onLocationChange: function(aProgress, aRequest, aURI)
  {
    ntvfullscreen.processNewURL(aURI);
  },

  onStateChange: function() {},
  onProgressChange: function() {},
  onStatusChange: function() {},
  onSecurityChange: function() {},
  onLinkIconAvailable: function() {}
};

var ntvfullscreen = {
  oldURL: null,
  browserprefs: null,
	  
  
  init: function() {
    // Listen for webpage loads
    gBrowser.addProgressListener(ntvfullscreen_urlBarListener,
        Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT);
    // Get browserprefs to change autohide
    this.browserprefs = Components.classes['@mozilla.org/preferences-service;1']
        .getService(Components.interfaces.nsIPrefService)
        .getBranch('browser.fullscreen.');
    
    setTimeout("window.fullScreen=true", 1); //Must be done in timeout
  },
  
  uninit: function() {
    gBrowser.removeProgressListener(ntvfullscreen_urlBarListener);
  },

  processNewURL: function(aURI) {
    if (aURI.spec == this.oldURL)
      return;
    
    // check if the URL matches [app,dev].neuros.tv
    firsttwenty = aURI.spec.substring(0,20);
    if (firsttwenty == "http://app.neuros.tv" || firsttwenty == "http://dev.neuros.tv")
    {
	if (this.browserprefs.getBoolPref('autohide') == false)
	{
		this.browserprefs.setBoolPref('autohide', true);

		// Simulate mouseover on "fake" toolbar created in fullscreen (fullscr-toggler)
		// See chrome://browser/content/browser.js for more details
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("mouseover", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		togglerObj = window.document.getElementById("fullscr-toggler");
		if (togglerObj != null) togglerObj.dispatchEvent(evt);
	}
    }
    else
    {
	if (this.browserprefs.getBoolPref('autohide') == true)
	{
		this.browserprefs.setBoolPref('autohide', false);

		// Simulate mouseover on "fake" toolbar created in fullscreen (fullscr-toggler)
		// See chrome://browser/content/browser.js for more details
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("mouseover", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		togglerObj = window.document.getElementById("fullscr-toggler");
		if (togglerObj != null) togglerObj.dispatchEvent(evt);
	}
    }

    // replace oldURL
    this.oldURL = aURI.spec;
  }
};

window.addEventListener("load", function() {ntvfullscreen.init()}, false);
window.addEventListener("unload", function() {ntvfullscreen.uninit()}, false);




