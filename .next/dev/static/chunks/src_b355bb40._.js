(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/components/ui/Input.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "errorInput": "Input-module__qIix5q__errorInput",
  "errorText": "Input-module__qIix5q__errorText",
  "eyeBtn": "Input-module__qIix5q__eyeBtn",
  "icon": "Input-module__qIix5q__icon",
  "input": "Input-module__qIix5q__input",
  "inputContainer": "Input-module__qIix5q__inputContainer",
  "inputWrapper": "Input-module__qIix5q__inputWrapper",
  "label": "Input-module__qIix5q__label",
  "withIcon": "Input-module__qIix5q__withIcon",
});
}),
"[project]/src/app/components/ui/Input.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Input",
    ()=>Input
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/components/ui/Input.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-client] (ecmascript) <export default as EyeOff>");
;
var _s = __turbopack_context__.k.signature();
;
;
;
const Input = ({ label, error, icon, type = 'text', className, ...props })=>{
    _s();
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const isPassword = type === 'password';
    const togglePassword = ()=>setShowPassword(!showPassword);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].inputContainer,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].label,
                children: label
            }, void 0, false, {
                fileName: "[project]/src/app/components/ui/Input.tsx",
                lineNumber: 19,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].inputWrapper,
                children: [
                    icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].icon,
                        children: icon
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/ui/Input.tsx",
                        lineNumber: 21,
                        columnNumber: 26
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: isPassword ? showPassword ? 'text' : 'password' : type,
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].input} ${error ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].errorInput : ''} ${icon ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].withIcon : ''}`,
                        ...props
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/ui/Input.tsx",
                        lineNumber: 22,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    isPassword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: togglePassword,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].eyeBtn,
                        children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/ui/Input.tsx",
                            lineNumber: 29,
                            columnNumber: 41
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                            size: 20
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/ui/Input.tsx",
                            lineNumber: 29,
                            columnNumber: 61
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/ui/Input.tsx",
                        lineNumber: 28,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/ui/Input.tsx",
                lineNumber: 20,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Input$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].errorText,
                children: error
            }, void 0, false, {
                fileName: "[project]/src/app/components/ui/Input.tsx",
                lineNumber: 33,
                columnNumber: 23
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/ui/Input.tsx",
        lineNumber: 18,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Input, "daguiRHWMFkqPgCh/ppD7CF5VuQ=");
_c = Input;
var _c;
__turbopack_context__.k.register(_c, "Input");
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
"[project]/src/app/signup/Signup.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "card": "Signup-module__GR7wDG__card",
  "container": "Signup-module__GR7wDG__container",
  "errorAlert": "Signup-module__GR7wDG__errorAlert",
  "footer": "Signup-module__GR7wDG__footer",
  "form": "Signup-module__GR7wDG__form",
  "header": "Signup-module__GR7wDG__header",
  "loginLink": "Signup-module__GR7wDG__loginLink",
  "logo": "Signup-module__GR7wDG__logo",
  "logoWrapper": "Signup-module__GR7wDG__logoWrapper",
  "signupBtn": "Signup-module__GR7wDG__signupBtn",
  "slideUp": "Signup-module__GR7wDG__slideUp",
  "subtitle": "Signup-module__GR7wDG__subtitle",
  "title": "Signup-module__GR7wDG__title",
});
}),
"[project]/src/app/signup/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SignupPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/ui/Input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$signup$2f$Signup$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/app/signup/Signup.module.css [app-client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
function SignupPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    const handleSignup = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        setError('');
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }
        try {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiService"].signup({
                username: formData.username,
                email: formData.email,
                phone_number: formData.phone,
                password: formData.password,
                password_confirm: formData.confirmPassword
            });
            if (response && response.tokens) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["setAuthToken"])(response.tokens.access);
                router.push('/'); // Redirect to Home or Verification based on flow
            } else {
                // Handle case where tokens might not be returned immediately (verification needed)
                router.push('/login');
            }
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                // Format errors from Django
                const errorData = err.response.data;
                let errorMessage = 'Signup failed.';
                if (typeof errorData === 'object') {
                    errorMessage = Object.entries(errorData).map(([key, value])=>`${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('\n');
                }
                setError(errorMessage);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$signup$2f$Signup$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].container,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$signup$2f$Signup$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].card,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$signup$2f$Signup$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].header,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$signup$2f$Signup$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].logoWrapper,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/assets/images/logo.png",
                                alt: "BuyEasy Logo",
                                width: 100,
                                height: 100,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$signup$2f$Signup$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].logo
                            }, void 0, false, {
                                fileName: "[project]/src/app/signup/page.tsx",
                                lineNumber: 84,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 83,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$signup$2f$Signup$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].title,
                            children: "Create Account"
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 92,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$signup$2f$Signup$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].subtitle,
                            children: "Join us and start shopping!"
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 93,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/signup/page.tsx",
                    lineNumber: 82,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSignup,
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$signup$2f$Signup$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].form,
                    children: [
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$signup$2f$Signup$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].errorAlert,
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 97,
                            columnNumber: 31
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            label: "Username",
                            placeholder: "Choose a username",
                            name: "username",
                            value: formData.username,
                            onChange: handleChange,
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/src/app/signup/page.tsx",
                                lineNumber: 105,
                                columnNumber: 31
                            }, void 0),
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 99,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            label: "Email",
                            placeholder: "Enter your email",
                            name: "email",
                            value: formData.email,
                            onChange: handleChange,
                            type: "email",
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/src/app/signup/page.tsx",
                                lineNumber: 116,
                                columnNumber: 31
                            }, void 0),
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 109,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            label: "Phone Number",
                            placeholder: "Enter 10 digit number",
                            name: "phone",
                            value: formData.phone,
                            onChange: handleChange,
                            type: "tel",
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/src/app/signup/page.tsx",
                                lineNumber: 127,
                                columnNumber: 31
                            }, void 0),
                            maxLength: 10,
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 120,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            label: "Password",
                            placeholder: "Create a password",
                            name: "password",
                            value: formData.password,
                            onChange: handleChange,
                            type: "password",
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/src/app/signup/page.tsx",
                                lineNumber: 139,
                                columnNumber: 31
                            }, void 0),
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 132,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            label: "Confirm Password",
                            placeholder: "Confirm your password",
                            name: "confirmPassword",
                            value: formData.confirmPassword,
                            onChange: handleChange,
                            type: "password",
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                size: 18
                            }, void 0, false, {
                                fileName: "[project]/src/app/signup/page.tsx",
                                lineNumber: 150,
                                columnNumber: 31
                            }, void 0),
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 143,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                            type: "submit",
                            isLoading: isLoading,
                            fullWidth: true,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$signup$2f$Signup$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].signupBtn,
                            children: "Sign Up"
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 154,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/signup/page.tsx",
                    lineNumber: 96,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$signup$2f$Signup$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].footer,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: "Already have an account?"
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 165,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/login",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$signup$2f$Signup$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].loginLink,
                            children: "Log In"
                        }, void 0, false, {
                            fileName: "[project]/src/app/signup/page.tsx",
                            lineNumber: 166,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/signup/page.tsx",
                    lineNumber: 164,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/signup/page.tsx",
            lineNumber: 81,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/signup/page.tsx",
        lineNumber: 80,
        columnNumber: 9
    }, this);
}
_s(SignupPage, "jRfs25bGpEQA9qyzyX4Ons0h9WY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = SignupPage;
var _c;
__turbopack_context__.k.register(_c, "SignupPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_b355bb40._.js.map