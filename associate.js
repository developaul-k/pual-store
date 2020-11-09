const { ASSOCIATE_MODULE } = require('./database');
const { map, reduce, add } = require('fxjs/Strict');

const Reviews = {};

Reviews.ratings = () => ASSOCIATE_MODULE`
  < ratings ${{
    hook: (ratings) =>
      reduce(
        add,
        map(({ score }) => score, ratings)
      ) / ratings.length || 0,
  }}
`;

module.exports = {
  Reviews,
};
