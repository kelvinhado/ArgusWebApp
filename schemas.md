##Step 1 - Classified ad car definition

###Schema Json - from LEBONCOIN.Fr

For the output json scrapped from leboncoin.fr. we will imply that we are using the european currency and kms instead of miles.
this desctiption is not necessarily required.

```json
{
	"title": "LEBONCOIN",
	"type": "object",
	"properties": {
		"title": {
			"type": "string"
		},
		"postCode": {
			"type": "integer"
		},
		"brand": {
			"type": "string",
		}
    "model": {
			"type": "string",
		}
    "energy": {
			"type": "string",
		}
    "year": {
      "description" : "the year when the car was build"
			"type": "string",
		}
    "mileage": {
      "description" : "number of kms of the car, not miles"
			"type": "string",
		}
    "gearbox": {
      "description" : "automatic or manual"
			"type": "string",
		}
    "description": {
      "description" : "the full description given by the seller"
			"type": "string",
		}
    "price": {
      "description" : "the price given by the seller"
			"type": "integer",
		}
	},
	"required": ["title", "postCode", "energy" "brand", "model", "year", "mileage", "gearbox", "price"]
}
```

###Schema Json - to LACENTRALE.Fr
