import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Stack } from "@chakra-ui/react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Icon, SearchIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuList, MenuItem, MenuItemOption, MenuGroup, MenuOptionGroup, MenuDivider } from "@chakra-ui/react";
import { BsFillCartFill } from "react-icons/bs";
import { GrLocation } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { resetUser } from "../features/userSlice";
import { resetCart } from "../features/cartSlice";
import { resetAddress } from "../features/addressSlice";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Products", href: "/products", current: false },
  { name: "Orders", href: "/orders", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const Navbar = () => {
  const [searchValue, setSearchValue] = useState("");

  const nav = useNavigate();
  const locationGlobal = useSelector((state) => state.location.location);
  const userGlobal = useSelector((state) => state.user.user);
  const cartGlobal = useSelector((state) => state.cart.cart);
  const userAddresses = useSelector((state) => state.address.address);
  let mainAddress;

  if (userAddresses) {
    mainAddress = userAddresses.find((address) => address.first_address === 1);
  }

  const dispatch = useDispatch();

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    nav(`/products?search=${searchValue}`);
  };

  return (
    <Disclosure as="nav" className="bg-white color-gray sticky top-0 z-50 drop-shadow-md">
      {({ open }) => (
        <>
          <div className="py-7 flex justify-around md:py-4">
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              {/* Mobile menu button*/}
              <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 hover:text-white">
                <span className="sr-only">Open main menu</span>
                {open ? <XMarkIcon className="block h-6 w-6" aria-hidden="true" /> : <Bars3Icon className="block h-6 w-6" aria-hidden="true" />}
              </Disclosure.Button>
            </div>

            <div className="absolute inset-y-0 right-0 flex gap-2 items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 md:gap-3 lg:gap-6">
              <div className="flex flex-1 gap-5 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="hidden sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(window.location.pathname == item.href ? "text-green-500 hover:text-gray-300" : "hover:text-gray-300", "px-3 py-2 text-sm font-medium")}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSearchSubmit}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon />
                  </InputLeftElement>
                  <Input placeholder="Search product" size="sm" w={{ base: "95px", md: "100px", lg: "600px" }} rounded="lg" value={searchValue} onChange={handleSearchChange} />
                </InputGroup>
                <button type="submit" style={{ display: "none" }} />
              </form>

              <div>
                <Menu>
                  <MenuButton as={Button} size="sm" variant="ghost" colorScheme="green" rounded="full" border="1px">
                    <Icon as={GrLocation} pb="1" mr="0.5" />
                    {mainAddress ? <span> {mainAddress.city_name} </span> : <span> {locationGlobal.city} </span>}
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        nav("/profile");
                      }}
                    >
                      Change address
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>

              <div className="flex">
                {/* {cartGlobal.cart_count > 0 ? <p className="bg-red-500 text-white px-1 text-xs rounded-full mb-3">{cartGlobal.cart_count}</p> : <></>} */}

                <button
                  type="button"
                  className="pr-1 text-gray-500 hover:text-gray-300"
                  onClick={() => {
                    nav("/cart");
                  }}
                >
                  <Icon as={BsFillCartFill} />
                </button>
              </div>

              <div className="hidden md:block">
                {userGlobal.user_id > 0 ? (
                  //when user is logged in
                  <>
                    <Menu>
                      <MenuButton as={Button} size="sm" variant="solid" bg="green.400" color="white" maxW="100px">
                        {/* <Icon as={GrUser} mr="1" color="white" /> */}
                        <span />
                        Hi, {userGlobal.name}!
                      </MenuButton>
                      <MenuList>
                        <MenuItem
                          onClick={() => {
                            nav("/profile");
                          }}
                        >
                          Profile
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            alert("logging out");
                            dispatch(resetUser());
                            dispatch(resetCart());
                            dispatch(resetAddress());
                            nav("/");
                          }}
                        >
                          Logout
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </>
                ) : (
                  //when user is logged out
                  <>
                    <Stack direction="row" spacing={1}>
                      <Button
                        colorScheme="green"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          nav("/login");
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        bg="green.400"
                        color="white"
                        variant="solid"
                        size="sm"
                        onClick={() => {
                          nav("/register");
                        }}
                      >
                        Register
                      </Button>
                    </Stack>
                  </>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-2 px-2 pb-4 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(item.current ? "text-green-500" : "text-gray-300 hover:text-green-300", "block px-3 py-2 text-base font-medium")}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <Disclosure.Button className="mx-2">
                {userGlobal.user_id > 0 ? (
                  //when user is logged in
                  <>
                    <Menu>
                      <MenuButton as={Button} size="sm" variant="solid" colorScheme="green">
                        {/* <Icon as={GrUser} mr="1" color="white" /> */}
                        <span />
                        Hi, {userGlobal.name}!
                      </MenuButton>
                      <MenuList>
                        <MenuItem>Profile</MenuItem>
                        <MenuItem
                          onClick={() => {
                            alert("logging out");
                            dispatch(resetUser());
                            dispatch(resetCart());
                            dispatch(resetAddress());
                            nav("/");
                          }}
                        >
                          Logout
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </>
                ) : (
                  //when user is logged out
                  <>
                    <Stack direction="row" spacing={1}>
                      <Button
                        colorScheme="green"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          nav("/login");
                        }}
                      >
                        Login
                      </Button>
                      <Button
                        bg="green.400"
                        color="white"
                        variant="solid"
                        size="sm"
                        onClick={() => {
                          nav("/register");
                        }}
                      >
                        Register
                      </Button>
                    </Stack>
                  </>
                )}
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
