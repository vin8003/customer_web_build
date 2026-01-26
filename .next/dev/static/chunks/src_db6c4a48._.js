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
const setAuthToken = (token, refreshToken)=>{
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.setItem('access_token', token);
            if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
        }
    } else {
        delete api.defaults.headers.common['Authorization'];
        if ("TURBOPACK compile-time truthy", 1) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
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
// Add interceptor to response to handle 401 errors and refreshing
api.interceptors.response.use((response)=>{
    return response;
}, async (error)=>{
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        // Avoid infinite loop if refresh itself fails
        if (originalRequest.url?.includes('auth/token/refresh/')) {
            if ("TURBOPACK compile-time truthy", 1) {
                setAuthToken('');
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
            return Promise.reject(error);
        }
        originalRequest._retry = true;
        if ("TURBOPACK compile-time truthy", 1) {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(`${API_BASE_URL}auth/token/refresh/`, {
                        refresh: refreshToken
                    });
                    const { access, refresh } = response.data;
                    setAuthToken(access, refresh);
                    originalRequest.headers['Authorization'] = `Bearer ${access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    setAuthToken('');
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                    return Promise.reject(refreshError);
                }
            } else {
                setAuthToken('');
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/orders/chat/Chat.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "chatWindow": "Chat-module__2sy44G__chatWindow",
  "chip": "Chat-module__2sy44G__chip",
  "container": "Chat-module__2sy44G__container",
  "emptyState": "Chat-module__2sy44G__emptyState",
  "header": "Chat-module__2sy44G__header",
  "input": "Chat-module__2sy44G__input",
  "inputArea": "Chat-module__2sy44G__inputArea",
  "messageBubble": "Chat-module__2sy44G__messageBubble",
  "messageLeft": "Chat-module__2sy44G__messageLeft",
  "messageRight": "Chat-module__2sy44G__messageRight",
  "quickReplies": "Chat-module__2sy44G__quickReplies",
  "sendButton": "Chat-module__2sy44G__sendButton",
  "senderName": "Chat-module__2sy44G__senderName",
  "timestamp": "Chat-module__2sy44G__timestamp",
});
}),
"[project]/src/app/orders/chat/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.js [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$chat$2f$Chat$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/orders/chat/Chat.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function ChatContent() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const orderId = searchParams.get('id');
    // Safety check just in case
    const safeOrderId = orderId ? Number(orderId) : 0;
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [newMessage, setNewMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isSending, setIsSending] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const bottomRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const intervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatContent.useEffect": ()=>{
            if (!safeOrderId) return;
            // Initial fetch
            fetchMessages();
            markRead();
            // Poll every 5 seconds
            intervalRef.current = setInterval({
                "ChatContent.useEffect": ()=>{
                    fetchMessages(true);
                }
            }["ChatContent.useEffect"], 5000);
            return ({
                "ChatContent.useEffect": ()=>{
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            })["ChatContent.useEffect"];
        }
    }["ChatContent.useEffect"], [
        safeOrderId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatContent.useEffect": ()=>{
            // Scroll to bottom on messages change
            // Only if we were arguably at the bottom or it's the first load
            // For simplicity, always scroll on first load, otherwise only if user is near bottom?
            // Let's just scroll to bottom if it's the initial load or we sent a message.
            // Or naively scroll to bottom always for now (standard simple chat behavior)
            if (bottomRef.current) {
                bottomRef.current.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    }["ChatContent.useEffect"], [
        messages.length
    ]); // Scroll when message count changes
    const fetchMessages = async (isBackground = false)=>{
        if (!safeOrderId) return;
        if (!isBackground) setIsLoading(true);
        try {
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].getOrderChat(safeOrderId);
            setMessages(data);
        } catch (error) {
            console.error("Error fetching chat:", error);
        } finally{
            if (!isBackground) setIsLoading(false);
        }
    };
    const markRead = async ()=>{
        if (!safeOrderId) return;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].markOrderChatRead(safeOrderId);
        } catch (error) {
            console.error("Error marking read:", error);
        }
    };
    const handleSend = async ()=>{
        if (!newMessage.trim() || !safeOrderId) return;
        const msgToSend = newMessage.trim();
        setNewMessage(''); // optimistic clear
        setIsSending(true);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].sendOrderMessage(safeOrderId, msgToSend);
            // Fetch immediately to show update
            await fetchMessages(true);
        } catch (error) {
            console.error("Error sending message:", error);
            // Ideally show error toast, here just restore text
            setNewMessage(msgToSend);
        } finally{
            setIsSending(false);
        }
    };
    const handleKeyPress = (e)=>{
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    const quickReply = (text)=>{
        setNewMessage(text);
    // Optional: auto send? Or just populate? Mobile app seems to populate.
    // "onPressed: () { _messageController.text = reply; _sendMessage(); }" -> It sends immediately in mobile.
    // Let's populate and focus for web, or send immediately. 
    // I will match mobile: send immediately. But setState is async so I'll call API directly with text.
    // Actually, let's just populate to be safe on web where typing is easier.
    // Wait, the mobile code does `_sendMessage()` right after. 
    // I'll populate and let user hit send, it's safer UX for web.
    };
    const formatTime = (isoString)=>{
        const date = new Date(isoString);
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    if (!safeOrderId) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-10 text-center",
        children: "Invalid Order ID"
    }, void 0, false, {
        fileName: "[project]/src/app/orders/chat/page.tsx",
        lineNumber: 128,
        columnNumber: 30
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$chat$2f$Chat$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$chat$2f$Chat$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.back(),
                        className: "mr-2 p-2 hover:bg-gray-100 rounded-full",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                            size: 20,
                            color: "#333"
                        }, void 0, false, {
                            fileName: "[project]/src/app/orders/chat/page.tsx",
                            lineNumber: 134,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/orders/chat/page.tsx",
                        lineNumber: 133,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        children: [
                            "Chat on Order #",
                            safeOrderId
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/orders/chat/page.tsx",
                        lineNumber: 136,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/orders/chat/page.tsx",
                lineNumber: 132,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$chat$2f$Chat$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].chatWindow,
                children: [
                    isLoading && messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center p-4",
                        children: "Loading messages..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/orders/chat/page.tsx",
                        lineNumber: 141,
                        columnNumber: 21
                    }, this) : messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$chat$2f$Chat$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].emptyState,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "No messages yet."
                            }, void 0, false, {
                                fileName: "[project]/src/app/orders/chat/page.tsx",
                                lineNumber: 144,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Have a question about your order?"
                            }, void 0, false, {
                                fileName: "[project]/src/app/orders/chat/page.tsx",
                                lineNumber: 145,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/orders/chat/page.tsx",
                        lineNumber: 143,
                        columnNumber: 21
                    }, this) : messages.map((msg)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$chat$2f$Chat$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].messageBubble} ${msg.is_me ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$chat$2f$Chat$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].messageRight : __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$chat$2f$Chat$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].messageLeft}`,
                            children: [
                                !msg.is_me && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$chat$2f$Chat$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].senderName,
                                    children: msg.sender_name || 'Retailer'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/orders/chat/page.tsx",
                                    lineNumber: 153,
                                    columnNumber: 44
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: msg.message
                                }, void 0, false, {
                                    fileName: "[project]/src/app/orders/chat/page.tsx",
                                    lineNumber: 154,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$chat$2f$Chat$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].timestamp,
                                    children: [
                                        formatTime(msg.created_at),
                                        msg.is_me && msg.is_read && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "ml-1",
                                            children: "✓✓"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/orders/chat/page.tsx",
                                            lineNumber: 157,
                                            columnNumber: 62
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/orders/chat/page.tsx",
                                    lineNumber: 155,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, msg.id, true, {
                            fileName: "[project]/src/app/orders/chat/page.tsx",
                            lineNumber: 149,
                            columnNumber: 25
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: bottomRef
                    }, void 0, false, {
                        fileName: "[project]/src/app/orders/chat/page.tsx",
                        lineNumber: 162,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/orders/chat/page.tsx",
                lineNumber: 139,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$chat$2f$Chat$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].quickReplies,
                children: [
                    "Where is my order?",
                    "Item missing",
                    "Packing issue",
                    "Delivery time?"
                ].map((reply)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$chat$2f$Chat$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].chip,
                        onClick: ()=>{
                            setNewMessage(reply);
                        // handleSend(); // Uncomment to send immediately
                        },
                        children: reply
                    }, reply, false, {
                        fileName: "[project]/src/app/orders/chat/page.tsx",
                        lineNumber: 167,
                        columnNumber: 21
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/app/orders/chat/page.tsx",
                lineNumber: 165,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$chat$2f$Chat$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].inputArea,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$chat$2f$Chat$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].input,
                        placeholder: "Type a message...",
                        value: newMessage,
                        onChange: (e)=>setNewMessage(e.target.value),
                        onKeyDown: handleKeyPress,
                        disabled: isSending
                    }, void 0, false, {
                        fileName: "[project]/src/app/orders/chat/page.tsx",
                        lineNumber: 181,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$chat$2f$Chat$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sendButton,
                        onClick: handleSend,
                        disabled: !newMessage.trim() || isSending,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                            size: 18
                        }, void 0, false, {
                            fileName: "[project]/src/app/orders/chat/page.tsx",
                            lineNumber: 195,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/orders/chat/page.tsx",
                        lineNumber: 190,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/orders/chat/page.tsx",
                lineNumber: 180,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/orders/chat/page.tsx",
        lineNumber: 131,
        columnNumber: 9
    }, this);
}
_s(ChatContent, "IQGF8E/tyYi19cTjxvMcgukZnxA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"]
    ];
});
_c = ChatContent;
function ChatPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
        fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-10 text-center",
            children: "Loading Chat..."
        }, void 0, false, {
            fileName: "[project]/src/app/orders/chat/page.tsx",
            lineNumber: 204,
            columnNumber: 29
        }, void 0),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChatContent, {}, void 0, false, {
            fileName: "[project]/src/app/orders/chat/page.tsx",
            lineNumber: 205,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/orders/chat/page.tsx",
        lineNumber: 204,
        columnNumber: 9
    }, this);
}
_c1 = ChatPage;
var _c, _c1;
__turbopack_context__.k.register(_c, "ChatContent");
__turbopack_context__.k.register(_c1, "ChatPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_db6c4a48._.js.map