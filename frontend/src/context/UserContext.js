import React, {useState, useEffect} from "react"

const UserContext = React.createContext({});

const UserProvider = (props) => {
    const [userState, setUserState] = useState({});
    const [cartItems, setCartItems] = useState([]);
    //userState is in a structure {success: boolean, token: string, userId: _id, userInfo: {}}
    //cartItems is in a structure [{product: object, count: number}]

    //insert new item or increment the count of item
    const addToCart = (newItem) => {
        let updatedCartItems = [];
        setCartItems( previousCartItems => {
            const index = previousCartItems.findIndex( item => {  
                                                    const {product} = item;
                                                    const ida = product._id.valueOf()
                                                    const idb = newItem._id.valueOf();
                                                    return ida === idb})
            
            if (index === -1) {
                updatedCartItems = [...previousCartItems, {product: newItem, count: 1}]
            } else {
                updatedCartItems = [
                    ...previousCartItems.slice(0, index),
                    {product: previousCartItems[index].product, count: previousCartItems[index].count+1},
                    ...previousCartItems.slice(index+1)
                ];
            }
            return updatedCartItems;
        })
    }

    //update the count of items in the cart from Cart Dialog
    const updateCart = (amendedProduct, amendedCount) => {
        let updatedCartItems = [];
        setCartItems( (prev) => {
            const index = prev.findIndex( item => {
                const {product} = item;
                const ida = amendedProduct._id.valueOf()
                const idb = product._id.valueOf();
                return ida === idb});
            if (index === -1) {
                //updatedCartItems = prev.push({product:amendedProduct, count: amendedCount});
            } else {
                
                if (amendedCount === 0) {
                  updatedCartItems = prev.splice(index, 1);
                }                   
                updatedCartItems = [...prev.slice(0, index), {product:amendedProduct, count: amendedCount}, ...prev.slice(index+1)];
            }
            return updatedCartItems;           
        })
    }

    //empty cart
    const emptyCart = () => {
        setCartItems([]);
        localStorage.setItem(userState.details.userId, "");
    }

    
    useEffect( () => {
        //inital read context from storage
        if (userState.details !== undefined && userState.details.userId !== undefined) {
            const shoppingCart = JSON.parse(localStorage.getItem(userState.details.userId));
            if (shoppingCart) {
                setCartItems(shoppingCart);
            }
        }
        
    }, [userState.details]);

    //update to storage
    useEffect( () => {
        if (userState.details !== undefined && userState.details.userId !== undefined) {
            localStorage.setItem(userState.details.userId, JSON.stringify(cartItems));
        }       
    }, [cartItems])


    return (
        <UserContext.Provider value={{userContext:userState, setUserContext:setUserState, cartItems:cartItems, 
        addToCart:addToCart, updateCart:updateCart, emptyCart:emptyCart}}>
          {props.children}
        </UserContext.Provider>
      );
}

export {UserContext, UserProvider}