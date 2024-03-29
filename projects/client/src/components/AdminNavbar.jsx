import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Box, Button, Divider, Stack, Text } from "@chakra-ui/react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Icon, SearchIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { GrLocation, GrUser } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { resetAdmin } from "../features/adminSlice";
import { FaList, FaUserPlus } from "react-icons/fa";
import { BiCategory } from "react-icons/bi";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", current: true },
  { name: "Products", href: "/admin/products", current: false },
  { name: "Orders", href: "/admin/orders", current: false },
  { name: "Promo", href: "/admin/discounts", current: false },
  { name: "Sales Report", href: "/admin/sales-report", current: false },
  { name: "Stock History", href: "/admin/stock-history", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const AdminNavbar = () => {
  const nav = useNavigate();
  const adminGlobal = useSelector((state) => state.admin.admin);
  const dispatch = useDispatch();

  return (
    <Disclosure
      as="nav"
      className="bg-white color-gray sticky top-0 z-50 drop-shadow-md max-w-full"
    >
      {({ open }) => (
        <>
          <div
            className={
              open ? "flex md:py-4" : "py-7 flex md:justify-around md:py-4"
            }
          >
            <div className="absolute inset-y-0 left-0 flex items-top sm:hidden">
              {/* Mobile menu button*/}
              <Disclosure.Button className="inline-flex rounded-md  mt-4 ml-3">
                <span className="sr-only">Open main menu</span>
                {open ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </Disclosure.Button>
            </div>

            <div className="py-3 absolute inset-y-0 right-0 flex gap-2 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 md:gap-3 md:py-0 lg:gap-6">
              <div className="flex flex-1 gap-5 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          window.location.pathname == item.href
                            ? "text-pink-500 hover:text-gray-300"
                            : "hover:text-gray-300",
                          "px-3 py-2 text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* <div>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <SearchIcon />
                    </InputLeftElement>
                    <Input placeholder="Search product" size="sm" w={{ base: "95px", md: "150px", lg: "700px" }} rounded="lg" />
                  </InputGroup>
                </div> */}
              <div className="self-start">
                <Menu>
                  <MenuButton
                    as={Button}
                    size="sm"
                    variant="ghost"
                    colorScheme="pink"
                    rounded="full"
                    border="1px"
                  >
                    <Icon as={GrUser} mr="1" color="white" />
                    <span />
                    {adminGlobal.name}
                  </MenuButton>
                  <MenuList>
                    {adminGlobal.role === 99 ? (
                      <Box textColor={"gray"}>
                        <MenuItem
                          className="flex gap-2 items-center"
                          onClick={() => {
                            nav("/admin/user-management");
                          }}
                        >
                          <FaUserPlus />
                          <Text>User Management</Text>
                        </MenuItem>
                        <MenuItem
                          className="flex gap-2 items-center"
                          onClick={() => {
                            nav("/admin/categories");
                          }}
                        >
                          <BiCategory />
                          <Text>Category Management</Text>
                        </MenuItem>
                        <Divider />
                      </Box>
                    ) : (
                      <></>
                    )}

                    <MenuItem
                      onClick={() => {
                        alert("logging out");
                        dispatch(resetAdmin());
                        nav("/");
                      }}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-2 px-2 pb-4 pt-2">
              <Disclosure.Button className="my-3"></Disclosure.Button>
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    window.location.pathname === item.href
                      ? "text-pink-500"
                      : "text-gray-300 hover:text-green-300",
                    "block px-3 py-2 text-base font-medium"
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default AdminNavbar;
