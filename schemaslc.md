```txt
{
	"title": "LACENTRALE",
	"type": "object",
	"properties": {

	"title": {
			"type": "string"
		},
	"brand": {
			"type": "string",
		}

    "model" : {
			"type": "string",
		}

    "energy" : {
			"type": "string",
		}

    "year" : {
      "description" : "the year when the car was build"
			"type" : "string",
		}
    "kilometers" : {
      "description" : "number of kms of the car"
			"type" : "string",
		}
    "gearbox" : {
      "description" : "automatic or manual"
			"type" : "string",
		}
    "price" : {
      "description" : "the price given by the seller"
			"type" : "integer",
		}
	},
	"required": ["brand", "model", "year", "kilometers", "price"]
}
```