#DomainsBot API - JQuery plugin

A JQuery plugin for using DomainsBot Spinner API (JSONP).


## Installation

Copy and paste the following snippet into your web page, just before the closing head tag. If your website uses templates to generate pages, enter it just before the closing tag in the file that contains the head section.

```html
<!-- jQuery library  -->
<script src="http://code.jquery.com/jquery-1.7.2.min.js"></script>

<!-- DomainsBot plugin  -->
<script src="https://domainsbot.blob.core.windows.net/javascript/jquery.domainsbot-1.0.min.js"></script>
```

Or, you can [download the source code (ZIP)](https://github.com/DomainsBot/domainsbot-jquery/zipball/master "domainsbot-jquery
source code") for `domainsbot-jquery` and put the .js file in the javascript directory of your web site.

## Getting Started

Getting started with the DomainsBot API couldn't be easier. Just put the follwing snippet in your html and you're ready to go.

```html
<script>
	$(document).ready(function ()
		{
			  var client = $().domainsbot({
				   results: "#results", // Selector for the results element
				   loading: "#loader", // Selector for the loading element
				   searchTextbox : "#search_box", // Selector for the search box element
				   searchSubmit : "#search_button", // Selector for the submit button element
				   urlCheckout: "http://yoursite.com/checkout.php?domain=%domain%", // Checkout url
				   parameters : { // Option parameters
								"apikey" : "YOUR-API-KEY" // Replace with your api token from http://developers.domainsbot.com
							}
			   });
		});
</script>
```

## More Plugin Options

```html
<script>
	$(document).ready(function ()
		{
			  var client = $().domainsbot({
				   results: "#results", // Selector for the results element
				   loading: "#loader", // Selector for the loading element
				   checking : "#checking", // Selector for the availability check loading element
				   searchTextbox : "#search_box", // Selector for the search box element
				   searchSubmit : "#search_button", // Selector for the submit button element
				   searchParameter : "domain", //  pluging will use the specified url parameter for displaying suggestion, (i.e.: http://www.yoursite.com/?domain=finddomains)
				   urlCheckout: "http://yoursite.com/checkout.php?domain=%domain%", // Checkout url
				   parameters : { // Option parameters
								"apikey" : "YOUR-API-KEY" // Replace with your api key from http://developers.domainsbot.com
								// Refer to http://developers.domainsbot.com/ for the complete list of api parameters
							},
				  onSuccess : function(results){alert(results);} // On success javascript callback
				  onError : function(err){alert(err);} // On error javascript callback
				  onLoading : function(e) {alert(e);} // On loading callback
				  autoComplete : true // Enable "as you type" results, default false
			   });
		});
</script>
```

## CSS and style

The DomainsBot jQuery plugin produce simple html that can be styled using stadard css.
In case you want to manual render the results on the page, you can use the "onSuccess" callback to implement your logic.

This is a simple css fragment for customizing the results layout

```css
#results>div{ background-color : whiteSmoke; }
#results>div>a {color: Black;}
#results>div>a:hover {color:Black;}
```

## Sample code
This is a [sample implementation](https://github.com/DomainsBot/domainsbot-jquery/blob/master/test.html "domainsbot-jquery
sample code") that you can use as reference. If you have any specific question please send us an email at developers[at]domainsbot.com

