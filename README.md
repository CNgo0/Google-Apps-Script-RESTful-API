# Google Apps Script RESTful API
 
## index.html

This is served by our servers to the user. This is static HTML and JavaScript. The JavaScript would communicate with a Google Apps Script and consume a JSON response.

In our case the response would be:
```json 
{
 "code": 200,
 "message": "Hello from Google Apps Script!"
}
```

## code.js

This file is hosted on the Google Apps Script side and would handle incoming communication from the client in a RESTful manner. 

---

## How it's done now
Currently how I serve a website from Google Apps Script is by hosting the HTML/JS/CSS on the Google Apps Script side, handle the user's request, compile the HTML output, and send it to the user.

The user must navigate to a URL like this in order to access the website.

`https://script.google.com/a/macros/noaa.gov/s/AKfycbx7IuBdyaO7Ff3HDS8C5wS10qDP2FIVEyiXWVZgtFOh1T1qFOURxbDUnu0bcG84xnqT/exec`

If I wanted to serve the website from our own domain like
`https://my_app.fisheries.noaa.gov/`
then it must be served in an `iframe` like this:

```html
<iframe
  src="https://script.google.com/a/macros/noaa.gov/s/AKfycbx7IuBdyaO7Ff3HDS8C5wS10qDP2FIVEyiXWVZgtFOh1T1qFOURxbDUnu0bcG84xnqT/exec"
  scrolling="no"
  height="700"
  width="995"
  style="border: none"
  title="Floorplan"
  sandbox="allow-same-origin allow-scripts allow-top-navigation allow-top-navigation-by-user-activation"
></iframe>
```

# Where I'd like to go in the future
I'd like to be able to serve the application from
`https://my_app.fisheries.noaa.gov/`
without using an `iframe` and just plain static HTML and JavaScript.

The JavaScript given to the user would send requests to the Google Apps Script side and populate the UI with responses in JSON.

### Benefits of this would be:
* Decouple the UI from the backend.
* Allow us to create single page applications.
* Become less reliant on Google while still getting all the benefits of Google Apps Script
* Use our own domain rather than the long google script URL.
  * `https://my_app.fisheries.noaa.gov/` vs `https://script.google.com/a/macros/noaa.gov/s/AKfycbx7IuBdyaO7Ff3HDS8C5wS10qDP2FIVEyiXWVZgtFOh1T1qFOURxbDUnu0bcG84xnqT/exec`
* Avoid `iframe` usage.
* Modernized architecture

## Blockers
Google Apps Script disables CORS.

If you try to run `index.html` from this project you'll be met with this error in the console:
```
Access to XMLHttpRequest at 'https://script.google.com/a/macros/noaa.gov/s/AKfycbx7IuBdyaO7Ff3HDS8C5wS10qDP2FIVEyiXWVZgtFOh1T1qFOURxbDUnu0bcG84xnqT/exec' from origin 'http://localhost:8080' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

In order to get this working we need to allows CORS from the server side (Google's side).
[The most I've found so far was from this Stack Overflow post "How do i allow a CORS requests in my google script?"](https://stackoverflow.com/questions/53433938/how-do-i-allow-a-cors-requests-in-my-google-script)

### Answer:
```
As far as I understood you have application to be run on custom domain. And it should access script on google cloud.

The bad news: there are no way to skip CORS check on your application side(until request is simple that I believe is not your case).

You should specify Access-Control-Allow-Origin on Google Cloud side:
```
https://cloud.google.com/storage/docs/cross-origin#server-side-support
```
Cloud Storage allows you to set CORS configuration at the bucket level only. You can set the CORS configuration for a bucket using the gsutil command-line tool, the XML API, or the JSON API. For more information about setting CORS configuration on a bucket, see Configuring Cross-Origin Resource Sharing (CORS). For more information about CORS configuration elements, see Set Bucket CORS.

You can use either of the following XML API request URLs to obtain a response from Cloud Storage that contains the CORS headers:

storage.googleapis.com/[BUCKET_NAME]

[BUCKET_NAME].storage.googleapis.com
```
```
If this does not help for any reason you will need to get your own server working as a proxy:

your client application <-> your backend that returns Access-Control-Allow-Origin <-> google cloud
```

## Try for yourself
You can either run the file locally or spin up a local web server.

I use PHP's built in webserver to test this locally.

From your terminal navigate to this the root directory of this project and run this:
```bash
php -S localhost:8080
```
Then just connect to the server from your browser: http://localhost:8080/

Open the console and check the output.

