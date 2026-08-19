<script setup>
    const { color, width, height, ariaLabel } = defineProps({
        color: {
            type: String,
            default: "black"
        },
        width: {
            type: [String, Number],
            default: 40
        },
        height: {
            type: [String, Number],
            default: 40
        },
        ariaLabel: {
            type: String,
            default: undefined
        }
    });
</script>

<template>
    <svg
        :width="width"
        :height="height"
        :aria-label="ariaLabel"
        viewBox="0 0 400 400"
        version="1.1"
        id="svg1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:svg="http://www.w3.org/2000/svg">
        <defs id="defs1" />
        <g
            id="layer1">
            <path
            :stroke="color"
            style="fill:#ffffff;fill-opacity:0;stroke-width:12.9466;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;paint-order:normal"
            d="M 48.783779,84.262891 C 96.746283,102.98798 144.70782,121.71269 194.64239,122.8625 244.57695,124.01231 296.48055,107.58712 348.38517,91.161607"
            id="path3"
            transform="matrix(1.1243654,0,0,1.1243654,-27.236858,146.88088)" />
            <path
            :stroke="color"
            style="fill:#000000;fill-opacity:0.962;stroke-width:12.3598;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;paint-order:normal"
            d="m 231.36269,141.81418 c 0,24.15835 0,48.31671 0,72.47506"
            id="path6-7"
            transform="matrix(1.0199605,-0.58887445,0.43279904,0.74962992,-10.510599,307.4621)" />
            <path
            :stroke="color"
            style="fill:#000000;fill-opacity:0.962;stroke-width:12.3598;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;paint-order:normal"
            d="m 231.36269,141.81418 c 0,24.15835 0,48.31671 0,72.47506"
            id="path6"
            transform="matrix(1.1777489,0,0,0.86559807,-70.208783,163.57184)" />
            <path
            :stroke="color"
            style="fill:#000000;fill-opacity:0.962;stroke-width:12.3598;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;paint-order:normal"
            d="m 231.36269,141.81418 c 0,24.15835 0,48.31671 0,72.47506"
            id="path6-8"
            transform="matrix(1.0199605,0.58887445,-0.43279904,0.74962992,-59.389381,38.131261)" />
            <ellipse
            :fill="color"
            :stroke="color"
            style="fill-opacity:0.962;stroke-width:9.36978;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;paint-order:normal"
            id="path4"
            cx="200.00012"
            cy="245.00056"
            rx="20.315113"
            ry="20.31525" />
            <path
            :stroke="color"
            style="fill:#ffffff;fill-opacity:0;stroke-width:15.5166;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;paint-order:normal"
            d="M 48.783779,84.262891 C 96.746283,102.98798 144.70782,121.71269 194.64239,122.8625 244.57695,124.01231 296.48055,107.58712 348.38517,91.161607"
            id="path3-8"
            transform="matrix(-1.2508317,0.00600487,-0.00600487,-1.2508317,448.02307,360.09007)" />
            <path
            :stroke="color"
            style="fill:#000000;fill-opacity:0;stroke-width:15;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;paint-order:normal"
            id="path8"
            d="m 255.28485,150.56107 -152.14726,0 -152.147263,0 76.07363,-131.763396 76.073633,-131.763394 76.07363,131.76339 z"
            transform="matrix(1.2056288,0,0,1.260608,74.749051,181.31461)" />
        </g>
    </svg>
</template>

<style scoped></style>