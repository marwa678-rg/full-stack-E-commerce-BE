//Imports
const {
  createProductSchema,
  updateProductSchema,
} = require("../validation/product.validation");
const { Product } = require("../models/Products");

//__________________create Product_____________
async function createProduct(request, response) {
  try {
    //userData
    const userId = request.user.userId;
    //validation
    const { value, error } = createProductSchema.validate(request.body, {
      abortEarly: false,
    });

    if (error) {
      return response
        .status(400)
        .json({ messages: error.details.map((e) => e.message) });
    }

    // Handle file uploads
    const imageCover = request.files?.imageCover?.[0]?.filename;
    const images = request.files?.images?.map((file) => file.filename) || [];
    if (!imageCover) {
      return response.status(400).json({ message: "Image Cover is required" });
    }

    //create Product
    const product = await Product.create({
      ...value,
      imageCover,
      images,
      createdBy: userId,
    });
    response
      .status(201)
      .json({ message: "Product Created Successfully", product });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}

//_______________get all Products___________________
async function getAllProducts(request, response) {
  try {
    //Pagination and Search
    let {
      page = 1,
      pageSize = 10,
      search = "",
      category,
      brand,
    } = request.query;
    const limit = pageSize;
    const skip = (page - 1) * pageSize;
    //search condition
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category) {
      query.category = {
        $regex: category,
        $options: "i",
      };
    }
    if (brand) {
      query.brand = { $regex: brand, $options: "i" };
    }

    //GET Products
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    //Total of products
    const total = await Product.countDocuments(query);

    response.status(200).json({
      page,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
      total,
      products,
    });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}

//______________get single Product________________________
async function getProduct(request, response) {
  try {
    const { id } = request.params;
    const product = await Product.findById(id);
    if (!product) {
      return response.status(404).json({ message: "Product Not Found" });
    }
    response.status(200).json({ product });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}

//update Product
async function updateProduct(request, response) {
  try {
    const { id } = request.params;
    const { value, error } = updateProductSchema.validate(request.body, {
      abortEarly: false,
    });
    if (error) {
      return response
        .status(400)
        .json({ messages: error.details.map((e) => e.message) });
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, value, {
      new: true,
      runValidators: true,
    }); //return data after update & handle error data
    if (!updatedProduct) {
      return response.status(404).json({ message: "Product Not Found" });
    }

    return response
      .status(200)
      .json({ message: "Product Updated Successfully", product: updatedProduct });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}

//delete Prouct
async function deleteProduct(request, response) {
  try {
    const { id } = request.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return response.status(404).json({ message: "Product Not Found" });
    }

    return response
      .status(200)
      .json({ message: "Product Deleted Successsfully" });
  } catch (error) {
    console.log(error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};
