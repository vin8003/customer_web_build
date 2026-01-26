module.exports = [
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[project]/src/services/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiService",
    ()=>apiService,
    "default",
    ()=>__TURBOPACK__default__export__,
    "setAuthToken",
    ()=>setAuthToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
;
const API_BASE_URL = ("TURBOPACK compile-time value", "https://api.ordereasy.win/api/") || 'https://api.ordereasy.win/api/';
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
const setAuthToken = (token)=>{
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    } else {
        delete api.defaults.headers.common['Authorization'];
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
};
// Add interceptor to request to ensure token is picked up from localStorage on reload
api.interceptors.request.use((config)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return config;
}, (error)=>{
    return Promise.reject(error);
});
// Add interceptor to response to handle 401 errors
api.interceptors.response.use((response)=>{
    return response;
}, (error)=>{
    if (error.response && error.response.status === 401) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    return Promise.reject(error);
});
const CACHE = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const PENDING_REQUESTS = {};
const getCached = (key)=>{
    const cached = CACHE[key];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
};
const setCache = (key, data)=>{
    CACHE[key] = {
        data,
        timestamp: Date.now()
    };
};
const fetchWithDedupe = async (key, fetchFn)=>{
    // 1. Check Memory Cache
    const cached = getCached(key);
    if (cached) return cached;
    // 2. Check In-Flight Requests (Deduplication)
    if (PENDING_REQUESTS[key]) {
        return PENDING_REQUESTS[key];
    }
    // 3. Make New Request
    const promise = fetchFn().then((response)=>{
        // Axios response, usually we return response.data
        // But the fetchFn below usually returns response.data directly if we wrap it right, 
        // OR we return response object. 
        // Looking at usage: fetchFn should return the DATA.
        // Let's standardise: fetchFn returns the FINAL data.
        setCache(key, response);
        delete PENDING_REQUESTS[key];
        return response;
    }).catch((err)=>{
        delete PENDING_REQUESTS[key];
        throw err;
    });
    PENDING_REQUESTS[key] = promise;
    return promise;
};
const apiService = {
    login: async (phone, password)=>{
        // Ensure phone number has +91 prefix
        const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
        const response = await api.post('auth/customer/login/', {
            username: formattedPhone,
            password
        });
        return response.data;
    },
    signup: async (data)=>{
        // Ensure phone number has +91 prefix
        if (data.phone_number && !data.phone_number.startsWith('+91')) {
            data.phone_number = `+91${data.phone_number}`;
        }
        // Hardcode user_type to customer
        data.user_type = 'customer';
        const response = await api.post('auth/customer/signup/', data);
    },
    isAuthenticated: ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return false;
    },
    // Retailers
    getRetailers: async (params)=>{
        const key = `retailers_${JSON.stringify(params || {})}`;
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get('retailers/', {
                params
            });
            return response.data;
        });
    },
    getRetailerDetails: async (retailerId)=>{
        const key = `retailer_${retailerId}`;
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get(`retailers/${retailerId}/`);
            return response.data;
        });
    },
    // Products & Categories
    getRetailerCategories: async (retailerId)=>{
        const key = `categories_${retailerId}`;
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get(`products/retailer/${retailerId}/categories/`);
            return response.data;
        });
    },
    getFeaturedProducts: async (retailerId)=>{
        const key = `featured_${retailerId}`;
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get(`products/retailer/${retailerId}/featured/`);
            return response.data;
        });
    },
    getRetailerProducts: async (retailerId, params)=>{
        const key = `products_${retailerId}_${JSON.stringify(params || {})}`;
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get(`products/retailer/${retailerId}/`, {
                params
            });
            return response.data;
        });
    },
    getProductDetail: async (retailerId, productId)=>{
        const key = `product_${retailerId}_${productId}`;
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get(`products/retailer/${retailerId}/${productId}/`);
            return response.data;
        });
    },
    // Cart
    getCart: async (retailerId)=>{
        // Cache Key includes retailerId
        const key = `cart_${retailerId}`;
        // Using dedupe to prevent simultaneous calls. 
        // Note: Cart changes frequently, so ensure we invalidate or rely on short cache duration.
        // For now, rely on 5 min cache BUT invalidate on add/update.
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get('cart/', {
                params: {
                    retailer_id: retailerId
                }
            });
            return response.data;
        });
    },
    addToCart: async (productId, quantity)=>{
        const response = await api.post('cart/add/', {
            product_id: productId,
            quantity
        });
        // Invalidate Cart Cache roughly (wildcard invalidation would be better but simple solution: clear specific keys if we knew retailerId)
        // Since we don't know retailerId easily here without passing it, clear ALL cart keys?
        // Or better: pass retailerId to addToCart? The backend infers it from product?
        // For now, let's just accept that immediate consistency might need manual refetch or we clear all cart_* keys.
        // Simple hack: Clear the GLOBAL cache map entries that start with cart_
        Object.keys(CACHE).forEach((k)=>{
            if (k.startsWith('cart_')) delete CACHE[k];
        });
        return response.data;
    },
    updateCartItem: async (itemId, quantity)=>{
        const response = await api.patch(`cart/items/${itemId}/`, {
            quantity
        });
        Object.keys(CACHE).forEach((k)=>{
            if (k.startsWith('cart_')) delete CACHE[k];
        });
        return response.data;
    },
    removeCartItem: async (itemId)=>{
        const response = await api.delete(`cart/items/${itemId}/remove/`);
        Object.keys(CACHE).forEach((k)=>{
            if (k.startsWith('cart_')) delete CACHE[k];
        });
        return response.data;
    },
    // Wishlist
    getWishlist: async ()=>{
        const key = 'customer_wishlist';
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get('customer/wishlist/');
            return response.data;
        });
    },
    addToWishlist: async (productId)=>{
        const response = await api.post('customer/wishlist/add/', {
            product: productId
        });
        delete CACHE['customer_wishlist'];
        return response.data;
    },
    removeFromWishlist: async (productId)=>{
        const response = await api.delete(`customer/wishlist/remove/${productId}/`);
        delete CACHE['customer_wishlist'];
        return response.data;
    },
    // User Profile
    fetchUserProfile: async ()=>{
        const key = 'user_profile';
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get('customer/profile/');
            return response.data;
        });
    },
    updateUserProfile: async (data)=>{
        const response = await api.patch('customer/profile/update/', data);
        delete CACHE['user_profile'];
        return response.data;
    },
    logout: async ()=>{
        setAuthToken('');
        // Clear all cache
        Object.keys(CACHE).forEach((key)=>delete CACHE[key]);
    },
    // Addresses
    getAddresses: async ()=>{
        const key = 'addresses';
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get('customer/addresses/');
            return response.data;
        });
    },
    getAddressDetail: async (id)=>{
        const key = `address_${id}`;
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get(`customer/addresses/${id}/`);
            return response.data;
        });
    },
    addAddress: async (data)=>{
        const response = await api.post('customer/addresses/create/', data);
        delete CACHE['addresses'];
        return response.data;
    },
    updateAddress: async (id, data)=>{
        const response = await api.patch(`customer/addresses/${id}/update/`, data);
        delete CACHE['addresses'];
        return response.data;
    },
    deleteAddress: async (id)=>{
        const response = await api.delete(`customer/addresses/${id}/delete/`);
        delete CACHE['addresses'];
        return response.data;
    },
    // Orders
    placeOrder: async (data)=>{
        const response = await api.post('orders/place/', data);
        delete CACHE['orders_history'];
        delete CACHE['orders_current'];
        // Also clear cart
        Object.keys(CACHE).forEach((k)=>{
            if (k.startsWith('cart_')) delete CACHE[k];
        });
        return response.data;
    },
    // Referrals
    applyReferralCode: async (referralCode, retailerId)=>{
        const response = await api.post('customer/referral/apply/', {
            referral_code: referralCode,
            retailer_id: retailerId
        });
        return response.data;
    },
    getReferralStats: async ()=>{
        const key = 'referral_stats';
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get('customer/referral/stats/');
            return response.data;
        });
    },
    getOrders: async ()=>{
        const key = 'orders_history';
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get('orders/history/');
            return response.data;
        });
    },
    getCurrentOrders: async ()=>{
        const key = 'orders_current';
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get('orders/current/');
            return response.data;
        });
    },
    getOrderDetail: async (id)=>{
        const key = `order_${id}`;
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get(`orders/${id}/`);
            return response.data;
        });
    },
    // Rewards
    fetchRewardConfiguration: async (retailerId)=>{
        const key = `reward_config_${retailerId}`;
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get('customer/reward-configuration/', {
                params: {
                    retailer_id: retailerId
                }
            });
            return response.data;
        });
    },
    getCustomerLoyalty: async (retailerId)=>{
        const key = `loyalty_${retailerId}`;
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get('customer/loyalty/', {
                params: {
                    retailer_id: retailerId
                }
            });
            return response.data;
        });
    },
    getAllCustomerLoyalty: async ()=>{
        const key = 'loyalty_all';
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get('customer/loyalty/all/');
            return response.data;
        });
    }
};
const __TURBOPACK__default__export__ = api;
}),
"[project]/src/app/components/ui/Button.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "button": "Button-module__Vsi6oa__button",
  "fullWidth": "Button-module__Vsi6oa__fullWidth",
  "ghost": "Button-module__Vsi6oa__ghost",
  "loading": "Button-module__Vsi6oa__loading",
  "outline": "Button-module__Vsi6oa__outline",
  "primary": "Button-module__Vsi6oa__primary",
  "secondary": "Button-module__Vsi6oa__secondary",
  "spin": "Button-module__Vsi6oa__spin",
  "spinner": "Button-module__Vsi6oa__spinner",
});
}),
"[project]/src/app/components/ui/Button.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/components/ui/Button.module.css [app-ssr] (css module)");
;
;
const Button = ({ children, variant = 'primary', isLoading = false, fullWidth = false, className, disabled, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: `
        ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].button} 
        ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"][variant]} 
        ${fullWidth ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].fullWidth : ''} 
        ${isLoading ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].loading : ''}
        ${className || ''}
      `,
        disabled: isLoading || disabled,
        ...props,
        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].spinner
        }, void 0, false, {
            fileName: "[project]/src/app/components/ui/Button.tsx",
            lineNumber: 32,
            columnNumber: 17
        }, ("TURBOPACK compile-time value", void 0)) : children
    }, void 0, false, {
        fileName: "[project]/src/app/components/ui/Button.tsx",
        lineNumber: 20,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/app/retailer/[id]/category/[categoryId]/CategoryProducts.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "addBtn": "CategoryProducts-module__Jikj7W__addBtn",
  "card": "CategoryProducts-module__Jikj7W__card",
  "container": "CategoryProducts-module__Jikj7W__container",
  "discountBadge": "CategoryProducts-module__Jikj7W__discountBadge",
  "grid": "CategoryProducts-module__Jikj7W__grid",
  "header": "CategoryProducts-module__Jikj7W__header",
  "imageWrapper": "CategoryProducts-module__Jikj7W__imageWrapper",
  "info": "CategoryProducts-module__Jikj7W__info",
  "mrp": "CategoryProducts-module__Jikj7W__mrp",
  "name": "CategoryProducts-module__Jikj7W__name",
  "price": "CategoryProducts-module__Jikj7W__price",
  "priceRow": "CategoryProducts-module__Jikj7W__priceRow",
  "wishlistIcon": "CategoryProducts-module__Jikj7W__wishlistIcon",
});
}),
"[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CategoryProductsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-ssr] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/funnel.js [app-ssr] (ecmascript) <export default as Filter>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/ui/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f5b$id$5d2f$category$2f5b$categoryId$5d2f$CategoryProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/retailer/[id]/category/[categoryId]/CategoryProducts.module.css [app-ssr] (css module)");
'use client';
;
;
;
;
;
;
;
function CategoryProductsPage() {
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const retailerId = params.id;
    const categoryId = params.categoryId;
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [categoryName, setCategoryName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('Products');
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [wishlistIds, setWishlistIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Set());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (retailerId && categoryId) {
            loadProducts();
        }
    }, [
        retailerId,
        categoryId
    ]);
    const loadProducts = async ()=>{
        setIsLoading(true);
        try {
            const [prodData, wishlistData] = await Promise.all([
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiService"].getRetailerProducts(retailerId, {
                    category: categoryId
                }),
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiService"].getWishlist().catch(()=>({
                        results: []
                    }))
            ]);
            const rawProducts = Array.isArray(prodData) ? prodData : prodData.results || [];
            // Map keys
            const mappedProducts = rawProducts.map((p)=>({
                    ...p,
                    price: p.discounted_price || p.price,
                    mrp: p.original_price || p.price,
                    image: p.image || '',
                    stock_quantity: p.quantity || 0,
                    unit: p.unit || 'Unit'
                }));
            setProducts(mappedProducts);
            // Wishlist
            const ids = new Set((wishlistData.results || wishlistData).map((item)=>item.product));
            setWishlistIds(ids);
        // Ideally fetch category name from backend or pass it
        // For now, if we have products, maybe infer or just keep generic
        // Or fetch category detail if endpoint exists. 
        } catch (error) {
            console.error("Failed to load products", error);
        } finally{
            setIsLoading(false);
        }
    };
    const addToCart = async (e, productId)=>{
        e.preventDefault();
        e.stopPropagation();
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiService"].addToCart(productId, 1);
        // Optional: Toast notification
        } catch (err) {
            console.error(err);
        }
    };
    const toggleWishlist = async (e, productId)=>{
        e.preventDefault();
        e.stopPropagation();
        try {
            if (wishlistIds.has(productId)) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiService"].removeFromWishlist(productId);
                setWishlistIds((prev)=>{
                    const next = new Set(prev);
                    next.delete(productId);
                    return next;
                });
            } else {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiService"].addToWishlist(productId);
                setWishlistIds((prev)=>{
                    const next = new Set(prev);
                    next.add(productId);
                    return next;
                });
            }
        } catch (error) {
            console.error("Wishlist toggle failed", error);
        }
    };
    if (isLoading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-8 text-center",
        children: "Loading Products..."
    }, void 0, false, {
        fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
        lineNumber: 109,
        columnNumber: 27
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f5b$id$5d2f$category$2f5b$categoryId$5d2f$CategoryProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f5b$id$5d2f$category$2f5b$categoryId$5d2f$CategoryProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        onClick: ()=>router.back(),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                            lineNumber: 115,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                        lineNumber: 114,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: categoryName
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                        lineNumber: 117,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$funnel$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Filter$3e$__["Filter"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                            lineNumber: 119,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                        lineNumber: 118,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                lineNumber: 113,
                columnNumber: 13
            }, this),
            products.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center justify-center h-64 text-gray-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                        size: 48,
                        className: "mb-4 text-gray-300"
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                        lineNumber: 125,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "No products found in this category."
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                        lineNumber: 126,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                lineNumber: 124,
                columnNumber: 17
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f5b$id$5d2f$category$2f5b$categoryId$5d2f$CategoryProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].grid,
                children: products.map((product)=>{
                    const discount = product.mrp > product.price ? Math.round((product.mrp - product.price) / product.mrp * 100) : 0;
                    const isWishlisted = wishlistIds.has(product.id);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f5b$id$5d2f$category$2f5b$categoryId$5d2f$CategoryProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].card,
                        onClick: ()=>router.push(`/retailer/${retailerId}/product/${product.id}`),
                        role: "button",
                        tabIndex: 0,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f5b$id$5d2f$category$2f5b$categoryId$5d2f$CategoryProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].imageWrapper,
                                children: [
                                    discount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f5b$id$5d2f$category$2f5b$categoryId$5d2f$CategoryProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].discountBadge,
                                        children: [
                                            discount,
                                            "% OFF"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                                        lineNumber: 146,
                                        columnNumber: 41
                                    }, this),
                                    product.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: product.image,
                                        alt: product.name,
                                        className: "w-full h-full object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                                        lineNumber: 149,
                                        columnNumber: 41
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                        size: 32,
                                        className: "text-gray-300"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                                        lineNumber: 151,
                                        columnNumber: 41
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f5b$id$5d2f$category$2f5b$categoryId$5d2f$CategoryProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].wishlistIcon,
                                        onClick: (e)=>toggleWishlist(e, product.id),
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: isWishlisted ? "text-yellow-400 fill-current" : "text-gray-300",
                                            children: "★"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                                            lineNumber: 154,
                                            columnNumber: 41
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                                        lineNumber: 153,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                                lineNumber: 144,
                                columnNumber: 33
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f5b$id$5d2f$category$2f5b$categoryId$5d2f$CategoryProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].info,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs text-gray-400 mb-1",
                                        children: product.unit
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                                        lineNumber: 158,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f5b$id$5d2f$category$2f5b$categoryId$5d2f$CategoryProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].name,
                                        children: product.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                                        lineNumber: 159,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f5b$id$5d2f$category$2f5b$categoryId$5d2f$CategoryProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].priceRow,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col",
                                                children: [
                                                    discount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f5b$id$5d2f$category$2f5b$categoryId$5d2f$CategoryProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].mrp,
                                                        children: [
                                                            "₹",
                                                            product.mrp
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                                                        lineNumber: 162,
                                                        columnNumber: 62
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f5b$id$5d2f$category$2f5b$categoryId$5d2f$CategoryProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].price,
                                                        children: [
                                                            "₹",
                                                            product.price
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                                                        lineNumber: 163,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                                                lineNumber: 161,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f5b$id$5d2f$category$2f5b$categoryId$5d2f$CategoryProducts$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].addBtn,
                                                onClick: (e)=>addToCart(e, product.id),
                                                children: "ADD"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                                                lineNumber: 165,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                                        lineNumber: 160,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                                lineNumber: 157,
                                columnNumber: 33
                            }, this)
                        ]
                    }, product.id, true, {
                        fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                        lineNumber: 137,
                        columnNumber: 29
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
                lineNumber: 129,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/retailer/[id]/category/[categoryId]/page.tsx",
        lineNumber: 112,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b8e1598d._.js.map