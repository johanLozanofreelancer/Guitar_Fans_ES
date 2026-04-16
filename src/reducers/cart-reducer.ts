import { db } from "../data/db"
import type { CartItem, Guitar } from "../types"


export type CartActions = 
    { type: 'add-to-Cart', payload: {item: Guitar}} |
    { type: 'remove-from-cart', payload: {id: Guitar['id']}} |
    { type: 'increase-quantity', payload: {id: Guitar['id']}} |
    { type: 'decrease-quantity', payload: {id: Guitar['id']}} |
    { type: 'clear-cart'} 


export type CartState = {
    data: Guitar[],
    cart: CartItem[]
}

const initialCart = (): CartItem[] => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []}

export const InitialState : CartState = {
    data : db,
    cart: initialCart()
}

const MAX_ITEMS = 5
const MIN_ITEMS = 1

export const cartReducer = (
        state: CartState = InitialState,
        actions: CartActions
    ) => {
            if(actions.type === 'add-to-Cart') {
                const itemExist = state.cart.find(guitar => guitar.id === actions.payload.item.id)
                let updatedCart: CartItem[] = []
                if (itemExist ){
                    updatedCart = state.cart.map( item => {
                        if (item.id === actions.payload.item.id){
                            if (item.quantity < MAX_ITEMS) {
                                return { ...item, quantity: item.quantity + 1}
                            } else {
                                return item
                            }
                        } else {
                            return item
                        }
                    })
                    
                }else {
                    const newItem : CartItem = {...actions.payload.item, quantity: 1}
                    updatedCart = [...state.cart, newItem]
                }
                return{
                    ...state,
                    cart: updatedCart
                }
            }

            if(actions.type === 'remove-from-cart') {
                const updatedCart = state.cart.filter (item => item.id !== actions.payload.id)
                return {
                    ...state,
                    cart: updatedCart
                }
            }

            if(actions.type === 'increase-quantity') {
                const updatedCart= state.cart.map(item => {
                if(item.id === actions.payload.id && item.quantity < MAX_ITEMS){
                    return {
                    ...item,
                    quantity: item.quantity + 1
                    }
                }
                return item
                })
                
                return{
                    ...state,
                    cart: updatedCart
                }
            }

            if(actions.type === 'decrease-quantity') {
                const updatedCart = state.cart.map( item => {
                if(item.id === actions.payload.id && item.quantity > MIN_ITEMS ) {
                    return{
                    ...item,
                    quantity: item.quantity - 1
            }
        }
        return item
        })
                return {
                    ...state,
                    cart: updatedCart
                }
            }

            if (actions.type === 'clear-cart') {
                return {
                    ...state,
                    cart: []
                }
            }

            return state
        }

