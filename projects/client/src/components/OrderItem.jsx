import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Stack, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter, Text, Heading, Box, StackDivider, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, AlertDialogCloseButton } from "@chakra-ui/react";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Container } from "@chakra-ui/react";
import { formatRupiah } from "../utils/formatRupiah";
import axios from "axios";
import { fetchOrder, fetchStoreOrder } from "../features/orderSlice";
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from "@chakra-ui/react";

const OrderItem = ({ user_id, order_id, order_date, shipping_courier, shipping_type, shipping_price, total_price, payment_proof, order_status, origin, destination }) => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const userGlobal = useSelector((state) => state.user.user);
  const adminGlobal = useSelector((state) => state.admin.admin);
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  const { isOpen: isCancelOpen, onOpen: onCancelOpen, onClose: onCancelClose } = useDisclosure();
  const { isOpen: isProofOpen, onOpen: onProofOpen, onClose: onProofClose } = useDisclosure();
  const { isOpen: isReceivedOpen, onOpen: onReceivedOpen, onClose: onReceivedClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [previewImage, setPreviewImage] = useState(null);
  const [paymetProof, setPaymentProof] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);

  const renderDetails = () => {
    return orderDetails.map((o) => {
      return (
        <Tr>
          <Td>{o.product_name}</Td>
          <Td>{o.quantity}</Td>
          <Td isNumeric>{formatRupiah(o.price)}</Td>
        </Tr>
      );
    });
  };

  const handleRefresh = () => {
    window.location.reload(); // Refresh the page
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setPaymentProof(file);

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      alert("Only JPEG/JPG/PNG files are supported");
      return;
    }

    if (file.size > 1000000) {
      // size limit 1MB
      alert("Maximum size is 1MB");
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadButton = async () => {
    try {
      const formData = new FormData();
      formData.append("payment_proof", paymetProof);

      let response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/order/payment-proof/?orderId=${order_id}`, formData);

      if (response) {
        alert(response.data.message);
        dispatch(fetchOrder(userGlobal.user_id));
        onUploadClose();
        handleRefresh();
      }
    } catch (error) {
      alert(error.response.data);
    }
  };

  const handleCancel = async () => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/order/cancel/?orderId=${order_id}`);
      alert(response.data.message);
      dispatch(fetchOrder(userGlobal.user_id));
      onCancelClose();
      handleRefresh();
    } catch (error) {
      console.error("Failed to cancel order: ", error);
    }
  };

  const handleOrderReceived = async () => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/order/delivered/?orderId=${order_id}`);
      alert(response.data.message);
      dispatch(fetchOrder(userGlobal.user_id));
      onReceivedClose();
      handleRefresh();
    } catch (error) {
      console.error("Failed to confirm delivery: ", error);
    }
  };

  //admin
  const handleConfirm = async () => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/admin/order/confirm-payment/?orderId=${order_id}`);
      alert(response.data.message);
      dispatch(fetchStoreOrder(adminGlobal.store_id));
      onProofClose();
      handleRefresh();
    } catch (error) {
      alert(`Order status change failed`);
    }
  };

  const handleReject = async () => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/admin/order/reject-payment/?orderId=${order_id}`);
      alert(response.data.message);
      dispatch(fetchStoreOrder(adminGlobal.store_id));
      onProofClose();
      handleRefresh();
    } catch (error) {
      alert(`Order status change failed`);
    }
  };

  const handleSendOrder = async () => {
    try {
      const response = await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/admin/order/send/?orderId=${order_id}`);
      alert(response.data.message);
      dispatch(fetchStoreOrder(adminGlobal.store_id));
      onProofClose();
      handleRefresh();
    } catch (error) {
      alert(`Order status change failed`);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between sm:flex-col md:flex-row">
          <div className="flex flex-col gap-1 pr-5 lg:gap-3 lg:flex-row">
            <Heading size={["sm", "md", "md"]} mb="2">
              Order #{order_id}
              {adminGlobal.id != null ? <span className="text-pink-500 text-sm"> by user #{user_id} </span> : <></>}
            </Heading>
            <Text className="text-gray-400 font-bold text-xs md:text-xs lg:text-sm">{order_status}</Text>
          </div>
          <div className="flex gap-3">
            <Text className="text-sm text-gray-400 mt-1 text-xs">Order made: {order_date.toLocaleString("id-ID").slice(0, 10)}</Text>
            {adminGlobal.id != null || userGlobal.user_id != null ? (
              <>
                {order_status === "Waiting for payment" || order_status === "Waiting for confirmation" || order_status === "Processed" ? (
                  <Button variant="solid" colorScheme="red" onClick={onCancelOpen} size="xs">
                    Cancel
                  </Button>
                ) : (
                  <></>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </CardHeader>

        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box className="md:flex md:justify-between">
              <Heading size={["xs", "sm", "sm"]}>
                From <span className="text-green-600">{origin}</span>
              </Heading>
              <Text mt={[2, 0, 0]} size={["xs", "sm", "sm"]}>
                Shipped to {destination}
              </Text>
            </Box>

            <Box className="flex justify-between">
              <Heading size="sm">Subtotal</Heading>
              {/* <Container bg="blue.500"> */}
              <Accordion allowToggle allowMultiple={false} maxW={["200px", "200px", "300px", "550px"]}>
                <AccordionItem>
                  <h2>
                    <AccordionButton
                      className="flex justify-end gap-1"
                      onClick={async () => {
                        let response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/order/details/?orderId=${order_id}`);
                        setOrderDetails(response.data);
                      }}
                    >
                      {formatRupiah(total_price - shipping_price)}
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4}>
                    {/*  */}
                    <TableContainer>
                      <Table size="sm">
                        <Thead>
                          <Tr>
                            <Th>Product</Th>
                            <Th>Qty</Th>
                            <Th isNumeric>Price</Th>
                          </Tr>
                        </Thead>
                        <Tbody>{renderDetails()}</Tbody>
                      </Table>
                    </TableContainer>
                    {/*  */}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
              {/* </Container> */}
            </Box>

            <Box className="flex justify-between text-right">
              <Heading size="sm">Shipping</Heading>
              <div>
                {formatRupiah(shipping_price)}
                <div className="text-xs font-bold text-green-500 ">
                  {shipping_courier.toUpperCase()} - {shipping_type}
                </div>
              </div>
            </Box>
            <Box className="flex justify-between font-bold text-lg">
              <Heading size="md">Total</Heading>
              <Text>{formatRupiah(total_price)}</Text>
            </Box>
          </Stack>
        </CardBody>
        {userGlobal.user_id != null ? (
          // user view
          <CardFooter className="flex gap-3">
            {order_status === "Waiting for payment" ? (
              <>
                <Button variant="solid" colorScheme="orange" onClick={onUploadOpen}>
                  Upload Payment Proof
                </Button>
              </>
            ) : order_status === "Out for delivery" ? (
              <>
                <Button variant="solid" colorScheme="green" onClick={onReceivedOpen}>
                  Order received
                </Button>
              </>
            ) : (
              <></>
            )}
          </CardFooter>
        ) : adminGlobal.id != null ? (
          // admin view
          <CardFooter className="flex gap-3">
            {order_status === "Waiting for confirmation" ? (
              <>
                <Button variant="solid" colorScheme="orange" onClick={onProofOpen}>
                  See payment proof
                </Button>
              </>
            ) : order_status === "Processed" ? (
              <Button
                variant="solid"
                colorScheme="green"
                onClick={() => {
                  handleSendOrder();
                }}
              >
                Send order
              </Button>
            ) : (
              <></>
            )}
          </CardFooter>
        ) : (
          <></>
        )}
      </Card>

      {/* cancel alert */}
      <AlertDialog isOpen={isCancelOpen} leastDestructiveRef={cancelRef} onClose={onCancelClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Cancel order
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCancelClose}>
                Back
              </Button>
              <Button colorScheme="red" onClick={handleCancel} ml={3}>
                Cancel order
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* order received alert */}
      <AlertDialog isOpen={isReceivedOpen} leastDestructiveRef={cancelRef} onClose={onReceivedClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Order received
            </AlertDialogHeader>

            <AlertDialogBody>Please ensure that you have received all items in your order.</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onReceivedClose}>
                Back
              </Button>
              <Button colorScheme="green" onClick={handleOrderReceived} ml={3}>
                Order received
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* upload proof modal */}
      <Modal closeOnOverlayClick={false} isOpen={isUploadOpen} onClose={onUploadClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload payment proof</ModalHeader>

          <ModalBody>
            <div>
              <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                Payment proof
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                {previewImage ? (
                  <img src={previewImage} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded" />
                ) : (
                  <div className="text-center">
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">JPEG, JPG, PNG up to 1MB</p>
                  </div>
                )}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="orange" mr={3} onClick={handleUploadButton}>
              Upload
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onUploadClose();
                setPreviewImage(null);
              }}
            >
              Back
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* see proof modal */}
      <Modal isOpen={isProofOpen} onClose={onProofClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>See payment proof</ModalHeader>

          <ModalBody>
            <div>
              <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                Payment proof
              </label>

              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <Image src={`${process.env.REACT_APP_API_UPLOAD_URL}/${payment_proof}`} alt="Payment proof" />
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              colorScheme="red"
              onClick={() => {
                handleReject();
                onProofClose();
              }}
            >
              Reject
            </Button>
            <Button
              variant="solid"
              colorScheme="green"
              onClick={() => {
                handleConfirm();
                onProofClose();
              }}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default OrderItem;
