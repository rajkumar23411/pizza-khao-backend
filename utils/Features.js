class Features {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const query = { ...this.queryString };

    const removeFileds = ["keyword", "limit"];

    removeFileds.forEach((fields) => delete query[fields]);

    let queryString = JSON.stringify(query);

    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (key) => `$${key}`
    );

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }
  pagination(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
  loadMore(limit) {
    const skip = parseInt(this.queryString.skip) || 0;
    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
  search(fields = []) {
    const keyword = this.queryString.keyword
      ? {
          $or: fields.map((field) => {
            return {
              [field]: { $regex: this.queryString.keyword, $options: "i" },
            };
          }),
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
}

module.exports = Features;
