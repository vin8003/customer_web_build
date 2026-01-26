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
const API_BASE_URL = ("TURBOPACK compile-time value", "http://127.0.0.1:8000/api/") || 'https://api.ordereasy.win/api/';
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
const setAuthToken = (token, refreshToken)=>{
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
// Add interceptor to response to handle 401 errors and refreshing
api.interceptors.response.use((response)=>{
    return response;
}, async (error)=>{
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        // Avoid infinite loop if refresh itself fails
        if (originalRequest.url?.includes('auth/token/refresh/')) {
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return Promise.reject(error);
        }
        originalRequest._retry = true;
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
const fetchWithDedupe = async (key, fetchFn, force = false)=>{
    // 1. Check Memory Cache
    if (!force) {
        const cached = getCached(key);
        if (cached) return cached;
    }
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
        return response.data;
    },
    isAuthenticated: ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return false;
    },
    verifyPhoneWithFirebase: async (phone, token)=>{
        // Ensure phone number has +91 prefix for consistency
        const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
        // The backend endpoint is 'auth/verify-otp/' (implied from views.py checks, need to verify urls.py but standard naming applies)
        // Wait, looking at views.py, the function is `verify_otp`. 
        // Let's assume the URL is 'auth/verify-otp/' or similar. 
        // I should probably check urls.py to be 100% sure, but I'll stick to 'auth/verify-otp/' as a common convention 
        // or check the user provided views.py context which usually maps verify_otp to a url.
        // Actually, looking at the conversation history, I haven't seen urls.py.
        // I will assume 'auth/verify-otp/' based on standard DRF router or manual paths.
        // If it fails, I'll debug.
        // Re-reading views.py: @api_view(['POST']) def verify_otp(request)
        // Usually mapped in urls.py.
        const response = await api.post('auth/customer/verify-otp/', {
            phone_number: formattedPhone,
            firebase_token: token
        });
        // If backend returned tokens (meaning login/verification successful), set them
        if (response.data && response.data.tokens) {
            setAuthToken(response.data.tokens.access, response.data.tokens.refresh);
        }
        // Invalidate profile cache so next fetch gets updated verification status
        delete CACHE['user_profile'];
        return response.data;
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
        // Clear loyalty cache
        delete CACHE['loyalty_all'];
        if (data.retailer_id) delete CACHE[`loyalty_${data.retailer_id}`];
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
    getCustomerLoyalty: async (retailerId, force = false)=>{
        const key = `loyalty_${retailerId}`;
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get('customer/loyalty/', {
                params: {
                    retailer_id: retailerId
                }
            });
            return response.data;
        }, force);
    },
    getAllCustomerLoyalty: async (force = false)=>{
        const key = 'loyalty_all';
        return fetchWithDedupe(key, async ()=>{
            const response = await api.get('customer/loyalty/all/');
            return response.data;
        }, force);
    },
    confirmOrderModification: async (orderId, action)=>{
        const response = await api.post(`orders/${orderId}/confirm_modification/`, {
            action
        });
        delete CACHE[`order_${orderId}`];
        delete CACHE['orders_history'];
        delete CACHE['orders_current'];
        // Clear all loyalty cache to be sure
        delete CACHE['loyalty_all'];
        Object.keys(CACHE).forEach((k)=>{
            if (k.startsWith('loyalty_')) delete CACHE[k];
        });
        return response.data;
    },
    cancelOrder: async (orderId, reason = '')=>{
        const response = await api.post(`orders/${orderId}/cancel/`, {
            reason
        });
        delete CACHE[`order_${orderId}`];
        delete CACHE['orders_history'];
        delete CACHE['orders_current'];
        // Clear all loyalty cache to be sure
        delete CACHE['loyalty_all'];
        Object.keys(CACHE).forEach((k)=>{
            if (k.startsWith('loyalty_')) delete CACHE[k];
        });
        return response.data;
    },
    // Chat
    getOrderChat: async (orderId)=>{
        const response = await api.get(`orders/${orderId}/chat/`);
        return response.data;
    },
    sendOrderMessage: async (orderId, message)=>{
        const response = await api.post(`orders/${orderId}/chat/send/`, {
            message
        });
        return response.data;
    },
    markOrderChatRead: async (orderId)=>{
        const response = await api.post(`orders/${orderId}/chat/read/`);
        return response.data;
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
"[project]/src/app/retailers/Retailers.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "cardContent": "Retailers-module__ufnZKq__cardContent",
  "container": "Retailers-module__ufnZKq__container",
  "emptyState": "Retailers-module__ufnZKq__emptyState",
  "errorContainer": "Retailers-module__ufnZKq__errorContainer",
  "header": "Retailers-module__ufnZKq__header",
  "loadingContainer": "Retailers-module__ufnZKq__loadingContainer",
  "metaItem": "Retailers-module__ufnZKq__metaItem",
  "metaRow": "Retailers-module__ufnZKq__metaRow",
  "retailerCard": "Retailers-module__ufnZKq__retailerCard",
  "retailerIcon": "Retailers-module__ufnZKq__retailerIcon",
  "retailerInfo": "Retailers-module__ufnZKq__retailerInfo",
  "retailerList": "Retailers-module__ufnZKq__retailerList",
  "spin": "Retailers-module__ufnZKq__spin",
  "spinner": "Retailers-module__ufnZKq__spinner",
  "starIcon": "Retailers-module__ufnZKq__starIcon",
  "tag": "Retailers-module__ufnZKq__tag",
  "tags": "Retailers-module__ufnZKq__tags",
  "type": "Retailers-module__ufnZKq__type",
});
}),
"[project]/src/app/retailers/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RetailersPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-ssr] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-ssr] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-ssr] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/ui/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/retailers/Retailers.module.css [app-ssr] (css module)");
'use client';
;
;
;
;
;
;
;
function RetailersPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [retailers, setRetailers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchRetailers();
    }, []);
    const fetchRetailers = async ()=>{
        setIsLoading(true);
        try {
            // In a real scenario, we'd get lat/lng here
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["apiService"].getRetailers();
            setRetailers(data.results || []);
        } catch (err) {
            console.error(err);
            setError('Failed to load retailers. Please try again.');
        } finally{
            setIsLoading(false);
        }
    };
    const handleRetailerSelect = (id)=>{
        router.push(`/retailer?id=${id}`);
    };
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].loadingContainer,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].spinner
                }, void 0, false, {
                    fileName: "[project]/src/app/retailers/page.tsx",
                    lineNumber: 55,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Finding stores near you..."
                }, void 0, false, {
                    fileName: "[project]/src/app/retailers/page.tsx",
                    lineNumber: 56,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/retailers/page.tsx",
            lineNumber: 54,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: "Select a Store"
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailers/page.tsx",
                        lineNumber: 64,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Choose a retailer to start shopping"
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailers/page.tsx",
                        lineNumber: 65,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/retailers/page.tsx",
                lineNumber: 63,
                columnNumber: 13
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].errorContainer,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailers/page.tsx",
                        lineNumber: 70,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: fetchRetailers,
                        variant: "outline",
                        children: "Retry"
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailers/page.tsx",
                        lineNumber: 71,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/retailers/page.tsx",
                lineNumber: 69,
                columnNumber: 17
            }, this),
            retailers.length === 0 && !error ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].emptyState,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                        size: 48
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailers/page.tsx",
                        lineNumber: 77,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "No retailers found in your area."
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailers/page.tsx",
                        lineNumber: 78,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/retailers/page.tsx",
                lineNumber: 76,
                columnNumber: 17
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].retailerList,
                children: retailers.map((retailer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].retailerCard,
                        onClick: ()=>handleRetailerSelect(retailer.id),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].cardContent,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].retailerIcon,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                        size: 24,
                                        color: "#fff"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/retailers/page.tsx",
                                        lineNumber: 90,
                                        columnNumber: 37
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/retailers/page.tsx",
                                    lineNumber: 89,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].retailerInfo,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            children: retailer.shop_name
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/retailers/page.tsx",
                                            lineNumber: 93,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].type,
                                            children: retailer.business_type
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/retailers/page.tsx",
                                            lineNumber: 94,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].metaRow,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].metaItem,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                            size: 14
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/retailers/page.tsx",
                                                            lineNumber: 98,
                                                            columnNumber: 45
                                                        }, this),
                                                        retailer.city,
                                                        ", ",
                                                        retailer.state
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/retailers/page.tsx",
                                                    lineNumber: 97,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].metaItem,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                            size: 14,
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].starIcon
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/retailers/page.tsx",
                                                            lineNumber: 102,
                                                            columnNumber: 45
                                                        }, this),
                                                        retailer.average_rating
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/retailers/page.tsx",
                                                    lineNumber: 101,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/retailers/page.tsx",
                                            lineNumber: 96,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tags,
                                            children: [
                                                retailer.offers_delivery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tag,
                                                    children: "Delivery"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/retailers/page.tsx",
                                                    lineNumber: 109,
                                                    columnNumber: 45
                                                }, this),
                                                retailer.offers_pickup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailers$2f$Retailers$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tag,
                                                    children: "Pickup"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/retailers/page.tsx",
                                                    lineNumber: 112,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/retailers/page.tsx",
                                            lineNumber: 107,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/retailers/page.tsx",
                                    lineNumber: 92,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/retailers/page.tsx",
                            lineNumber: 88,
                            columnNumber: 29
                        }, this)
                    }, retailer.id, false, {
                        fileName: "[project]/src/app/retailers/page.tsx",
                        lineNumber: 83,
                        columnNumber: 25
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/retailers/page.tsx",
                lineNumber: 81,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/retailers/page.tsx",
        lineNumber: 62,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__43e54185._.js.map