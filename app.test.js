const request = require('supertest');
const app = require('./app');
const { Int32 } = require('mongodb');
const { mongoose, Types, ObjectId } = require('mongoose');
const HouseModel = require('./models/House');


describe('GET /houses/:houseId', () => {
    it('should return a specific house', async () => {
      const houseData = {
        List_No: 123456,
        Property_Name: 'Test House',
        Price: 500000,
        Area_in_sq_ft: 1000,
        No: {
          Of_Bedrooms: 2,
          Of_Bathrooms: 6,
          Of_Receptions: 9
        },
        Postal_Code: 'E1 7PT'
      };
      const house = new HouseModel(houseData);
      const savedHouse = await house.save();
      const res = await request(app).get(`/houses/${savedHouse._id}`);
      expect(res.statusCode).toEqual(200);
      expect(house.Property_Name).toEqual('Test House');
    });

    it('should return 500 if house not found', async () => {
      const fakeId = '60a5c09c13569d023abl';
      const res = await request(app).get(`/houses/${fakeId}`);
      expect(res.statusCode).toEqual(500);
    });
});
  

describe('POST /houses', () => {
    it('should create a new house', async () => {
      const houseData = {
        List_No: 123456,
        Property_Name: 'Test House',
        Price: 100000,
        Area_in_sq_ft: 1000,
        No: {
          Of_Bedrooms: 9,
          Of_Bathrooms: 1,
          Of_Receptions: 1
        },
        Postal_Code: 'ET'
      };
      const res = await request(app)
        .post('/houses')
        .send(houseData);
      expect(res.statusCode).toEqual(200);
      expect(houseData.List_No).toEqual(123456);
    });
  });


  describe('DELETE /houses/:houseId', () => {
    it('should delete a specific house', async () => {
      //create a new house to delete
      const houseData = {
        List_No: 123456,
        Property_Name: 'Test House',
        Price: 253000,
        Area_in_sq_ft: 749,
        No: {
          Of_Bedrooms: 2,
          Of_Bathrooms: 5,
          Of_Receptions: 6
        },
        Postal_Code: 'ICW'
      };
      const createdHouse = await HouseModel.create(houseData);
      
      // Then, try to delete the house and check the response
      const res = await request(app)
        .delete(`/houses/${createdHouse._id}`)
        .send();
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('deletedCount', 1);
      
      // Finally, check that the house was actually deleted from the database
      const deletedHouse = await HouseModel.findById(createdHouse._id);
      expect(deletedHouse).toBeNull();
    });
    
  });


describe('PATCH /houses/:houseId', () => {
  it('should return 500 if house is not found', async () => {
      const fakeId = '60a5c09c13569d023abal';
      const res = await request(app).get(`/houses/${fakeId}`);
      expect(res.statusCode).toEqual(500);
    });
});


describe('GET /houses/search', () => {
  it('should return all houses if no query parameters are provided', async () => {
    const response = await request(app).get('/houses/search');
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('Houses');
    expect(response.body.Houses.length).toBeGreaterThan(0);
  });

  it('should return houses that match the search query', async () => {
    const response = await request(app).get('/houses/search?q=London');
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('Houses');
    expect(response.body.Houses.every(house => {
      return [
        house.Property_Name,
        house.House_Type,
        house.Location,
        house.City_County,
        house.Postal_Code
      ].some(field => field.toLowerCase().includes('london'))
    })).toBe(true);
  });

  it('should return houses that match the List_No query', async () => {
    const response = await request(app).get('/houses/search?listno=123');
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('Houses');
    expect(response.body.Houses.every(house => house.List_No === 123)).toBe(true);
  });

  it('should return houses that match the price range query', async () => {
    const response = await request(app).get('/houses/search?price_min=100000&price_max=200000');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('Houses');
    expect(response.body.Houses.every(house => {
      return house.Price >= 100000 && house.Price <= 200000;
    })).toBe(true);
  });
});

//to remove all houses have been created while testing
async function deleteHousesByListNo() {
  while(true) {
    const house = await HouseModel.findOne({ List_No: 123456 });
    if(!house) {
      break;
    }
    await HouseModel.deleteOne({ _id: house._id });
  }
}
deleteHousesByListNo();


