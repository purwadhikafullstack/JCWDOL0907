import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FaPlus, FaTrash } from "react-icons/fa";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  RadioGroup,
  Radio,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import moment from "moment";
import { addDiscount, deleteDiscount, getDiscounts } from "../api/discountApi";
import { fetchProducts } from "../api/userApi";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { useCustomToast } from "../hooks/useCustomToast";

function AdminDiscount() {
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const adminData = useSelector((state) => state.admin.admin);
  const adminToken = localStorage.getItem("admin_token");
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [toBeDeleted, setToBeDeleted] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();

  const initialRef = useRef();

  const handleDeleteDiscount = (id) => {
    setToBeDeleted(id);
    setModalOpen(true);
  };

  const ConfirmDeleteDiscount = async () => {
    setModalOpen(false);
    try {
      const response = await deleteDiscount(toBeDeleted, adminToken);

      showSuccessToast(response);
    } catch (error) {
      showErrorToast(error);
    } finally {
      setToBeDeleted(null); // Reset the toBeDeleted state
      window.location.reload();
    }
  };

  const ModalAddDiscount = () => {
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
      try {
        const data = {
          discount_type: values.discount_type,
          discount_value_type: values.discount_value_type,
          discount_value: values.discount_value,
          start_date: values.start_date,
          end_date: values.end_date,
          store_id: adminData.store_id,
          products: values.products,
        };

        await addDiscount(data, adminToken);

        showSuccessToast("Promo added successfully.");
        onAddClose();
        resetForm();
        setSubmitting(false);
        window.location.reload();
      } catch (error) {
        showErrorToast(error);
      }
    };

    const validationSchema = Yup.object().shape({
      discount_type: Yup.string().required("Pilih tipe diskon"),
      discount_value_type: Yup.string().when("discount_type", {
        is: (val) => val !== "BUY_1_GET_1",
        then: () => Yup.string().required("Discount Value Type is required"),
        otherwise: () => Yup.string().nullable(),
      }),
      discount_value: Yup.number()
        .required("Isi nilai diskon")
        .typeError("Diskon harus berupa angka")
        .when("discount_type", {
          is: (val) => val !== "BUY_1_GET_1",
          then: () => Yup.string().required("Discount Value Type is required"),
          otherwise: () => Yup.string().nullable(),
        })
        .when("discount_value_type", {
          is: (val) => val === "PERCENTAGE",
          then: () =>
            Yup.number().max(100, "Nilai diskon tidak boleh lebih dari 100"),
        }),
      start_date: Yup.date()
        .required("Pilih tanggal mulai")
        .min(
          new Date().toISOString().slice(0, 10),
          "Tanggal mulai harus setelah atau sama dengan tanggal hari ini"
        ),
      end_date: Yup.date()
        .required("Pilih tanggal akhir")
        .min(
          Yup.ref("start_date"),
          "Tanggal akhir harus setelah tanggal mulai"
        ),
      products: Yup.array().when("discount_type", {
        is: (val) => val !== "VOUCHER",
        then: () => Yup.array().min(1, "Discount Value Type is required"),
        otherwise: () => Yup.array().nullable(),
      }),
    });

    return (
      <Modal
        initialFocusRef={initialRef}
        isOpen={isAddOpen}
        onClose={onAddClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Discount</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Formik
              initialValues={{
                discount_type: "",
                discount_value_type: "",
                discount_value: null,
                start_date: "",
                end_date: "",
                products: [],
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <>
                  <Form>
                    <FormControl>
                      <FormLabel>Discount Type</FormLabel>
                      <RadioGroup name="discount_type">
                        <Field as={Radio} name="discount_type" value="LANGSUNG">
                          LANGSUNG
                        </Field>
                        <Field
                          as={Radio}
                          name="discount_type"
                          value="BUY_1_GET_1"
                        >
                          BUY 1 GET 1
                        </Field>
                      </RadioGroup>
                      <ErrorMessage
                        name="discount_type"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </FormControl>

                    <FormControl
                      className={
                        values.discount_type === "BUY_1_GET_1" ? "hidden" : null
                      }
                    >
                      <FormLabel>Discount Value Type</FormLabel>
                      <RadioGroup name="discount_value_type">
                        <Field
                          as={Radio}
                          name="discount_value_type"
                          value="PERCENTAGE"
                        >
                          PERCENTAGE
                        </Field>
                        <Field
                          as={Radio}
                          name="discount_value_type"
                          value="NOMINAL"
                        >
                          NOMINAL
                        </Field>
                      </RadioGroup>
                      <ErrorMessage
                        name="discount_value_type"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </FormControl>

                    <FormControl
                      className={
                        values.discount_type === "BUY_1_GET_1" ? "hidden" : null
                      }
                    >
                      <FormLabel>Discount Value</FormLabel>
                      <Field as={Input} name="discount_value" />
                      <ErrorMessage
                        name="discount_value"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Start Date</FormLabel>
                      <Field as={Input} type="date" name="start_date" />
                      <ErrorMessage
                        name="start_date"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>End Date</FormLabel>
                      <Field as={Input} type="date" name="end_date" />
                      <ErrorMessage
                        name="end_date"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Products</FormLabel>
                      <div className="max-h-32 overflow-y-auto">
                        <div className="grid grid-cols-3 gap-1">
                          {products.map((product) => (
                            <div key={product.product_id}>
                              <label>
                                <Field
                                  type="checkbox"
                                  name="products"
                                  value={product.product_name}
                                />
                                {product.product_name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <ErrorMessage
                        name="products"
                        component="div"
                        className="text-red-500 text-xs italic"
                      />
                    </FormControl>
                    <ModalFooter>
                      <Button colorScheme="green" mr={3} type="submit">
                        Save
                      </Button>
                      <Button colorScheme="red" onClick={onAddClose}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Form>
                </>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  useEffect(() => {
    const fetchDiscounts = async () => {
      const data = await getDiscounts(adminData.store_id, adminToken);
      const mergedData = Object.values(
        data.reduce((acc, obj) => {
          if (!acc[obj.discount_id]) {
            acc[obj.discount_id] = { ...obj };
          } else {
            acc[obj.discount_id].product_name += `, ${obj.product_name}`;
          }
          return acc;
        }, {})
      );
      setDiscounts(mergedData);
    };
    fetchDiscounts();
  }, [adminData.store_id]);

  useEffect(() => {
    const getProducts = async () => {
      const result = await fetchProducts(adminData.store_id);
      setProducts(result.products);
    };
    getProducts();
  }, [adminData.store_id]);

  return (
    <div className="flex flex-col md:w-[95%] xl:max-w-screen-xl mx-auto gap-10 my-5">
      <div className="flex justify-end">
        <button
          onClick={onAddOpen}
          className="bg-pink-500 hover:bg-pink-600 font-semibold text-white py-2 px-4 rounded-md mb-2 flex items-center"
        >
          <FaPlus size={15} className="mr-2" /> Add Discount
        </button>
      </div>
      <TableContainer whiteSpace="normal">
        <Table variant="striped" colorScheme="blue">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Product Name</Th>
              <Th>Discount Value</Th>
              <Th>Discount Type</Th>
              <Th>Discount Value Type</Th>
              <Th>Duration</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {discounts.map((discount) => (
              <Tr>
                <Td w="1px">{discount.discount_id}</Td>
                <Td w="400px">{discount.product_name}</Td>
                <Td w="1px">{discount.discount_value}</Td>
                <Td w="1px">{discount.discount_type}</Td>
                <Td w="1px">{discount.discount_value_type}</Td>
                <Td w="1px">
                  {moment(discount.start_date).format("MMMM DD YYYY")} -{" "}
                  {moment(discount.end_date).format("MMMM DD YYYY")}
                </Td>
                <Td w="1px">
                  <div
                    className="px-7 py-1 rounded bg-rose-500 hover:bg-rose-600 font-semibold text-white w-1/2 flex items-center justify-center gap-1 cursor-pointer"
                    onClick={() => {
                      handleDeleteDiscount(discount.discount_id);
                    }}
                  >
                    <FaTrash size={15} />
                    <p>Delete</p>
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <ModalAddDiscount />
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          ConfirmDeleteDiscount();
        }}
      />
    </div>
  );
}

export default AdminDiscount;
