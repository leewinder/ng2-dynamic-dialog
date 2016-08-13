// Imports
import { Ng2DynamicDialogComponent } from './dialog/dialog.component';

import { Ng2DynamicDialogContent } from './styles/content';
import { Ng2DynamicDialogStyle } from './styles/style';
import { Ng2DynamicDialogBehaviour } from './styles/behaviour';
import { Ng2DynamicDialogCallbacks } from './styles/callbacks';

// Exports
export * from './dialog/dialog.component';

export * from './styles/content';
export * from './styles/style';
export * from './styles/behaviour';
export * from './styles/callbacks';

// Directives
export const NG2_DYNAMIC_DIALOG_DIRECTIVES: any[] = [Ng2DynamicDialogComponent,
    Ng2DynamicDialogContent, Ng2DynamicDialogStyle, Ng2DynamicDialogBehaviour, Ng2DynamicDialogCallbacks];
