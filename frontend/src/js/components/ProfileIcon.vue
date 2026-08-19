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
        <defs
            id="defs1">
            <linearGradient
                id="swatch7">
                <stop
                style="stop-color:#000000;stop-opacity:1;"
                offset="0"
                id="stop7" />
            </linearGradient>
        </defs>
        <g
            id="layer1">
            <path
            :stroke="color"
            style="opacity:1;fill:#ffffff;fill-opacity:0;fill-rule:nonzero;stroke-width:20;stroke-linecap:butt;stroke-linejoin:miter;stroke-dasharray:none;stroke-opacity:1;paint-order:normal"
            d="m 68.494397,340 c 17.032875,-16.66675 34.065593,-33.33335 56.075763,-45.40473 22.01017,-12.07138 48.99744,-19.54741 75.08291,-19.54741 26.08548,0 51.26785,7.47603 72.94951,19.54741 21.68166,12.07138 39.86229,28.738 58.04304,45.40473"
            id="path10" />
            <ellipse
            :stroke="color"
            style="fill:#ffffff;fill-opacity:0;fill-rule:nonzero;stroke-width:20;stroke-dasharray:none;stroke-opacity:1"
            id="path1-3"
            cx="200"
            cy="148.99207"
            rx="98.747643"
            ry="98.992073" />
            <ellipse
            :stroke="color"
            style="display:inline;opacity:1;fill:#ffffff;fill-opacity:0;fill-rule:nonzero;stroke-width:19.3224;stroke-dasharray:none;stroke-opacity:1;paint-order:normal"
            id="path1"
            cx="200"
            cy="200.47115"
            rx="190.33881"
            ry="190.80995" />
        </g>
    </svg>
</template>

<style scoped></style>