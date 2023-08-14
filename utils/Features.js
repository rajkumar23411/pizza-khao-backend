class Features {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        const query = { ...this.queryString };
        const removeFields = ["keyword", "limit", "page", "category", "sort"];

        removeFields.forEach((field) => delete query[field]);

        let queryString = JSON.stringify(query);

        queryString = queryString.replace(
            /\b(gt|gte|lt|lte)\b/g,
            (key) => `$${key}`
        );

        if (this.queryString.category) {
            const categories = this.queryString.category.split(",");
            this.query = this.query.where({ category: { $in: categories } });
        }

        if (this.queryString.sort) {
            const sortOptions = {
                "Price High to Low": { "prices.regular": -1 },
                "Price Low to High": { "prices.regular": 1 },
                "Name A to Z": { name: 1 },
                "Name Z to A": { name: -1 },
                "Newest First": { createdAt: -1 },
                "Oldest First": { createdAt: 1 },
            };
            this.query = this.query.sort(sortOptions[this.queryString.sort]);
        }
        this.query = this.query.find(JSON.parse(queryString));

        return this;
    }
    pagination(resultPerPage) {
        const page = parseInt(this.queryString.page) || 1;
        const skip = (page - 1) * resultPerPage;
        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
    search(fields = []) {
        const keyword = this.queryString.keyword
            ? {
                  $or: fields.map((field) => {
                      return {
                          [field]: {
                              $regex: this.queryString.keyword,
                              $options: "i",
                          },
                      };
                  }),
              }
            : {};
        this.query = this.query.find({ ...keyword });
        return this;
    }
}

module.exports = Features;
