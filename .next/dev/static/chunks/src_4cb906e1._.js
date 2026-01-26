(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiService",
    ()=>apiService,
    "default",
    ()=>__TURBOPACK__default__export__,
    "setAuthToken",
    ()=>setAuthToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const API_BASE_URL = ("TURBOPACK compile-time value", "http://127.0.0.1:8000/api/") || 'https://api.ordereasy.win/api/';
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
const setAuthToken = (token)=>{
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem('access_token', token);
        }
    } else {
        delete api.defaults.headers.common['Authorization'];
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem('access_token');
        }
    }
};
// Add interceptor to request to ensure token is picked up from localStorage on reload
api.interceptors.request.use((config)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
});
// Add interceptor to response to handle 401 errors
api.interceptors.response.use((response)=>{
    return response;
}, (error)=>{
    if (error.response && error.response.status === 401) {
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem('access_token');
        // Force reload or redirect could happen here, or let the UI react to the missing token
        }
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
        if ("TURBOPACK compile-time truthy", 1) {
            return !!localStorage.getItem('access_token');
        }
        //TURBOPACK unreachable
        ;
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
    }
};
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/ui/Button.module.css [app-client] (css module)", ((__turbopack_context__) => {

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
"[project]/src/app/components/ui/Button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/components/ui/Button.module.css [app-client] (css module)");
;
;
const Button = ({ children, variant = 'primary', isLoading = false, fullWidth = false, className, disabled, ...props })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: `
        ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].button} 
        ${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"][variant]} 
        ${fullWidth ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].fullWidth : ''} 
        ${isLoading ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].loading : ''}
        ${className || ''}
      `,
        disabled: isLoading || disabled,
        ...props,
        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].spinner
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
_c = Button;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/retailer/product/ProductDetail.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "ProductDetail-module__zyHFEa__container",
  "description": "ProductDetail-module__zyHFEa__description",
  "details": "ProductDetail-module__zyHFEa__details",
  "discount": "ProductDetail-module__zyHFEa__discount",
  "divider": "ProductDetail-module__zyHFEa__divider",
  "footer": "ProductDetail-module__zyHFEa__footer",
  "header": "ProductDetail-module__zyHFEa__header",
  "imageSection": "ProductDetail-module__zyHFEa__imageSection",
  "mrp": "ProductDetail-module__zyHFEa__mrp",
  "price": "ProductDetail-module__zyHFEa__price",
  "priceBlock": "ProductDetail-module__zyHFEa__priceBlock",
  "qtyControl": "ProductDetail-module__zyHFEa__qtyControl",
  "sectionTitle": "ProductDetail-module__zyHFEa__sectionTitle",
  "title": "ProductDetail-module__zyHFEa__title",
});
}),
"[project]/src/app/retailer/product/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-client] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/heart.js [app-client] (ecmascript) <export default as Heart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/share-2.js [app-client] (ecmascript) <export default as Share2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/minus.js [app-client] (ecmascript) <export default as Minus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f$product$2f$ProductDetail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/retailer/product/ProductDetail.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function ProductDetail() {
    _s();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const retailerId = searchParams.get('retailerId');
    const productId = searchParams.get('productId');
    const [product, setProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [quantity, setQuantity] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [isWishlisted, setIsWishlisted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductDetail.useEffect": ()=>{
            if (retailerId && productId) {
                loadProduct();
            }
        }
    }["ProductDetail.useEffect"], [
        retailerId,
        productId
    ]);
    const loadProduct = async ()=>{
        setIsLoading(true);
        try {
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].getProductDetail(retailerId, productId);
            setProduct(data);
        // Check wishlist status if possible, or just default to false
        } catch (error) {
            console.error("Failed to load product", error);
        } finally{
            setIsLoading(false);
        }
    };
    const handleAddToCart = async ()=>{
        if (!product) return;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].addToCart(product.id, quantity);
            alert("Added to cart!");
        } catch (err) {
            console.error(err);
        }
    };
    const toggleWishlist = async ()=>{
        if (!product) return;
        try {
            if (isWishlisted) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].removeFromWishlist(product.id);
            } else {
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].addToWishlist(product.id);
            }
            setIsWishlisted(!isWishlisted);
        } catch (err) {
            console.error(err);
        }
    };
    if (isLoading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-8 text-center text-gray-500",
        children: "Loading details..."
    }, void 0, false, {
        fileName: "[project]/src/app/retailer/product/page.tsx",
        lineNumber: 75,
        columnNumber: 27
    }, this);
    if (!product) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-8 text-center",
        children: "Product not found."
    }, void 0, false, {
        fileName: "[project]/src/app/retailer/product/page.tsx",
        lineNumber: 76,
        columnNumber: 26
    }, this);
    const discount = product.mrp > product.price ? Math.round((product.mrp - product.price) / product.mrp * 100) : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f$product$2f$ProductDetail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f$product$2f$ProductDetail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        onClick: ()=>router.back(),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/src/app/retailer/product/page.tsx",
                            lineNumber: 86,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailer/product/page.tsx",
                        lineNumber: 85,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                onClick: toggleWishlist,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$heart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Heart$3e$__["Heart"], {
                                    size: 20,
                                    className: isWishlisted ? "fill-red-500 text-red-500" : ""
                                }, void 0, false, {
                                    fileName: "[project]/src/app/retailer/product/page.tsx",
                                    lineNumber: 90,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/retailer/product/page.tsx",
                                lineNumber: 89,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$share$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Share2$3e$__["Share2"], {
                                    size: 20
                                }, void 0, false, {
                                    fileName: "[project]/src/app/retailer/product/page.tsx",
                                    lineNumber: 93,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/retailer/product/page.tsx",
                                lineNumber: 92,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/retailer/product/page.tsx",
                        lineNumber: 88,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/retailer/product/page.tsx",
                lineNumber: 84,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f$product$2f$ProductDetail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imageSection,
                children: product.image || product.image_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f$product$2f$ProductDetail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].productImageWrapper,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                        src: product.image || product.image_url,
                        alt: product.name,
                        className: "w-full h-full object-contain mix-blend-multiply"
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailer/product/page.tsx",
                        lineNumber: 101,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/retailer/product/page.tsx",
                    lineNumber: 100,
                    columnNumber: 21
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f$product$2f$ProductDetail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].imagePlaceholder,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                        size: 64,
                        className: "text-gray-300"
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailer/product/page.tsx",
                        lineNumber: 109,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/retailer/product/page.tsx",
                    lineNumber: 108,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/retailer/product/page.tsx",
                lineNumber: 98,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f$product$2f$ProductDetail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].details,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f$product$2f$ProductDetail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].title,
                        children: product.name
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailer/product/page.tsx",
                        lineNumber: 115,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f$product$2f$ProductDetail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].priceBlock,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f$product$2f$ProductDetail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].price,
                                children: [
                                    "₹",
                                    product.price
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/retailer/product/page.tsx",
                                lineNumber: 118,
                                columnNumber: 21
                            }, this),
                            product.mrp > product.price && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f$product$2f$ProductDetail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].mrp,
                                        children: [
                                            "₹",
                                            product.mrp
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/retailer/product/page.tsx",
                                        lineNumber: 121,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f$product$2f$ProductDetail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].discount,
                                        children: [
                                            discount,
                                            "% OFF"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/retailer/product/page.tsx",
                                        lineNumber: 122,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/retailer/product/page.tsx",
                        lineNumber: 117,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f$product$2f$ProductDetail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].divider
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailer/product/page.tsx",
                        lineNumber: 127,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f$product$2f$ProductDetail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sectionTitle,
                        children: "Product Details"
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailer/product/page.tsx",
                        lineNumber: 129,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f$product$2f$ProductDetail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].description,
                        children: product.description || "No description available for this product."
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailer/product/page.tsx",
                        lineNumber: 130,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f$product$2f$ProductDetail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].divider
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailer/product/page.tsx",
                        lineNumber: 134,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/retailer/product/page.tsx",
                lineNumber: 114,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f$product$2f$ProductDetail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].footer,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$retailer$2f$product$2f$ProductDetail$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].qtyControl,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setQuantity(Math.max(1, quantity - 1)),
                                disabled: quantity <= 1,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$minus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Minus$3e$__["Minus"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/src/app/retailer/product/page.tsx",
                                    lineNumber: 142,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/retailer/product/page.tsx",
                                lineNumber: 141,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: quantity
                            }, void 0, false, {
                                fileName: "[project]/src/app/retailer/product/page.tsx",
                                lineNumber: 144,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setQuantity(Math.min(product.stock_quantity, quantity + 1)),
                                disabled: quantity >= product.stock_quantity,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    size: 18
                                }, void 0, false, {
                                    fileName: "[project]/src/app/retailer/product/page.tsx",
                                    lineNumber: 146,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/retailer/product/page.tsx",
                                lineNumber: 145,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/retailer/product/page.tsx",
                        lineNumber: 140,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        fullWidth: true,
                        onClick: handleAddToCart,
                        disabled: product.stock_quantity === 0,
                        children: product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"
                    }, void 0, false, {
                        fileName: "[project]/src/app/retailer/product/page.tsx",
                        lineNumber: 150,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/retailer/product/page.tsx",
                lineNumber: 139,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/retailer/product/page.tsx",
        lineNumber: 83,
        columnNumber: 9
    }, this);
}
_s(ProductDetail, "jDJLvKIXfthtdfn3ctefnh1aFvM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = ProductDetail;
function ProductDetailPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-8 text-center text-gray-500",
            children: "Loading details..."
        }, void 0, false, {
            fileName: "[project]/src/app/retailer/product/page.tsx",
            lineNumber: 160,
            columnNumber: 29
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductDetail, {}, void 0, false, {
            fileName: "[project]/src/app/retailer/product/page.tsx",
            lineNumber: 161,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/retailer/product/page.tsx",
        lineNumber: 160,
        columnNumber: 9
    }, this);
}
_c1 = ProductDetailPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "ProductDetail");
__turbopack_context__.k.register(_c1, "ProductDetailPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_4cb906e1._.js.map