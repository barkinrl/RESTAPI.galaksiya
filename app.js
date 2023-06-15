'use strict';
const express = require('express');         
const app = express();          
const mongoose = require('mongoose');             //i had to use older version of mongoos for connection issues in current version *v-7.0.4
const { MongoClient } = require('mongodb');
require('dotenv/config');
const bodyParser = require('body-parser');
const { query } = require('express');
const HouseModel = require('./models/House');


//MIDDLEWARES  
app.use(bodyParser.json());
mongoose.set('strictQuery', true);

//CONNECT to DB
mongoose.connect(         
  process.env.DB_CONNECTION,    //to hide URI (URI in .env file)        
  { useNewUrlParser: true, useUnifiedTopology: true }, 
  () => console.log('connected to DB')
);

//IS IT ALIVE TEST
app.get('/ping', (req, res) => {  
    res.send('I ve seen things you people wouldn t believe.'+ 
    ' Attack ships on fire off the shoulder of Orion.'+
    ' I watched C-beams glitter in the dark near the Tannhäuser Gate.'+                
    ' All those moments will be lost in time, like tears in rain.  -Roy Batty');         
});                     


//SEARCH
app.get('/houses/search', async (req, res) => {
  try {
    const query = {};
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (req.query.q) {
      query.$or = [        
        { Property_Name: new RegExp(req.query.q, 'i') },
        { House_Type: new RegExp(req.query.q, 'i') },
        { Location: new RegExp(req.query.q, 'i') },
        { City_County: new RegExp(req.query.q, 'i') },
        { Postal_Code: new RegExp(req.query.q, 'i') }      
      ];
    }
    if (req.query.id) {
      const house = await HouseModel.findById(req.query.id);
      return res.json(house);
    }

    if (req.query.listno) {
      query.List_No = parseInt(req.query.listno);
    }

    if (req.query.price_min || req.query.price_max) {
      const price = {};
      if (req.query.price_min) {
        price.$gte = parseInt(req.query.price_min);
      }
      if (req.query.price_max) {
        price.$lte = parseInt(req.query.price_max);
      }
      query.Price = price;
    }

    if (req.query.area) {
      query.Area_in_sq_ft = parseInt(req.query.area);
    }

    if (req.query.bedroom) {
      query['No.Of_Bedrooms'] = parseInt(req.query.bedroom);
    }

    if (req.query.bathroom) {
      query['No.Of_Bathrooms'] = parseInt(req.query.bathroom);
    }

    if (req.query.reception) {
      query['No.Of_Receptions'] = parseInt(req.query.reception);
    }
    const results = await HouseModel.aggregate([
      {
        $match: query
      },
      {
        $sort:{
          List_No: 1
        }
      },
      {
        $facet: {
          AllPagingData: [
            {
              $count: 'TotalDocuments'
            },
            {
              $addFields: {
                CurrentPage: page,
                TotalPages: { $ceil: { $divide: ['$TotalDocuments', limit] } }
              }
            }
          ],
          Houses: [
            {
              $skip: (page - 1) * limit
            },
            {
              $limit: limit
            }
          ]
        }
      }
    ]);
    const result = results[0];
    result.AllPagingData = { ...result.AllPagingData[0], PageSize: result.Houses.length };
    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});


app.get('/houses/:houseId', async(req, res) => {
  try{
    const house = await HouseModel.findById(req.params.houseId);
    return res.json(house);
  }catch(err) {
      res.status(500).json({ message: err.message });
  }
});


//SUBMITS A HOUSE
app.post('/houses', async(req, res) => {
  const house = new HouseModel({
    List_No: req.body.List_No,
    Property_Name: req.body.Property_Name,
    Price: req.body.Price,
    House_Type: req.body.House_Type,
    Area_in_sq_ft: req.body.Area_in_sq_ft,
    No:req.body.No,
    Location: req.body.Location,
    City_County: req.body.City_County,
    Postal_Code: req.body.Postal_Code
  });
  try{
      const newHouse = await house.save();
      res.json(newHouse);
  }catch(err){
    res.status(500).json({message: err});
  }
});


//DELETE A HOUSE BY ID
app.delete('/houses/:houseId', async(req, res) => {
    try{
        const removedHouse = await HouseModel.deleteOne({_id: req.params.houseId });
        res.json(removedHouse);
    }catch(err) {
        res.status(500).json({ message: err });
    }
});


//UPDATE A HOUSE BY ID
app.patch('/houses/:houseId',getHouse, async (req, res) => {
  if (req.body.List_No != null) {
    res.house.List_No = req.body.List_No;
  }
  if (req.body.Property_Name != null) {
    res.house.Property_Name = req.body.Property_Name;
  }
  if (req.body.Price != null) {
    res.house.Price = req.body.Price;
  }
  if (req.body.House_Type != null) {
    res.house.House_Type = req.body.House_Type;
  }
  if (req.body.Area_in_sq_ft != null) {
    res.house.Area_in_sq_ft = req.body.Area_in_sq_ft;
  }
  if (req.body.No != null) {
    res.house.No = req.body.No;
  }
  if (req.body.Location != null) {
    res.house.Location = req.body.Location;
  }
  if (req.body.City_County != null) {
    res.house.City_County = req.body.City_County;
  }
  if (req.body.Postal_Code != null) {
    res.house.Postal_Code = req.body.Postal_Code;
  }

  try {
    const updatedHouse = await res.house.save();
    res.json(updatedHouse);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//Middleware function to get a single house by ID
async function getHouse(req, res, next) {
  let house;
  try {
  house = await HouseModel.findById(req.params.id);
  if (house == null) {
  return res.status(404).json({ message: 'Cannot find house listing' });
  }
  } catch (err) {
  return res.status(500).json({ message: err.message });
  }
  res.house = house;
  next();
}


//listenin' to server(port)
app.listen(8080);       

//to use in test
module.exports = app;
