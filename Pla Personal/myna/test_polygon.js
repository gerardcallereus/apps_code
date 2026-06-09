const Matter = require('matter-js');

const shapes = [3, 4, 5, 6, 8];

shapes.forEach(sides => {
    const radius = 45;
    const apothem = radius * Math.cos(Math.PI / sides);
    const startY = 750 - apothem;
    
    // Matter polygon defaults: starts with a vertex at angle 0 if no angle is provided.
    // Matter.Bodies.polygon actually calls Body.create which respects the options.
    const body = Matter.Bodies.polygon(0, startY, sides, radius, {
        angle: Math.PI / 2 - Math.PI / sides
    });

    let maxY1 = -10000;
    let maxY2 = -10000;
    
    // find the two vertices with the largest Y
    let ys = body.vertices.map(v => v.y).sort((a,b) => b - a);
    
    console.log(`Sides: ${sides}`);
    console.log(`Expected Bottom Y: 750`);
    console.log(`Actual Bottom Ys: ${ys[0].toFixed(2)}, ${ys[1].toFixed(2)}`);
    console.log(`Is flat on ground? ${Math.abs(ys[0] - ys[1]) < 0.1}`);
    console.log('---');
});
