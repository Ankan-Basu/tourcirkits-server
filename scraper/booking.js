const axios = require("axios");
const { client, db } = require('../utility/db');
const dotenv = require('dotenv');

dotenv.config();

const getLocation = async (dest) => {
    const options = {
        method: 'GET',
        url: 'https://booking-com.p.rapidapi.com/v1/hotels/locations',
        params: { locale: 'en-gb', name: dest },
        headers: {
            'X-RapidAPI-Key': process.env.API_KEY_HOTELS_1,
            'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options)
        // console.log(response.data[0]);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}


const getHotels = async (destId, destType) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    // console.log(today.toISOString().split('T')[0])
    // console.log(tomorrow.toISOString().split('T')[0]);
    const options = {
        method: 'GET',
        url: 'https://booking-com.p.rapidapi.com/v1/hotels/search',
        params: {
            dest_id: destId,
            order_by: 'popularity',
            filter_by_currency: 'INR',
            adults_number: '2',
            room_number: '1',
            checkout_date: tomorrow.toISOString().split('T')[0],
            units: 'metric',
            checkin_date: today.toISOString().split('T')[0],
            dest_type: destType,
            locale: 'en-gb',
            // optional
            children_ages: '5,0',
            categories_filter_ids: 'class::2,class::4,free_cancellation::1',
            page_number: '0',
            include_adjacency: 'true',
            children_number: '2'
        },
        headers: {
            'X-RapidAPI-Key': process.env.API_KEY_HOTELS_1,
            'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        // console.log(response.data);
        const data = response.data;

        return data.result.map((hotel) => {
            const obj = {
                id: hotel.hotel_id,
                name: hotel.hotel_name,
                city: hotel.city,
                longitude: hotel.longitude,
                latitude: hotel.latitude,
                distFromCityCenter: hotel.distance_to_cc_formatted,
                url: hotel.url,
                reviewWord: hotel.review_score_word,
                checkin: hotel.checkin,
                checkout: hotel.checkout,
                photoUrlMax: hotel.max_photo_url,
                photoUrlMin: hotel.main_photo_url,
                price: hotel.min_total_price
            };
            return obj;
        })
    } catch (error) {
        console.error(error);
    }
}

const getReviews = async (hotelId) => {
    const options = {
        method: 'GET',
        url: 'https://booking-com.p.rapidapi.com/v1/hotels/reviews',
        params: {
            hotel_id: hotelId,
            locale: 'en-gb',
            sort_type: 'SORT_MOST_RELEVANT',
            // customer_type: 'solo_traveller,review_category_group_of_friends',
            language_filter: 'en-gb,de,fr'
        },
        headers: {
            'X-RapidAPI-Key': process.env.API_KEY_HOTELS_1,
            'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options)
        // console.log(response.data[0]);
        
        return response.data;
    } catch (error) {
        console.error(error);
    }
}


const func = async (dest) => {
    console.log('Calling loc api')
    let destId = undefined, destType = undefined;
    // console.log('dest', dest);
    const locResponse = await getLocation(dest);
    const loc = locResponse[0];
    destId = loc.dest_id;
    destType = loc.dest_type;

    // console.log(locResponse);
    // console.log(destId, destType);

    return [destId, destType];
}
       

module.exports.searchHotels = async (dest) => {
    const place = await client.db(db).collection('places').findOne({name: dest});
    let destId = undefined, destType = undefined;

    if (!place) {
        [destId, destType] = await func(dest);
        const obj = {
            name: dest,
            placeId: destId,
            placeType: destType,
            attributes: [],
            priority: 0
        };


        client.db(db).collection('places').insertOne(obj);

    } else {
        destId = place.placeId;
        destType = place.placeType;

        // console.log(destId, destType);

        if (!destId || !destType) {
            [destId, destType] = await func(dest);

            client.db(db).collection('places').updateOne({name: dest}, {$set: {placeId: destId, placeType: destType}});
        } else {
            // console.log('Found', destId, destType)
        }
    }

    let hotelResp = await getHotels(destId, destType);
    return hotelResp;
}