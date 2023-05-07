const searchMiddleware = (model) => {
  return async (req, res, next) => {
    // Pagination
    const skip = req.query.skip * req.query.limit || 0;
    const limit = req.query.limit || 10;

    const results = {};

    // Sort
    const sort = {};
    if (req.query.sortBy && req.query.orderBy) {
      sort[req.query.sortBy] =
        req.query.orderBy.toLowerCase() === "desc" ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    // Search
    let keys = [
      "limit",
      "skip",
      "orderBy",
      "sortBy",
      "start_date",
      "end_date",
      "expectedDeliveryDate",
    ];
    let filter = {};
    const filterQuery = Object.keys(req.query)
      .filter((key) => !keys.includes(key))
      .reduce((obj, key) => {
        return Object.assign(obj, {
          [key]: req.query[key],
        });
      }, {});

    const queries =
      (!!Object.keys(filterQuery).length > 0 &&
        Object.entries(filterQuery).map((queries) => {
          return { [queries[0]]: { $regex: new RegExp(queries[1], "i") } };
        })) ||
      [];

    const { start_date, end_date, expectedDeliveryDate } = req.query;

    const dates =
      !!start_date && !!end_date
        ? {
            createdAt: {
              $gte: start_date,
              $lte: end_date,
            },
          }
        : {};

    const oneDate = !!expectedDeliveryDate
      ? {
          expectedDeliveryDate: { $gte: expectedDeliveryDate },
        }
      : {};

    if (req.query && (dates || queries)) {
      queries.push(dates);
      queries.push(oneDate);
      filter = {
        $and: [...queries],
      };
    }

    try {
      results.data = await model
        .find(filter)
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .select("-password")
        .exec();

      const totalCount = await model.find(filter).countDocuments().exec();
      results.totalDocs = totalCount;

      // Add paginated Results to the request
      res.paginatedResults = results;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = searchMiddleware;
