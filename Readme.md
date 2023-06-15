# `REST API INTERN PROJECT`

This project is a RESTful API for a real estate agency exemple. It allows clients to search for properties, view details of individual properties, and add new properties to the database. The API is built using Node.js and the Express.js framework, and uses MongoDB as the database.   

## `Used Tools`                  
1. VS CODE
2. Node.js
3. Express.js
4. Mongoose
5. MongoDB
6. Postman
7. Dataset ---> https://www.kaggle.com/datasets/arnavkulkarni/housing-prices-in-london 

## `Setup`
1. npm init ---------> for package.json
2. npm install express nodemon
3. npm install mongoose@6.10.0 -------> used previous version to not couse any issue on current version (*7.4.0)
4. npm install dotenv ---------> to hide informations on uri
5. npm install -D jest supertest -------> if needed, can check in [package.json](package.json) for:

        "devDependencies": {
            "jest": "^29.5.0",
            "supertest": "^6.3.3"
        }

6. Change `scripts` like this in [package.json](package.json):
            
         "scripts": {
            "start": "nodemon app.js",
            "test": "jest --watchAll"
        },
    


7. npm test ----------> to test 
8. npm start ----------> to start

After start GET -http://localhost:8080/ping  to check is server alive.
# API Endpoints
The API has the following endpoints:


## `GET /houses/search`

Returns a list of house listings based on search criteria. Pagination added as a response includes:

- `TotalDocuments`: Gives all document number matches with your search.
- `CurrentPage`: Gives current page.
- `TotalPages`: Gives all page number.
- `PageSize`: Gives how much house shown for every page.

        
        "AllPagingData": {
            "TotalDocuments": 3475,
            "CurrentPage": 1,
            "TotalPages": 348,
            "PageSize": 10
        },
            "Houses": [
                {
                "_id": "644db47383f89d1e481006d0",
                "List_No": 0,
                "Property_Name": "Queens Road",
                "Price": 1675000,
                "House_Type": "House",
                "Area_in_sq_ft": 2716,
                "No": {
                    "Of_Bedrooms": 5,
                    "Of_Bathrooms": 5,
                    "Of_Receptions": 5
                },
                "Location": "Wimbledon",
                "City_County": "London",
                "Postal_Code": "SW19 8NY;"
            },
            {
                "_id": "644db47383f89d1e481006d1",
                "List_No": 1,
                "Property_Name": "Seward Street",
                "Price": 650000,
                "House_Type": "Flat / Apartment",
                "Area_in_sq_ft": 814,
                "No": {
                    "Of_Bedrooms": 2,
                    "Of_Bathrooms": 2,
                    "Of_Receptions": 2
                },
                "Location": "Clerkenwell",
                "City_County": "London",
                "Postal_Code": "EC1V 3PA;"
            },
            {........

### - *Query Parameters*

- `q`: Search query.Works for all *String* fields in data such as Property_Name, House_Type, Location, City_County, Postal_Code.
- `id`: The ID of a single house listing to return.
- `listno`: The listing number of a single house listing to return.
- `price_min`: Minimum price.
- `price_max`: Maximum price.
- `area`: Area of the house in square feet.
- `bedroom`: Number of bedrooms.
- `bathroom`: Number of bathrooms.
- `reception`: Number of receptions.
- `page`: Number of page.(default at 1 if it gets no query)
- `limit`: Number of page limit.(default at 10 if it gets no query)
### - *Response*
Returns an array of house objects, with the following properties:

- `List_No`: The listing number of the property
- `Property_Name`: The name of the property
- `Price`: The price of the property
- `House_Type`: The type of the house (e.g. Flat, Apartment, etc.)
- `Area_in_sq_ft`: The area of the property in square feet
- `No.Of_Bedrooms`: The number of bedrooms
- `No.Of_Bathrooms`: The number of bathrooms
- `No.Of_Receptions`: The number of receptions
- `Location`: The location of the property
- `City_County`: The city or county of the property
- `Postal_Code`: The postal code of the property

### - Link exemple
- http://localhost:8080/houses/search?price_min=250000&price_max=500000 </br>Searchs all houses and shows only interval query as a response.
</br></br>
- http://localhost:8080/houses/search?limit=12&q=queen
</br>With different page size then default, searchs only key value in all houses and shows as a response.


## `POST /houses`
Adds a new property to the database.

### - *Request Body*

A JSON object with the following properties:

- `List_No`: The listing number of the property
- `Property_Name`: The name of the property
- `Price`. The price of the property
- `House_Type`: The type of the house (e.g. Flat, Apartment, etc.)
- `Area_in_sq_ft`: The area of the property in square feet
- `No.Of_Bedrooms`: The number of bedrooms
- `No.Of_Bathrooms`: The number of bathrooms
- `No.Of_Receptions`: The number of receptions
- `Location`: The location of the property
- `City_County`: The city or county of the property
- `Postal_Code`: The postal code of the property

### - *Response*
Returns the newly created house object.

### - Link exemple
- http://localhost:8080/houses
</br> post a body like this format:</br>
            
        {    
            "List_No": 123456,
            "Property_Name": "Test Road",
            "Price": 167000,
            "House_Type": "House",
            "Area_in_sq_ft": 276,
            "No": {
                "Of_Bedrooms": 2,
                "Of_Bathrooms": 3,
                "Of_Receptions": 5
            },
            "Location": "Wimbledon",
            "City_County": "London",
            "Postal_Code": "SW19 4Y;"
        }

## `GET /houses/:houseId`
Returns details of a specific property.

### - *Parameters*
- `_id`: The ID of the property to retrieve.

### - Link exemple
- http://localhost:8080/houses/6451a5191b45d7cc0f3b398e</br>
Gives an exist house .


## `PATCH /houses/:houseId`

This endpoint updates a house listing.

### - *Parameters*

- `_id`: The ID of the house to update.

### - *Request Body*

The request body must be a JSON object containing any of the properties to update.

### - *Response*

The endpoint returns a JSON object containing the updated house listing.
### - Link exemple
- http://localhost:8080/houses/6451a5191b45d7cc0f3b398e</br>Give a body like this (whatever you want to change):

        {
            "List_No": 131313,
            "Property_Name": "Updated Tested Road",
            "Price": 500000
        }


## `DELETE /houses/:houseId`

Deletes a single house listing by ID.

### - *Parameters*

- `_id`: The ID of the house to delete.

### - Link exemple
- http://localhost:8080/houses/6451a5191b45d7cc0f3b398e</br>Warning : You are removing house you get, patch and update at previous steps.</br>
If house exist, response supposed to be like this:

            {
                "acknowledged": true,
                "deletedCount": 1
            }


</br></br></br></br></br></br></br></br></br></br></br></br></br>

## *`PS.`*
waitin' for validation ASAP :)
