import axios from 'axios';
import toast from 'react-hot-toast';
import { create } from 'zustand';


export const useImageStore = create((set) => ({
    products: [],
    loading: false,

    createProduct: async (productData: any) => {
        set({loading: true})
        try {
            const res = await axios.post('/api/add', productData);
            set((prevState: any) => ({
                products: [...prevState.products, res.data],
                loading: false
            }))
        } catch (error) {
            toast.error("Unable to Add Image at this Moment")
            set({loading: false});
        }
    },

    getAllProducts: async () => {
        set({loading: true})
        try {
            const res = await axios.get('/api/getall');
            set({products: res.data, loading: false})
        } catch (error) {
            toast.error("Unable to fetch Images at this Moment")
            set({loading: false});
        }
    },

    searchText: async (text: string) => {
        set({loading: true})
        try {
            const res = await axios.post('/api/search', {searchText: text});
            set({products: res.data, loading: false})
            
        } catch (error) {
            toast.error("Unable to fetch Images at this Moment")
            set({loading: false});
        }
    }
})) 