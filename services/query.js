
const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 50;

function getPagination(query){
    const page = +query.page || DEFAULT_PAGE_NUMBER; //Use Math.abs() to convert to positive number
    const limit = +query.limit || DEFAULT_PAGE_LIMIT;
    const skip = page ? (page - 1) * limit : 0;
    return { skip, limit };
}


module.exports = {
    getPagination
}