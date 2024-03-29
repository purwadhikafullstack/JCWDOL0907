import axios from 'axios';

export async function fetchCategories(categoryName, page, limit) {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/products/categories/`, {
      params: {
        categoryName,
        page,
        limit
      }
    });
    const categories = response.data.data;
    const categoriesTotal = response.data.total;
    const formattedCategories = categories.map((category) => ({
      value: category.product_category_id,
      label: category.product_category_name,
      image: category.product_category_image
    }));

    return { formattedCategories, categoriesTotal };
  } catch (error) {
    console.error(error);
    return [];
  }
};
