class ApiFeatures  {
    constructor(query, querystr) {

        this.query= query;
        this.querystr = querystr

    }
    search() {
        const keyword = this.querystr.keyword? {
            name : {
                $regex: this.querystr.keyword,
                $options: "i"
            },
        } 
        : {};
        console.log(keyword);
        this.query = this.query.find({...keyword});
        return this
    }
    filter() {

        const querycopy = {...this.querystr};
        // some field remove for categories
        const removefield = ['keyword', 'page', 'limit'];
        removefield.forEach((key) => {
            delete querycopy[key];});
        //////////////filter for price and rating
            console.log(querycopy)
            let queryStr = JSON.stringify(querycopy);
            queryStr = queryStr.replace( /\b(gt|gte|lt|lte|in)\b/g, (key) => `$${key}`)

        this.query = this.query.find(JSON.parse(queryStr))
        console.log(queryStr)
            return this
    }

    pagination(resultPerPage) {

        const currentPage = Number(this.querystr.page) || 1;

        const skip = resultPerPage*(currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
    

}

module.exports = ApiFeatures