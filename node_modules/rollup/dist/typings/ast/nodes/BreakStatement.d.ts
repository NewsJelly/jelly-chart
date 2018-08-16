import ExecutionPathOptions from '../ExecutionPathOptions';
import Identifier from './Identifier';
import { StatementBase } from './shared/Statement';
import { NodeType } from './index';
export default class BreakStatement extends StatementBase {
    type: NodeType.BreakStatement;
    label: Identifier | null;
    hasEffects(options: ExecutionPathOptions): boolean;
}
