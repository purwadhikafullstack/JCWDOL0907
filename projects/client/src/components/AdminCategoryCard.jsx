import React, { useState } from 'react';
import { FaPen, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { Input, useDisclosure } from '@chakra-ui/react';
import AdminAddCategoryModal from '../components/AdminAddCategoryModal';
import AdminEditCategoryModal from '../components/AdminEditCategoryModal';

function AdminCategoryCard({ categories, getCategories, limit, resetPage }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    onEditOpen();
  };

  const handleDeleteCategory = async (id) => {
    const adminToken = localStorage.getItem('admin_token')
    try {
      const response = await axios.delete(`http://localhost:8000/api/admin/products/categories/${id}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }
      );

      alert(response.data.message);
      resetPage();
      getCategories("", 1, limit);
    } catch (error) {
      console.error(error);
      alert(error.data.message)
    }
  };

  return (
    <>{
      categories.map((category) => (
        <div
          key={category.value}
          className="w-full md:w-[48%] lg:w-[49%] p-2 border border-pink-500 rounded-md  shadow-md"
        >
          <div className="flex">
            <div className="flex flex-row items-center border-gray-200 rounded overflow-hidden w-1/2 gap-2 px-1">
              <img
                className="w-16 h-16 rounded-md"
                src={"http://localhost:8000/" + category.image}
                alt=""
              />
              <div>
                <p className="text-lg font-semibold text-pink-500 ">Kategori:</p>
                <p className="text-md font-medium">
                  {category.label}
                </p>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-1 items-center w-1/2 border-l-2">
              <div
                className="px-2 py-1 rounded bg-teal-500 hover:bg-teal-600 font-semibold text-white w-1/2 flex items-center justify-center gap-1 cursor-pointer"
                onClick={() => handleEditCategory(category)}
              >
                <FaPen size={15} />
                <p>Edit</p>
              </div>
              <div
                className="px-2 py-1 rounded bg-rose-500 hover:bg-rose-600 font-semibold text-white w-1/2 flex items-center justify-center gap-1 cursor-pointer"
                onClick={() => handleDeleteCategory(category.value)}
              >
                <FaTrash size={15} />
                <p>Delete</p>
              </div>
            </div>
          </div>
        </div>
      ))}
      <AdminEditCategoryModal isOpen={isEditOpen} onClose={onEditClose} fetchCategories={getCategories} selectedCategory={selectedCategory} limit={limit} />
    </>

  );
}

export default AdminCategoryCard;
