/**
 * Determines on which position to draw the node
 * (top, bottom, left, right)
 * @param {CytoscapeElement} node The node
 * @param {CytoscapeElement} node The node
 * @returns {string} Returns the position
 */
function findPosition (movingNode, fixedNode) {
    const moving = movingNode.boundingBox();
    const fixed = fixedNode.boundingBox();

    const movingMiddleOfNode = {
        x: moving.x1 + moving.w / 2,
        y: moving.y1 + moving.h / 2
    }
    const fixedMiddleOfNode = {
        x: fixed.x1 + fixed.w / 2,
        y: fixed.y1 + fixed.h / 2
    }
    let finalPosition = '';
    if (movingMiddleOfNode.y > fixedMiddleOfNode.y &&
        Math.abs((movingMiddleOfNode.y - fixedMiddleOfNode.y)) > Math.abs((movingMiddleOfNode.x - fixedMiddleOfNode.x))) {
        finalPosition = 'bottom';
    } else if (movingMiddleOfNode.y < fixedMiddleOfNode.y &&
        Math.abs((movingMiddleOfNode.y - fixedMiddleOfNode.y)) > Math.abs((movingMiddleOfNode.x - fixedMiddleOfNode.x))) {
        finalPosition = 'top';
    } else if (movingMiddleOfNode.x > fixedMiddleOfNode.x &&
        Math.abs((movingMiddleOfNode.x - fixedMiddleOfNode.x)) > Math.abs((movingMiddleOfNode.y - fixedMiddleOfNode.y))) {
        finalPosition += 'right';
    } else if (movingMiddleOfNode.x < fixedMiddleOfNode.x &&
        Math.abs((movingMiddleOfNode.x - fixedMiddleOfNode.x)) > Math.abs((movingMiddleOfNode.y - fixedMiddleOfNode.y))) {
        finalPosition += 'left';
    }
    return finalPosition;
}

module.exports = function({padding = 0} = {}){
    let eles = this;
    let cy = this.cy();

    eles.on('drag', evt => {
        // boundingBox() is not returnin the right width and height
        const currentPosition = {
            x1: evt.target.position().x - evt.target.width() / 2,
            x2: evt.target.position().x + evt.target.width() / 2,
            y1: evt.target.position().y - evt.target.height() / 2,
            y2: evt.target.position().y + evt.target.height() / 2,
            w: evt.target.width(),
            h: evt.target.height()
        };
        let overlappingNode = null;

        cy.nodes().forEach(aNode => {
            if (aNode.id() === evt.target.id()) {
                return;
            }
            const bb = JSON.parse(JSON.stringify(aNode.boundingbox()));
            bb.x1 -= padding;
            bb.x2 += padding;
            bb.y1 -= padding;
            bb.y2 += padding;
            // bottom right
            if (currentPosition.x1 < bb.x2 &&
                currentPosition.x1 > bb.x1 &&
                currentPosition.y1 < bb.y2 &&
                currentPosition.y1 > bb.y1) {
                overlappingNode = aNode;
            }
            // bottom left
            if (currentPosition.x2 < bb.x2 &&
                currentPosition.x2 > bb.x1 &&
                currentPosition.y1 < bb.y2 &&
                currentPosition.y1 > bb.y1) {
                overlappingNode = aNode;
            }
            // top left
            if (currentPosition.x2 < bb.x2 &&
                currentPosition.x2 > bb.x1 &&
                currentPosition.y2 > bb.y1 &&
                currentPosition.y2 < bb.y2) {
                overlappingNode = aNode;
            }
            // top right
            if (currentPosition.x1 < bb.x2 &&
                currentPosition.x1 > bb.x1 &&
                currentPosition.y2 < bb.y2 &&
                currentPosition.y2 > bb.y1) {
                overlappingNode = aNode;
            }
        });
        if (overlappingNode) {
            const position = findPosition(evt.target, overlappingNode);
            const overlappingBB =  JSON.parse(JSON.stringify(overlappingNode.boundingBox()));
            overlappingBB.x1 -= padding;
            overlappingBB.x2 += padding;
            overlappingBB.y1 -= padding;
            overlappingBB.y2 += padding;

            let finalPos = {x: 0, y: 0}
            switch (position) {
                case 'top':
                    finalPos = {
                        x: currentPosition.x1 + currentPosition.w / 2,
                        y: overlappingBB.y1 - currentPosition.h / 2
                    }
                    break;
                case 'right':
                    finalPos = {
                        x: overlappingBB.x2 + currentPosition.w / 2,
                        y: currentPosition.y1 + currentPosition.w / 2
                    }
                    break;
                case 'bottom':
                    finalPos = {
                        x: currentPosition.x1 + currentPosition.w / 2,
                        y: overlappingBB.y2 + currentPosition.h / 2
                    }
                    break;
                case 'left':
                    finalPos = {
                        x: overlappingBB.x1 - currentPosition.w / 2,
                        y: currentPosition.y1 + currentPosition.h / 2
                    }
                    break;
            }
            evt.target.position(finalPos);
            return;
        }
    });

    return this; // chainability
};
