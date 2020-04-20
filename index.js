const contents=[
 	{
		"title": "Cloudflare-Internship-1",
		"h1": "Variant 1",
		"p": "Welcome to the 1st Variant of the page",
		"a": "Connect with me on LinkedIn",
		"href": "https://www.linkedin.com/in/hriday-panchasara-55527b116/"
  	},
  	{
		"title": "Cloudflare-Internship-2",
		"h1": "Variant 2",
		"p": "Welcome to the 2nd Variant of the page",
		"a": "Connect with me via email",
		"href": "mailto:hhpancha@usc.edu"
	}
]

addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
 	let pageNo
 	let variant=null
 	let cookieCheck 

  	if(request.headers.get("Cookie")) {
		request.headers.get("Cookie").split(";").forEach(cookie => {
	  		if(cookie.trim().split("=")[0] === "variant"){
				variant=cookie.trim().split("=")[1]
	  		}
		})
		pageNo=variant
		cookieCheck=true
 	}
  	else{
		cookieCheck=false
		pageNo= Math.random() < 0.5 ? 0 : 1;
 	}

  	let res=await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
  	let pageVariants=await res.json();
  
  	const htmlPage=await fetch(pageVariants.variants[pageNo])
		.then(response => { return response.body })

  	const response=new Response(htmlPage)
  	response.headers.set('Content-Type',"text/html")
  	if(!cookieCheck){
		response.headers.set("Set-Cookie", "variant=" + pageNo + "; SameSite=Lax; HttpOnly;")
  	}

  	return new HTMLRewriter()
  	.on('title', {
		element: el => {
	  		el.setInnerContent(contents[pageNo]["title"]);
		}
  	})
  	.on('h1', {
		element: el => {
	  		el.setInnerContent(contents[pageNo]["h1"]);
		}
   	})
  	.on('p', {
		element: el => {
	  		el.setInnerContent(contents[pageNo]["p"]);
		}
  	})
  	.on('a', {
		element: el => {
	  		el.setInnerContent(contents[pageNo]["a"]);
		}
  	})
  	.on('a', {
		element: el => {
	  		el.setAttribute("href",contents[pageNo]["href"]);
		}
  	})
  	.transform(response)
}