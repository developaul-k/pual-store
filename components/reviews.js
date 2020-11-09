const strMap = require("fxjs/Strict/strMap");
const { noData } = require("./nodata");

const rating = (score) => {
  let _score = score > 5 ? 5 : score;

  return `
    <div class="rating">
      <div class="rating__area">
        <span class="rating__active" style="width: ${_score/5 * 100}%"></span>
      </div>
      <span class="rating__score">${_score}</span>
    </div>
  `
};

const renderReviews = (reviews) => `
  <section class="reviews">
    <h1 class="h2">리뷰(${reviews.length})</h1>
    <ul class="reviews__ul">
      ${strMap(({ text, updated_at, _: { users: { full_name }, ratings: { score } } }) => `
        <li class="reviews__li">
          <div class="reviews__avatar">
            <img src="/images/default_avatar.png" alt="" />
          </div>
          <div class="reviews__contents">
            <div class="reviews__username">${full_name}</div>
            ${rating(score)}
            <p class="reviews__text">${text}</p>
            <date class="reviews__date">${updated_at}</date>
          </div>
        </li>
      `, reviews) || noData('작성된 리뷰가 없습니다.')}
    </ul>
  </section>
`;

module.exports = {
  rating,
  renderReviews
}