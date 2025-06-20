import axios, { AxiosResponse } from "axios";

let apiSecretKey: string | null = null;

const fetchApiKey = async () => {
    if (!apiSecretKey) {
        const response = await axios.get('/GetApiKey');
        apiSecretKey = response.data.apiKey;
    }
};

const getHeaders = async () => {
    await fetchApiKey();
    return {
        'Content-Type': 'application/json',
        'apiSecretKey': apiSecretKey
    };
};



// const headers = {
//     'Content-Type': 'application/json',
//     'apiSecretKey': "a112i122f120g111a97l105m111t114"
// }
//const sleep = () => new Promise(resolve => setTimeout(resolve, 500));
axios.defaults.baseURL = 'http://40.123.209.144:96/api/client/';
axios.defaults.withCredentials = true;
const responseBody = (response: AxiosResponse) => response.data;

// axios.interceptors.request.use(config => {
//     const token = store.getState().account.user?.token;
//     //const apiSecretKey = "a112i122f120g111a97l105m111t114"
//     if (token) config.headers.Authorization = token;
//     //if (apiSecretKey) config.headers['apiSecretKey'] = apiSecretKey;
//     return config;

// })






//console.log(result)


// axios.interceptors.response.use(async response => {
//     await sleep();

//     const pagination = response.headers['pagination'];
//     if (pagination) {
//         response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
//         return response;
//     }
//     return response
// }, (error: AxiosError) => {
//     const { data, status } = error.response as AxiosResponse;
//     switch (status) {
//         case 400:
//             if (data.errors) {
//                 const modelStateErrors: string[] = [];
//                 for (const key in data.errors) {
//                     if (data.errors[key]) {
//                         modelStateErrors.push(data.errors[key])
//                     }
//                 }
//                 throw modelStateErrors.flat();

//             }
//             toast.error(data.title);
//             break;
//         case 401:
//             toast.error(data.title);
//             break;
//         case 404:
//             toast.error(data.title);
//             break;
//         case 500:
//             router.navigate('/server-error', { state: { error: data } });
//             break;
//         default:
//             break;
//     }
//     return Promise.reject(error.response);
// })
// const request = {
//     get: (url: string, params?: URLSearchParams) => axios.get(url, { params, headers }).then(responseBody),
//     post: (url: string, body: object) => axios.post(url, body, { headers }).then(responseBody),
//     put: (url: string, body: object) => axios.put(url, body, { headers }).then(responseBody),
//     delete: (url: string) => axios.delete(url, { headers }).then(responseBody),
// };
const request = {
    get: async (url: string, params?: URLSearchParams) => axios.get(url, { params, headers: await getHeaders() }).then(responseBody),
    post: async (url: string, body: object) => axios.post(url, body, { headers: await getHeaders() }).then(responseBody),
    put: async (url: string, body: object) => axios.put(url, body, { headers: await getHeaders() }).then(responseBody),
    delete: async (url: string) => axios.delete(url, { headers: await getHeaders() }).then(responseBody),
};

const Account = {
    noplogin: (values: any) => request.post('Login', values),
    nopregister: (values: any) => request.post('Register', values),
    AddAddress: (values: any) => request.post('AddAddress', values),
    PasswordRecovery: (values: any) => request.post('PasswordRecovery', values),
    ContactUs: (values: any) => request.post('ContactUsSend', values),
    // currentUser: () => request.get('account/currentUser'),
};
const language = {
    StringResourceByName: (values: any) => request.get('GetStringResourceByName', values),
    AllStringResourcesByLanguageId: (values: any) => request.get('GetAllStringResourcesByLanguageId', values),
}

const Cart = {
    nopCart: (values: any) => request.post('Cart', values),
    nopRemoveFromCart: (values: any) => request.post('RemoveFromCart', values),
    AddProductToCart: (values: any) => request.post('DetailAddProductToCart', values),
    UpdateCart: (values: any) => request.post('UpdateCart', values),
};
const WishList = {
    nopWishList: (values: any) => request.post('WishList', values),
    nopRemoveFromWishList: (values: any) => request.post('RemoveFromWishList', values),
    AddProductToWishlist: (values: any) => request.post('DetailAddProductToCart', values),
    UpdateWishlist: (values: any) => request.post('UpdateWishlist', values),
};

const Home = {
    NivoSlider: (values: any) => request.post('NivoSlider', values),
    TopMenu: (values: any) => request.post('TopMenu', values),
    homePageProducts: (values: any) => request.post('HomePageProducts', values),
    newArrivalProductList: (values: any) => request.post('NewArrivalProductList', values),
    bestSellers: (values: any) => request.post('BestSellers', values),
    Vote: (values: any) => request.post('Vote', values),
    SubscribeNewsletter: (values: any) => request.post('SubscribeNewsletter', values),
};
const Search = {
    ProductSearch: (values: any) => request.post('ProductSearch', values),
};

const Manufacturers = {
    GetAllManufacturers: (values: any) => request.post('Manufacturer', values),
    ManufacturerProduct: (values: any) => request.post('ManufacturerProduct', values),
}

const ProductandCategory = {
    GetProductByCategory: (values: any) => request.post('GetProductByCategory', values),
    ProductDetail: (values: any) => request.post('ProductDetail', values),
    GetUrlRecord: (values: any) => request.post('GetUrlRecord', values),
    ProductDetailsAttributeChange: (values: any) => request.post('GetProductDetailsAttributeChange', values),
};
const CheckOut = {
    GetBillingAddress: (values: any) => request.post('GetBillingAddress', values),
    SelectBillingAddress: (values: any) => request.post('SelectBillingAddress', values),
    SelectShippingAddress: (values: any) => request.post('SelectShippingAddress', values),
    SelectShippingMethod: (values: any) => request.post('SelectShippingMethod', values),
    SelectPaymentMethod: (values: any) => request.post('SelectPaymentMethod', values),
    ConfirmOrder: (values: any) => request.post('ConfirmOrder', values),
    GetOrder: (values: any) => request.post('GetOrder', values),
    OrderDetails: (values: any) => request.post('OrderDetails', values),
    GetAllCountries: (values: any) => request.post('GetAllCountries', values),
    GetAllStateByCountryId: (values: any) => request.post('GetAllStateByCountryId', values),
};
const Profile = {
    Info: (values: any) => request.post('Info', values),
    UpdateInfo: (values: any) => request.post('InfoEdit', values),
    GetAddress: (values: any) => request.post('GetAddress', values),
    UpdateAddress: (values: any) => request.post('UpdateAddress', values),
    DeleteAddress: (values: any) => request.post('DeleteAddress', values),
}

const NopApi = {
    Account,
    Cart,
    Home,
    WishList,
    Search,
    ProductandCategory,
    CheckOut,
    Profile,
    language,
    Manufacturers
}
export default NopApi;