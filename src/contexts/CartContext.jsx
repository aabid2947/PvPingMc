import React, { createContext, useContext, useState, useEffect } from 'react';
// import { useBasket } from './BasketContext'; // Import the BasketContext
import { useUser } from '../context/UserContext'; // Import the UserContext

const CartContext = createContext();

// This will be initialized later when the context is used
let basketContext = null;

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  // Load cart from localStorage on initial render
  const { username } = useUser();
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('shoppingCart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });
  
  const [cartOpen, setCartOpen] = useState(false);
  const [pendingBasketOperations, setPendingBasketOperations] = useState([]);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('shoppingCart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);
  
  // // Process any pending basket operations
  useEffect(() => {
    const processPendingOperations = async () => {
      // If we have no pending operations, return
      if (pendingBasketOperations.length === 0) {
        return;
      }
      
      // Get reference to basketContext functions if they're available
      // This is needed because BasketContext might not be initialized on first render
      if (!basketContext) {
        try {
          // Try to import the context dynamically
          // This avoids circular dependency issues
          const { useBasket } = require('./BasketContext');
          if (useBasket) {
            try {
              basketContext = useBasket();
             
            } catch (error) {
              console.warn('BasketContext not yet available, will retry');
              return; // Will retry on next render
            }
          }
        } catch (error) {
          console.error('Error importing BasketContext:', error);
          return;
        }
      }
      
      // If we still don't have basket context, return
      if (!basketContext) {
        return;
      }
      
      // Check if we have a username before proceeding
      if (!basketContext.username) {
        console.warn('No username available for basket operations, will retry later');
        return; // Will retry on next render once username is set
      }
      
      // Check if we have a valid basket ID
      if (!basketContext.basketIdent && !basketContext.hasInitializedBasket) {
        // Try to initialize a basket first
        try {
          if(!username) {
            console.warn('No username available for basket operations, will retry later');  
            return; // Will retry on next render once username is set
          }
          const basketId = await basketContext.getOrCreateBasket(username);
          if (!basketId) {
            console.warn('Could not create or get basket, will retry later');
            return; // Will retry on next render
          }
        } catch (error) {
          console.error('Error initializing basket:', error);
          return;
        }
      }
      
      // Check if we can get the current basket data
      let currentBasket = null;
      try {
        // Only try to get basket if we have an identifier
        if (basketContext.basketIdent) {
          // Check if basket data is already loaded in context
          if (basketContext.basketData && basketContext.basketData.packages) {
            currentBasket = basketContext.basketData;
          } else {
            // Fetch basket data if not already loaded
            currentBasket = await basketContext.fetchBasket(basketContext.basketIdent);
          }
        }
      } catch (error) {
        console.error('Error fetching current basket data:', error);
      }
      
      // Process each pending operation
      const operations = [...pendingBasketOperations];
      setPendingBasketOperations([]); // Clear pending operations
      
      for (const op of operations) {
        try {
          if (op.type === 'add') {
            // Check if the item is already in the basket
            const alreadyInBasket = currentBasket && 
                                   currentBasket.packages && 
                                   currentBasket.packages.some(pkg => pkg.id === op.itemId);
            
            if (alreadyInBasket) {
            } else {
              // Item not in basket, add it
              await basketContext.addPackageToBasket(op.itemId, 1);
            }
          } else if (op.type === 'remove') {
            await basketContext.removePackageFromBasket(op.itemId);
          }
        } catch (error) {
          console.error(`Failed to process basket operation ${op.type} for item ${op.itemId}:`, error);
        }
      }
    };
    
    processPendingOperations();
  }, [pendingBasketOperations]);
  
  // sync from basket context
  const syncFromBasketContext = () => {
    try {
      if (basketContext && basketContext.basketData && basketContext.basketData.packages) {
        const newCart = basketContext.basketData.packages.map(pkg => ({
          id: pkg.id,
          name: pkg.name,
          price: pkg.price,
          description: pkg.description,
          category: pkg.category,
          image: pkg.image,
          url: pkg.url
        }));
        
        setCart(newCart);
      }
    } catch (error) {
      console.error('Error synchronizing cart from BasketContext:', error);
    }
  };
  // Sync cart with basket context on initial render
  useEffect(() => {
    if (basketContext && basketContext.basketData && basketContext.basketData.packages) {
      syncFromBasketContext();
    }
  }
  , [basketContext]);
  // Add an item to the cart
  const addToCart = (item) => {
    if (!item || !item.id) {
      console.error('Cannot add invalid item to cart:', item);
      return;
    }
    
    setCart(prevCart => {
      // Check if the item is already in the cart
      const itemExists = prevCart.some(cartItem => cartItem.id === item.id);
      
      if (itemExists) {
        // Item already exists, no need to add it again
        return prevCart;
      } else {
        // Add the new item to the cart
        
        // Queue this item to be added to the Tebex basket
        setPendingBasketOperations(prev => [
          ...prev, 
          { type: 'add', itemId: item.id, timestamp: Date.now() }
        ]);
        
        return [...prevCart, item];
      }
    });
    
    // Open the cart modal automatically when adding an item
    setCartOpen(true);
  };
  
  // Remove an item from the cart
  const removeFromCart = (itemId) => {
    if (!itemId) {
      console.error('Cannot remove item without ID from cart');
      return;
    }
    
    
    // Queue this item to be removed from the Tebex basket
    setPendingBasketOperations(prev => [
      ...prev, 
      { type: 'remove', itemId, timestamp: Date.now() }
    ]);
    
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };
  
  // Clear the entire cart
  const clearCart = () => {
    
    setCart([]);
    // Don't clear the Tebex basket here - that's handled separately during checkout
  };
  
  // Calculate the total price of items in the cart
  const getCartTotal = () => {
    return basketData.packages.reduce((total, item) => {
      // Handle undefined/null prices and non-string values
      const priceString = String(item.price || '');
      
      // Extract the numerical value safely
      const numericValue = parseFloat(
        priceString
          .replace(/[^0-9.]/g, '')  // Remove non-numeric characters
          .replace(/(\..*)\./g, '$1') // Remove extra decimals
      );
  
      // Ensure we have a valid number
      const numericPrice = Number.isFinite(numericValue) ? numericValue : 0;
      
      return total + numericPrice;
    }, 0).toFixed(2);
  };
  
  // Check if an item is in the cart
  const isInCart = (itemId) => {
    return cart.some(item => item.id === itemId);
  };
  
  // Get the number of items in the cart
  const getCartItemCount = () => {
    return cart.length;
  };
  
  // Open the cart modal
  const openCart = () => {
    setCartOpen(true);
  };
  
  // Close the cart modal
  const closeCart = () => {
    setCartOpen(false);
  };
  
  // Connect to the basket context
  const connectToBasketContext = (context) => {
    basketContext = context;
    
  };
  
  // Context value
  const value = {
    cart,
    cartOpen,
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    isInCart,
    getCartItemCount,
    openCart,
    closeCart,
    connectToBasketContext,
    pendingBasketOperations
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
} 