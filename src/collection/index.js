/**
 * Verifies each points of the bounding box (a) and looks if any of these points are inside the second bounding box (b)
 * @param {CytoscapeElement} a Node to compare
 * @param {CytoscapeElement} b Node to compare
 * @returns {boolean} Return true if node a overlaps node b
 */
function compareNodes (a, b) {
    let isOverlapping = false;
    // bottom right
    if (a.x1 < b.x2 &&
        a.x1 > b.x1 &&
        a.y1 < b.y2 &&
        a.y1 > b.y1) {
        isOverlapping = true;
    }
    // bottom left
    if (a.x2 < b.x2 &&
        a.x2 > b.x1 &&
        a.y1 < b.y2 &&
        a.y1 > b.y1) {
        isOverlapping = true;
    }
    // top left
    if (a.x2 < b.x2 &&
        a.x2 > b.x1 &&
        a.y2 > b.y1 &&
        a.y2 < b.y2) {
        isOverlapping = true;
    }
    // top right
    if (a.x1 < b.x2 &&
        a.x1 > b.x1 &&
        a.y2 < b.y2 &&
        a.y2 > b.y1) {
        isOverlapping = true;
    }
    return isOverlapping;
}

/**
 * Recursively checks if a node or it's parent overlaps any of the shown nodes
 * @param {CytoscapeElement} node The node to verify
 * @param {number} padding A bigger padding will make the overlap happen before
 * @returns {boolean} True if the node overlaps any of the other nodes
 */
function checkIfOverlaps (node, padding) {
    let siblings;
    if (node.isChild()) {
        siblings = node.parent().children().difference(node);
    } else {
        siblings = node.cy().nodes().orphans().difference(node);
    }
    let isOverlapping = false;
    siblings.forEach(neighbor => {
        const neighborBB = {
            w: neighbor.renderedOuterWidth(),
            h: neighbor.renderedOuterHeight(),
            x1: neighbor.renderedPoint().x - neighbor.renderedOuterWidth() / 2 - padding,
            x2: neighbor.renderedPoint().x + neighbor.renderedOuterWidth() / 2 + padding,
            y1: neighbor.renderedPoint().y - neighbor.renderedOuterHeight() / 2 - padding,
            y2: neighbor.renderedPoint().y + neighbor.renderedOuterHeight() / 2 + padding
        };
        const currentNodeBB = {
            w: node.renderedOuterWidth(),
            h: node.renderedOuterHeight(),
            x1: node.renderedPoint().x - node.renderedOuterWidth() / 2 - padding,
            x2: node.renderedPoint().x + node.renderedOuterWidth() / 2 + padding,
            y1: node.renderedPoint().y - node.renderedOuterHeight() / 2 - padding,
            y2: node.renderedPoint().y + node.renderedOuterHeight() / 2 + padding
        };
        if (compareNodes(currentNodeBB, neighborBB)) {
            isOverlapping = true;
        }
        if (compareNodes(neighborBB, currentNodeBB)) {
            isOverlapping = true;
        }
    });
    if (node.parent().length > 0) {
        if (checkIfOverlaps(node.parent(), padding)) {
            isOverlapping = true;
        }
    }
    return isOverlapping;
}

module.exports = function({padding = 0} = {}){
    this.on('drag', evt => {
        if (checkIfOverlaps(evt.target, padding)) {
            evt.target.position(evt.target.scratch('previousPosition'));
        } else {
            evt.target.scratch('previousPosition',  JSON.parse(JSON.stringify(evt.target.position())));
        }
    });

    return this;
};
