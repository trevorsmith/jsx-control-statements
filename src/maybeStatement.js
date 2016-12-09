var astUtil = require("./util/ast");
var conditionalUtil = require("./util/conditional");

var ELEMENTS = {
  MAYBE: "If",
  ELSE: "Else"
};

function getBlocks(nodes) {
  var result = {
    maybeBlock: [],
    elseBlock: []
  };

  var currentBlock = result.maybeBlock;

  nodes.forEach(function(node) {
    if (astUtil.isTag(node, ELEMENTS.ELSE)) {
      currentBlock = result.elseBlock;
    }
    else {
      currentBlock.push(node);
    }
  });

  return result;
}

module.exports = function maybeStatement(babel) {
  var types = babel.types;

  return function(node, file) {
    var maybeBlock;
    var elseBlock;
    var errorInfos = {node: node, file: file, element: ELEMENTS.MAYBE};
    var condition = conditionalUtil.getMaybeExpression(types, node, errorInfos);
    var key = astUtil.getKey(node);
    var children = astUtil.getChildren(types, node);
    var blocks = getBlocks(children);

    maybeBlock = astUtil.getSanitizedExpressionForContent(types, blocks.maybeBlock, key);
    elseBlock = astUtil.getSanitizedExpressionForContent(types, blocks.elseBlock, key);

    return types.ConditionalExpression(condition, maybeBlock, elseBlock);
  };
};
