const { convertCase } = require('../utility/convertCase');
const topSightsScraper = require('../scraper/topSights');
const descScraper = require('../scraper/desc');
const { client, db } = require('../utility/db');

module.exports.getTopSights = async (req, res) => {
  const id = convertCase(req.query.id);
  console.log('Top sights', id);
  // console.log(id);
  try {
    const dbRes = await client.db(db).collection('top_sights').findOne({ name: id });

    if (dbRes === null) {
      console.log('Empty');
      try {
        const resArr = await topSightsScraper(id);
        const resObj = {
          name: id,
          topPlaces: resArr,
          timestamp: new Date().toJSON()
        }
        if (resArr.length > 0) {
          res.status(200).json(resObj);
        } else {
          res.status(404).json(resObj);
        }
      } catch (err) {
        res.status(500).json(
          { name: id, topPlaces: [], timestamp: new Date().toJSON() }
        )
      }
    } else {
      res.send(dbRes);
    }

  } catch (err) {
    res.status(500).json({ name: id, topPlaces: [], timestamp: new Date().toJSON() });
  }
}

module.exports.getHotels = async (req, res) => {
  const id = convertCase(req.query.id);
  console.log('hotels', id);
  // console.log(id);
  try {
    const dbRes = await client.db(db).collection('hotels').findOne({ name: id });

    if (dbRes === null) {
      console.log('Empty');
      res.status(500).json({ name: id, hotels: [], timestamp: new Date().toJSON() })
    } else {
      res.send(dbRes);
    }
  } catch (err) {
    res.status(500).json({ name: id, hotels: [], timestamp: new Date().toJSON() });
  }
}


module.exports.getDesc = async (req, res) => {
  const id = convertCase(req.query.id);
  console.log('desc', id);
  // console.log(id);

  try {
    const resArr = await descScraper(id);
    const resObj = {
      name: id,
      desc: resArr,
      timestamp: new Date().toJSON()
    }

    if (resArr.length > 0) {
      res.status(200).json(resObj);
    } else {
      res.status(404).json(resObj);
    }

  } catch (err) {
    res.status(500).json(
      { name: id, desc: [], timestamp: new Date().toJSON() }
    )
  }
}