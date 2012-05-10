/*Copyright 2012, DomainsBot Inc. */

(function( $ ) {

   var loader;
   var checking;	
  $.fn.domainsbot = function( options ) {  

    // Create some defaults, extending them with any options that were provided
    var settings = $.extend( {
	'url'         : '',
	'urlAvailability' : "",
	'urlCheckout' : "",  
	'textbox' : null,
	'submit' : null,
	'loading' : null,
	'checking' : null,
	'results' : 'results',
	'tlds' : 'com,net,org,biz',
	'limit' : 10,
        'removeKeys' : false,
	'advanced' : null,
	'key': null,
	'onSuccess' : null,
	'onError' : null,
	'onLoading' : null,
	'onAvailabilitySuccess' : null,
	'onAvailabilityError' : null,
	'onCheckout' : null
      	    
    }, options);
    
    
	
	if(settings['textbox'] != null){
		// Sets focus the search text box
		$(settings['textbox']).focus();
	}
	
	
	if(settings['loading'] != null){
		// Sets variable with ajax loader image
		$(settings['loading']).css('display','none');
		
		loader = $(settings['loading']);
		
		loader.remove();
	}
	
	if(settings['checking'] != null){
		// Sets variable with ajax loader image
		$(settings['checking']).css('display','none');
		
		checking = $(settings['checking']);
		
		checking.remove();
	}
	
	if(settings['textbox'] != null){
		// Check for Key down event on Search text box
		$(settings['textbox']).keydown(function(event) {

			// Check if user hits the <enter>
			if(event.keyCode == 13){
				// calls to function
				getDomains($(options["textbox"]).val(),settings);
			}
		});
	}
	
	if(settings['submit'] != null && settings['textbox'] != null){
		// Check the click event, search btn pressed
		$(settings['submit']).click(function(){

				//call the function to get result
				getDomains($(options["textbox"]).val(), settings);
		});
	}
	
	if(settings['key'] != null){
		getDomains(settings['key'],settings);
	}
  };
  
  function getDomains(key,options)
	{
		var cnt = 0; var i;
		
		// Define an empty string
		var postString = "";
		
		
		// Binds the post string with key term and suggestion
		postString = "q=" + key + "&tlds=" + options['tlds'] + "&limit=" + options['limit'] + "&removeKeys=" + options['removeKeys'] ;
		
		for(var index in options["advanced"]) {
				postString += "&"+index+"="+options["advanced"][index];
		}
		
		$(options["results"]).html("");
		
		if(options['loading'] != null){
			$(options["results"]).append(loader);
			// Set teh ajax loader image
			$(loader).css('display','');
		}
		
		if(options['onLoad'] != null){
			options['onLoad']();
		}
		

		// Make the ajax call to domain.php
		$.ajax({
			url:options['url'] +"?" + postString,
			dataType: 'json',
			success:function(data)
			{	
				if(options['onSuccess'] != null){
					options['onSuccess'](data);
				}
				else{
					
					if(data && data.Domains){
						$.each(data.Domains, function(i,domain){
							
							var htmlItem = "<div class='domainsbot_domainName'>";
							
							var url = "#";
							if(options["urlCheckout"]  != null && options["urlCheckout"] != "")
							{
								url = options["urlCheckout"].toLowerCase().replace("%domain%",domain.DomainName);
							}
							
							// cart url
							htmlItem += "<a href='"+url+"' bind='domainsbotDomainLink' domainName='"+domain.DomainName+"' >"+domain.DomainName+"</a>";
														
							htmlItem += "<div bind='domainsbotDomain' index='"+i+"' domainName = '"+domain.DomainName+"' class='domainsbot_domainImg'>" 
								+ (((options["urlAvailability"] != null && options["urlAvailability"] != "") || (options["onAvailabilitySuccess"] != null && options["onAvailabilitySuccess"] != "") && options["onAvailabilitySuccess"])? checking.clone().css('display','block').wrap('<p>').parent().html()  : "" )
								+"</div>";
							
							htmlItem += "</div>";
							
						});
						
						if(data.Domains.length == 0)
							htmlItem += "<li class='domainsbot_domainName'>No Suggestions found!</li>";
					}
					else
					{
						htmlItem += "<li class='domainsbot_domainName'>An error occured</li>";
					}

					
					
					$(options["results"]).html(htmlItem);
					
					if(options["onCheckout"] != null)
					{
						$("a[bind='domainsbotDomainLink']").click(function(evt)
						{
							
							options["onCheckout"]({ Domain: $(this).attr("domainName")}, evt );
						});
					}
					

					
					
					if((options["urlAvailability"] != null && options["urlAvailability"] != "") || (options["onAvailabilitySuccess"] != null && options["onAvailabilitySuccess"] != "")){
						
						for(i = 0; i < data.Domains.length; i++)
						{
							checkAvailability(data.Domains[i].DomainName, i, options);
						}
						
					}
					
					
				}
			},
			error: function(data)
			{
				if(options['onError'] != null){
					options['onError'](data);
				}
				else{
					$(options["results"]).html("<span class='domainsbot_domainName'>An error occured</span>");
				}
				
			}
		});
	}
 
	function checkAvailability(domain, id, options)
	{
				
		// Built the post string.
		var postString = options['urlAvailability'].toLowerCase().replace("%domain%",domain);

		//check if domain not empty
		if(domain!="")
		{ 
			$.ajax({
				url: postString,
				method:'POST',
				success:function(response)
				{
					if(options["onAvailabilitySuccess"] != null){
						options["onAvailabilitySuccess"]({ Domain: domain, Index: id, Available:  response == "1"? true : false} );
					}
					if(options["urlAvailability"] != null && options["urlAvailability"] != "")
					{
						
						//Check if domain name is available or not
						if(response == 0)
						{
							
							$("span[bind='domainsbotDomain'][index='" + id+"']").parent().hide();	
						}
						else
						{
							console.log(id);
							$("span[bind='domainsbotDomain'][index='" + id+"']").html("");
						}
								
								
					}
				},
				error: function(response){
					if(options["onAvailabilityError"] != null){
						options["onAvailabilityError"] (response);
					}
					else
					{
						$("#rowBox" + id).hide();	
					}
				}
			});
		}
	}
  
})( jQuery );