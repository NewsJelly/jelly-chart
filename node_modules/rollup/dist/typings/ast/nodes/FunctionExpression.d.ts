import FunctionNode from './shared/FunctionNode';
import { NodeType } from './index';
export default class FunctionExpression extends FunctionNode {
    type: NodeType.FunctionExpression;
    initialiseChildren(): void;
}
