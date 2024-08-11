'use strict';

import * as WEMath from 'WEMath';

export var scriptProperties = createScriptProperties()
    .addSlider({
        name: 'maxDistance',
        label: 'Maximum Distance',
        value: 500,
        min: 100,
        max: 2000,
        integer: true
    })
    .addSlider({
        name: 'minOpacity',
        label: 'Minimum Opacity',
        value: 0,
        min: 0,
        max: 1,
        integer: false
    })
    .addSlider({
        name: 'maxOpacity',
        label: 'Maximum Opacity',
        value: 1,
        min: 0,
        max: 1,
        integer: false
    })
    .addSlider({
        name: 'smoothing',
        label: 'Smoothing',
        value: 5,
        min: 1,
        max: 10,
        integer: false
    })
    .finish();

let smoothedOpacity = 1;

/**
 * @param {Number} value - for property 'alpha'
 * @return {Number} - update current property value
 */
export function update(value) {
    // Get the mouse position in world coordinates
    let mousePosition = input.cursorWorldPosition;
    // Get the image position (origin)
    let imagePosition = thisLayer.origin;
    
    // Calculate the distance between the mouse and the image
    let distance = mousePosition.subtract(imagePosition).length();
    
    // Normalize the distance to a value between 0 and 1
    let normalizedDistance = WEMath.smoothStep(0, scriptProperties.maxDistance, distance);
    
    // Calculate the target opacity based on the normalized distance
    let targetOpacity = scriptProperties.maxOpacity - (scriptProperties.maxOpacity - scriptProperties.minOpacity) * normalizedDistance;
    
    // Smooth the opacity transition
    smoothedOpacity += (targetOpacity - smoothedOpacity) * engine.frametime * scriptProperties.smoothing;
    
    // Return the smoothed opacity
    return smoothedOpacity;
}
