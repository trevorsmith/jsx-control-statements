var astUtil = require("./ast");
var errorUtil = require("./error");


var ATTRIBUTES = {
  CONDITION: "condition",
  IF: "if",
  UNLESS: "unless"
};

exports.getConditionExpression = function(node, errorInfos) {
  var condition = astUtil.getAttributeMap(node)[ATTRIBUTES.CONDITION];

  if (!condition) {
    errorUtil.throwNoAttribute(ATTRIBUTES.CONDITION, errorInfos);
  }
  if (!astUtil.isExpressionContainer(condition)) {
    errorUtil.throwNotExpressionType(ATTRIBUTES.CONDITION, errorInfos);
  }

  return astUtil.getExpression(condition);
};


exports.getMaybeExpression = function(babelTypes, node, errorInfos) {
  var ifCondition = astUtil.getAttributeMap(node)[ATTRIBUTES.IF];
  var unlessCondition = astUtil.getAttributeMap(node)[ATTRIBUTES.UNLESS];

  if (!ifCondition && !unlessCondition) {
    errorUtil.throwNoAttribute(ATTRIBUTES.IF, errorInfos);
  }

  if (!astUtil.isExpressionContainer(ifCondition) && !astUtil.isExpressionContainer(unlessCondition)) {
    errorUtil.throwNotExpressionType(ATTRIBUTES.IF, errorInfos);
  }

  const expressions = []

  if (ifCondition) {
    expressions.push(astUtil.getExpression(ifCondition))
  }

  if (unlessCondition) {
    const unlessExpression = astUtil.getExpression(unlessCondition)
    expressions.push(babelTypes.UnaryExpression('!', unlessExpression))
  }

  return expressions.length === 2 ?
    babelTypes.LogicalExpression('&&', expressions[0], expressions[1]) :
    expressions[0]
};
