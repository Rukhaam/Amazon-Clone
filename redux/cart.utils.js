export const addItemToCart = (cartItems, cartItemToAdd) => {
  const safeCartItems = cartItems || [];

  const existingCartItem = safeCartItems.find(
    (cartItem) => cartItem.id === cartItemToAdd.id
  );

  if (existingCartItem) {
    return safeCartItems.map((cartItem) =>
      cartItem.id === cartItemToAdd.id
        ? {
            ...cartItem,
            quantity: cartItem.quantity + cartItemToAdd.quantity,
          }
        : cartItem
    );
  }

  return [
    ...safeCartItems,
    {
      ...cartItemToAdd,
      quantity: cartItemToAdd.quantity,
    },
  ];
};

export const removeItemFromCart = (cartItems, cartItemToRemove) => {
  // === SAFETY CHECK ===
  const safeCartItems = cartItems || [];

  const existingCartItem = safeCartItems.find(
    (cartItem) => cartItem.id === cartItemToRemove.id
  );

  if (!existingCartItem) {
    return safeCartItems;
  }

  if (existingCartItem.quantity === 1) {
    return safeCartItems.filter(
      (cartItem) => cartItem.id !== cartItemToRemove.id
    );
  }

  // Otherwise, decrease quantity by 1
  return safeCartItems.map((cartItem) =>
    cartItem.id === cartItemToRemove.id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
  );
};
