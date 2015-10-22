## Argus Web App

*La cote Argus* is a reference for used vehicles prices for professionals and the general public.

Very useful to check if a classified ad is a good deal. You could use the free website [lacentrale.fr](http://www.lacentrale.fr/lacote_origine.php)

In France, [leboncoin.fr](http://www.leboncoin.fr/) is the website leader of classified ad: minimalist UX and UI without registry.

### Members of the project :
- Alan Chan
- Kelvin Hado

### Steps of the project :

- [X] Define the JSON schema for a car 'leboncoin.fr' classified ad.
- [X] Define the JSON schema for a car 'lacentrale.fr' classified ad.
- [X] Write the UserFlow
- [X] Create the NPM module 'leboncoin'.
    From the ad url, scrap the webpage and return the car properties in JSON format.
- [X] Create the NPM module 'lacentrale'.
    From the Json object extracted, give the "Cote Argus".
- [X] Build the Node server with Express.
- [X] Design the WebApp that give a feedback to the user if the deal is good or not.
- [] Ultime power ! from a research in leboncoin (with several results) give the feedbacks for every post.
