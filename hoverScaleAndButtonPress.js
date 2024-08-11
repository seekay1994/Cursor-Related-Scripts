'use strict';

import * as WEMath from 'WEMath';

export var scriptProperties = createScriptProperties()
    .addSlider({
        name: 'hoverScale',
        label: 'Hover Scale',
        value: 1.2,
        min: 1,
        max: 2,
        integer: false
    })
    .addSlider({
        name: 'clickScale',
        label: 'Click Scale',
        value: 0.8,
        min: 0.5,
        max: 1,
        integer: false
    })
    .addSlider({
        name: 'speed',
        label: 'Animation Speed',
        value: 5,
        min: 0.1,
        max: 10,
        integer: false
    })
    .finish();

let targetScale = new Vec3(1, 1, 1); // Default scale
let currentScale = new Vec3(1, 1, 1);
let isHovered = false;
let isClicked = false;

/**
 * @param {Vec3} value - for property 'scale'
 * @return {Vec3} - update current property value
 */
export function update(value) {
    let frametime = engine.frametime * scriptProperties.speed;
    
    // Smoothly transition to the target scale
    currentScale = currentScale.mix(targetScale, frametime);
    
    return currentScale;
}

/**
 * @param {CursorEvent} event
 * Triggers when the cursor enters the layer's bounding box
 */
export function cursorEnter(event) {
    isHovered = true;
    if (!isClicked) {
        targetScale = new Vec3(scriptProperties.hoverScale, scriptProperties.hoverScale, 1);
    }
}

/**
 * @param {CursorEvent} event
 * Triggers when the cursor leaves the layer's bounding box
 */
export function cursorLeave(event) {
    isHovered = false;
    if (!isClicked) {
        targetScale = new Vec3(1, 1, 1); // Return to default scale
    }
}

/**
 * @param {CursorEvent} event
 * Triggers when the layer is clicked
 */
export function cursorClick(event) {
    isClicked = true;
    targetScale = new Vec3(scriptProperties.clickScale, scriptProperties.clickScale, 1);
    engine.setTimeout(() => {
        isClicked = false;
        targetScale = isHovered ? 
                      new Vec3(scriptProperties.hoverScale, scriptProperties.hoverScale, 1) : 
                      new Vec3(1, 1, 1);
    }, 150); // Return to hover scale after 150ms
}
