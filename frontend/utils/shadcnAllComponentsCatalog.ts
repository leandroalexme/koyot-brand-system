export interface ShadcnSubPartDef {
  id: string;
  label: string;
  kind: 'text' | 'surface' | 'control';
}

export interface ShadcnComponentDef {
  id: string;
  name: string;
  radixPackage?: string;
  subParts: ShadcnSubPartDef[];
}

/**
 * Complete alphabetical catalog of official shadcn/ui components
 * from https://ui.shadcn.com/docs/components
 */
export const SHADCN_ALL_COMPONENTS: ShadcnComponentDef[] = [
  {
    id: 'accordion',
    name: 'Accordion',
    radixPackage: '@radix-ui/react-accordion',
    subParts: [
      { id: 'trigger', label: 'Trigger', kind: 'text' },
      { id: 'item', label: 'Item', kind: 'surface' },
      { id: 'content', label: 'Content', kind: 'text' },
    ],
  },
  {
    id: 'alert',
    name: 'Alert',
    subParts: [
      { id: 'container', label: 'Container', kind: 'surface' },
      { id: 'title', label: 'Title', kind: 'text' },
      { id: 'description', label: 'Description', kind: 'text' },
    ],
  },
  {
    id: 'alert-dialog',
    name: 'Alert Dialog',
    radixPackage: '@radix-ui/react-alert-dialog',
    subParts: [
      { id: 'surface', label: 'Dialog', kind: 'surface' },
      { id: 'title', label: 'Title', kind: 'text' },
      { id: 'action', label: 'Action', kind: 'control' },
    ],
  },
  {
    id: 'aspect-ratio',
    name: 'Aspect Ratio',
    radixPackage: '@radix-ui/react-aspect-ratio',
    subParts: [
      { id: 'frame', label: 'Frame', kind: 'surface' },
      { id: 'badge', label: 'Label', kind: 'text' },
    ],
  },
  {
    id: 'avatar',
    name: 'Avatar',
    radixPackage: '@radix-ui/react-avatar',
    subParts: [
      { id: 'frame', label: 'Avatar', kind: 'surface' },
      { id: 'fallback', label: 'Fallback', kind: 'text' },
    ],
  },
  {
    id: 'badge',
    name: 'Badge',
    subParts: [
      { id: 'pill', label: 'Badge', kind: 'control' },
      { id: 'label', label: 'Label', kind: 'text' },
    ],
  },
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    subParts: [
      { id: 'link', label: 'Link', kind: 'text' },
      { id: 'page', label: 'Current Page', kind: 'text' },
    ],
  },
  {
    id: 'button',
    name: 'Button',
    radixPackage: '@radix-ui/react-slot',
    subParts: [
      { id: 'button', label: 'Button', kind: 'control' },
      { id: 'label', label: 'Label', kind: 'text' },
    ],
  },
  {
    id: 'button-group',
    name: 'Button Group',
    subParts: [
      { id: 'group', label: 'Group', kind: 'surface' },
      { id: 'item', label: 'Button', kind: 'control' },
    ],
  },
  {
    id: 'calendar',
    name: 'Calendar',
    subParts: [
      { id: 'surface', label: 'Calendar', kind: 'surface' },
      { id: 'day', label: 'Selected Day', kind: 'control' },
      { id: 'header', label: 'Month Label', kind: 'text' },
    ],
  },
  {
    id: 'card',
    name: 'Card',
    subParts: [
      { id: 'surface', label: 'Card', kind: 'surface' },
      { id: 'title', label: 'Title', kind: 'text' },
      { id: 'action', label: 'Action', kind: 'control' },
    ],
  },
  {
    id: 'carousel',
    name: 'Carousel',
    subParts: [
      { id: 'slide', label: 'Slide Card', kind: 'surface' },
      { id: 'control', label: 'Arrow Button', kind: 'control' },
    ],
  },
  {
    id: 'chart',
    name: 'Chart',
    subParts: [
      { id: 'surface', label: 'Chart Card', kind: 'surface' },
      { id: 'bar', label: 'Data Series', kind: 'control' },
      { id: 'label', label: 'Axis Label', kind: 'text' },
    ],
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    radixPackage: '@radix-ui/react-checkbox',
    subParts: [
      { id: 'box', label: 'Checkbox', kind: 'control' },
      { id: 'label', label: 'Label', kind: 'text' },
    ],
  },
  {
    id: 'collapsible',
    name: 'Collapsible',
    radixPackage: '@radix-ui/react-collapsible',
    subParts: [
      { id: 'trigger', label: 'Trigger', kind: 'control' },
      { id: 'content', label: 'Content Item', kind: 'surface' },
    ],
  },
  {
    id: 'combobox',
    name: 'Combobox',
    subParts: [
      { id: 'trigger', label: 'Trigger', kind: 'control' },
      { id: 'popover', label: 'Popover', kind: 'surface' },
    ],
  },
  {
    id: 'command',
    name: 'Command',
    subParts: [
      { id: 'surface', label: 'Command Box', kind: 'surface' },
      { id: 'item', label: 'Command Item', kind: 'control' },
    ],
  },
  {
    id: 'context-menu',
    name: 'Context Menu',
    radixPackage: '@radix-ui/react-context-menu',
    subParts: [
      { id: 'trigger', label: 'Right-Click Zone', kind: 'surface' },
      { id: 'menu', label: 'Menu', kind: 'surface' },
    ],
  },
  {
    id: 'data-table',
    name: 'Data Table',
    subParts: [
      { id: 'surface', label: 'Table', kind: 'surface' },
      { id: 'header', label: 'Header', kind: 'text' },
      { id: 'row', label: 'Row', kind: 'surface' },
    ],
  },
  {
    id: 'date-picker',
    name: 'Date Picker',
    subParts: [
      { id: 'trigger', label: 'Trigger Button', kind: 'control' },
      { id: 'label', label: 'Date Text', kind: 'text' },
    ],
  },
  {
    id: 'dialog',
    name: 'Dialog',
    radixPackage: '@radix-ui/react-dialog',
    subParts: [
      { id: 'surface', label: 'Modal', kind: 'surface' },
      { id: 'title', label: 'Title', kind: 'text' },
      { id: 'confirm', label: 'Confirm', kind: 'control' },
    ],
  },
  {
    id: 'drawer',
    name: 'Drawer',
    subParts: [
      { id: 'surface', label: 'Sheet', kind: 'surface' },
      { id: 'handle', label: 'Handle', kind: 'control' },
      { id: 'action', label: 'Action', kind: 'control' },
    ],
  },
  {
    id: 'dropdown-menu',
    name: 'Dropdown Menu',
    radixPackage: '@radix-ui/react-dropdown-menu',
    subParts: [
      { id: 'menu', label: 'Menu', kind: 'surface' },
      { id: 'item', label: 'Item', kind: 'control' },
    ],
  },
  {
    id: 'empty',
    name: 'Empty',
    subParts: [
      { id: 'surface', label: 'Container', kind: 'surface' },
      { id: 'title', label: 'Title', kind: 'text' },
      { id: 'action', label: 'Action', kind: 'control' },
    ],
  },
  {
    id: 'field',
    name: 'Field',
    subParts: [
      { id: 'label', label: 'Label', kind: 'text' },
      { id: 'control', label: 'Input', kind: 'control' },
      { id: 'helper', label: 'Description', kind: 'text' },
    ],
  },
  {
    id: 'hover-card',
    name: 'Hover Card',
    radixPackage: '@radix-ui/react-hover-card',
    subParts: [
      { id: 'trigger', label: 'Trigger Link', kind: 'text' },
      { id: 'card', label: 'Hover Card', kind: 'surface' },
    ],
  },
  {
    id: 'input',
    name: 'Input',
    subParts: [
      { id: 'label', label: 'Label', kind: 'text' },
      { id: 'field', label: 'Field', kind: 'control' },
    ],
  },
  {
    id: 'input-group',
    name: 'Input Group',
    subParts: [
      { id: 'addon', label: 'Addon', kind: 'surface' },
      { id: 'field', label: 'Input', kind: 'control' },
    ],
  },
  {
    id: 'input-otp',
    name: 'Input OTP',
    subParts: [
      { id: 'slot', label: 'OTP Slot', kind: 'control' },
      { id: 'label', label: 'Digit', kind: 'text' },
    ],
  },
  {
    id: 'item',
    name: 'Item',
    subParts: [
      { id: 'surface', label: 'Row Item', kind: 'surface' },
      { id: 'title', label: 'Title', kind: 'text' },
      { id: 'badge', label: 'Badge', kind: 'control' },
    ],
  },
  {
    id: 'kbd',
    name: 'Kbd',
    subParts: [
      { id: 'key', label: 'Keycap', kind: 'control' },
      { id: 'label', label: 'Glyph', kind: 'text' },
    ],
  },
  {
    id: 'label',
    name: 'Label',
    radixPackage: '@radix-ui/react-label',
    subParts: [
      { id: 'label', label: 'Label', kind: 'text' },
    ],
  },
  {
    id: 'menubar',
    name: 'Menubar',
    radixPackage: '@radix-ui/react-menubar',
    subParts: [
      { id: 'bar', label: 'Menubar', kind: 'surface' },
      { id: 'item', label: 'Trigger', kind: 'control' },
    ],
  },
  {
    id: 'native-select',
    name: 'Native Select',
    subParts: [
      { id: 'select', label: 'Select Box', kind: 'control' },
      { id: 'label', label: 'Label', kind: 'text' },
    ],
  },
  {
    id: 'navigation-menu',
    name: 'Navigation Menu',
    radixPackage: '@radix-ui/react-navigation-menu',
    subParts: [
      { id: 'list', label: 'Menu Bar', kind: 'surface' },
      { id: 'trigger', label: 'Item', kind: 'control' },
    ],
  },
  {
    id: 'pagination',
    name: 'Pagination',
    subParts: [
      { id: 'active', label: 'Active Page', kind: 'control' },
      { id: 'item', label: 'Page Button', kind: 'surface' },
    ],
  },
  {
    id: 'popover',
    name: 'Popover',
    radixPackage: '@radix-ui/react-popover',
    subParts: [
      { id: 'surface', label: 'Popover', kind: 'surface' },
      { id: 'title', label: 'Heading', kind: 'text' },
    ],
  },
  {
    id: 'progress',
    name: 'Progress',
    radixPackage: '@radix-ui/react-progress',
    subParts: [
      { id: 'label', label: 'Label', kind: 'text' },
      { id: 'track', label: 'Track', kind: 'control' },
      { id: 'indicator', label: 'Indicator', kind: 'surface' },
    ],
  },
  {
    id: 'radio-group',
    name: 'Radio Group',
    radixPackage: '@radix-ui/react-radio-group',
    subParts: [
      { id: 'item', label: 'Radio', kind: 'control' },
      { id: 'label', label: 'Label', kind: 'text' },
    ],
  },
  {
    id: 'resizable',
    name: 'Resizable',
    subParts: [
      { id: 'panel', label: 'Panel', kind: 'surface' },
      { id: 'handle', label: 'Handle', kind: 'control' },
    ],
  },
  {
    id: 'scroll-area',
    name: 'Scroll Area',
    radixPackage: '@radix-ui/react-scroll-area',
    subParts: [
      { id: 'viewport', label: 'Viewport', kind: 'surface' },
      { id: 'thumb', label: 'Scrollbar', kind: 'control' },
    ],
  },
  {
    id: 'select',
    name: 'Select',
    radixPackage: '@radix-ui/react-select',
    subParts: [
      { id: 'trigger', label: 'Trigger', kind: 'control' },
      { id: 'content', label: 'Menu', kind: 'surface' },
      { id: 'label', label: 'Label', kind: 'text' },
    ],
  },
  {
    id: 'separator',
    name: 'Separator',
    radixPackage: '@radix-ui/react-separator',
    subParts: [
      { id: 'line', label: 'Divider', kind: 'surface' },
      { id: 'label', label: 'Text', kind: 'text' },
    ],
  },
  {
    id: 'sheet',
    name: 'Sheet',
    radixPackage: '@radix-ui/react-dialog',
    subParts: [
      { id: 'surface', label: 'Panel', kind: 'surface' },
      { id: 'title', label: 'Title', kind: 'text' },
      { id: 'action', label: 'Button', kind: 'control' },
    ],
  },
  {
    id: 'sidebar',
    name: 'Sidebar',
    subParts: [
      { id: 'surface', label: 'Sidebar', kind: 'surface' },
      { id: 'item', label: 'Active Item', kind: 'control' },
    ],
  },
  {
    id: 'skeleton',
    name: 'Skeleton',
    subParts: [
      { id: 'block', label: 'Bone', kind: 'surface' },
    ],
  },
  {
    id: 'slider',
    name: 'Slider',
    radixPackage: '@radix-ui/react-slider',
    subParts: [
      { id: 'label', label: 'Label', kind: 'text' },
      { id: 'track', label: 'Track', kind: 'control' },
      { id: 'thumb', label: 'Thumb', kind: 'surface' },
    ],
  },
  {
    id: 'sonner',
    name: 'Sonner',
    subParts: [
      { id: 'toast', label: 'Toast Card', kind: 'surface' },
      { id: 'action', label: 'Action Pill', kind: 'control' },
    ],
  },
  {
    id: 'spinner',
    name: 'Spinner',
    subParts: [
      { id: 'ring', label: 'Spinner', kind: 'control' },
      { id: 'label', label: 'Label', kind: 'text' },
    ],
  },
  {
    id: 'switch',
    name: 'Switch',
    radixPackage: '@radix-ui/react-switch',
    subParts: [
      { id: 'label', label: 'Label', kind: 'text' },
      { id: 'track', label: 'Track', kind: 'control' },
      { id: 'thumb', label: 'Thumb', kind: 'surface' },
    ],
  },
  {
    id: 'table',
    name: 'Table',
    subParts: [
      { id: 'surface', label: 'Table', kind: 'surface' },
      { id: 'header', label: 'Header', kind: 'text' },
      { id: 'cell', label: 'Cell', kind: 'text' },
    ],
  },
  {
    id: 'tabs',
    name: 'Tabs',
    radixPackage: '@radix-ui/react-tabs',
    subParts: [
      { id: 'list', label: 'Tabs List', kind: 'surface' },
      { id: 'trigger', label: 'Active Tab', kind: 'control' },
    ],
  },
  {
    id: 'textarea',
    name: 'Textarea',
    subParts: [
      { id: 'label', label: 'Label', kind: 'text' },
      { id: 'field', label: 'Textarea', kind: 'control' },
    ],
  },
  {
    id: 'toast',
    name: 'Toast',
    radixPackage: '@radix-ui/react-toast',
    subParts: [
      { id: 'surface', label: 'Toast', kind: 'surface' },
      { id: 'title', label: 'Title', kind: 'text' },
      { id: 'action', label: 'Action', kind: 'control' },
    ],
  },
  {
    id: 'toggle',
    name: 'Toggle',
    radixPackage: '@radix-ui/react-toggle',
    subParts: [
      { id: 'button', label: 'Toggle', kind: 'control' },
      { id: 'label', label: 'Label', kind: 'text' },
    ],
  },
  {
    id: 'toggle-group',
    name: 'Toggle Group',
    radixPackage: '@radix-ui/react-toggle-group',
    subParts: [
      { id: 'group', label: 'Group', kind: 'surface' },
      { id: 'item', label: 'Active Item', kind: 'control' },
    ],
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    radixPackage: '@radix-ui/react-tooltip',
    subParts: [
      { id: 'bubble', label: 'Tooltip', kind: 'surface' },
      { id: 'trigger', label: 'Trigger', kind: 'control' },
    ],
  },
];
