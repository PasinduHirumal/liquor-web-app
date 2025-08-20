
class Ratings {
    constructor(id, data) {
        this.rating_id = id;

        this.rating = data.rating;
        this.comment = data.comment;
        this.product_id = data.product_id;
        this.user_id = data.user_id;

        this.created_at = data.created_at;
    }
}

export default Ratings;