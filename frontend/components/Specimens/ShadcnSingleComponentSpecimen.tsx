import React, { useState } from 'react';
import {
  BrandTokens,
  EditorialBlock,
  SelectedInspectorTarget,
  ShadcnSingleBlockType,
} from '../../types';
import { getReadableTextColor } from '../../utils/styleUtils';
import {
  getUnifiedDesignMetrics,
  getLimeScopeCssVars,
  buildBlockDataSlotCss,
} from '../../utils/overrideUtils';
import {
  ChevronDown,
  Copy,
  Play,
  SlidersHorizontal,
} from 'lucide-react';

// Real @base-ui/react + Koyot UI (systems/koyot) primitives & blocks
import { KoyotPortalProvider } from '../../systems/koyot/lib/portal';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../systems/koyot/ui/accordion';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogClose,
} from '../../systems/koyot/ui/alert-dialog';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from '../../systems/koyot/ui/combobox';
import { Avatar, AvatarGroup } from '../../systems/koyot/ui/avatar';
import { Button } from '../../systems/koyot/ui/button';
import { Checkbox } from '../../systems/koyot/ui/checkbox';
import { Chip } from '../../systems/koyot/ui/chip';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../../systems/koyot/ui/collapsible';
import { Field, FieldLabel, FieldDescription } from '../../systems/koyot/ui/field';
import { Input } from '../../systems/koyot/ui/input';
import { Slider } from '../../systems/koyot/ui/slider';
import { Switch } from '../../systems/koyot/ui/switch';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../../systems/koyot/ui/tabs';
import { Segmented, SegmentedItem } from '../../systems/koyot/ui/segmented';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from '../../systems/koyot/ui/select';
import { RadioGroup, Radio } from '../../systems/koyot/ui/radio';
import { Progress } from '../../systems/koyot/ui/progress';
import { Badge } from '../../systems/koyot/ui/badge';
import { Amount, formatAmount } from '../../systems/koyot/ui/amount';
import { Balance } from '../../systems/koyot/ui/balance';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../../systems/koyot/ui/table';
import { List, ListItem, ListIcon } from '../../systems/koyot/ui/list';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
} from '../../systems/koyot/ui/popover';
import {
  Toolbar,
  ToolbarGroup,
  ToolbarButton,
  ToolbarToggle,
  ToolbarSeparator,
} from '../../systems/koyot/ui/toolbar';
import { Keypad } from '../../systems/koyot/ui/keypad';
import { BillSchedule } from '../../systems/koyot/ui/bill-schedule';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../../systems/koyot/ui/dropdown-menu';
import { Skeleton } from '../../systems/koyot/ui/skeleton';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../../systems/koyot/ui/card';
import { Status } from '../../systems/koyot/ui/status';
import { CopyButton } from '../../systems/koyot/ui/copy-button';
import { PaymentDone } from '../../systems/koyot/ui/payment-done';
import { ApprovalRequest } from '../../systems/koyot/ai/approval-request';
import { HomeScreen } from '../../systems/koyot/blocks/home';
import { PayingABill } from '../../systems/koyot/blocks/assistant-approval';
import { SplitDinner } from '../../systems/koyot/blocks/split-request';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '../../systems/koyot/ui/breadcrumb';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '../../systems/koyot/ui/pagination';
import { Calendar } from '../../systems/koyot/ui/calendar';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '../../systems/koyot/ui/input-otp';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from '../../systems/koyot/ui/menubar';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '../../systems/koyot/ui/navigation-menu';
import {
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
} from '../../systems/koyot/ui/toggle';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from '../../systems/koyot/ui/command';
import { Kbd } from '../../systems/koyot/ui/kbd';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../../systems/koyot/ui/dialog';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '../../systems/koyot/ui/sheet';
import { Textarea } from '../../systems/koyot/ui/textarea';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../../systems/koyot/ui/tooltip';
import {
  Empty,
  EmptyIcon,
  EmptyTitle,
  EmptyDescription,
  EmptyActions,
} from '../../systems/koyot/ui/empty';
import { Dropzone } from '../../systems/koyot/ui/dropzone';
import {
  Icon,
  Delete,
  Wallet,
  PiggyBank,
  Cafe,
  ShoppingBag,
  Send,
  Edit,
} from '../../systems/koyot/icon';

export const SHADCN_BLOCK_VARIANTS: Record<ShadcnSingleBlockType, string[]> = {
  'ui-accordion': ['Minimal', 'Default open', 'Multi-item'],
  'ui-alert': ['Approval request', 'Payment done', 'Status indicators'],
  'ui-alert-dialog': ['Trigger button', 'Destructive', 'Inline confirm'],
  'ui-autocomplete': ['City search', 'Merchant combobox', 'With helper'],
  'ui-avatar': ['Single', 'Avatar group', 'Sizes'],
  'ui-badge': ['Badges', 'Amount pills', 'Balance chip'],
  'ui-breadcrumb': ['Chevron path', 'Slash separator', 'With dropdown ellipsis'],
  'ui-button': [
    'Primary',
    'Inline confirm',
    'Glow',
    'Solid',
    'Secondary',
    'Outline',
    'Ghost',
    'Destructive',
  ],
  'ui-calendar': ['Month view', 'With selected day', 'Bill schedule'],
  'ui-card': ['Surface card', 'Outline card', 'Raised card', 'Glow card', 'Home block'],
  'ui-checkbox': ['Single', 'Indeterminate', 'Disabled'],
  'ui-checkbox-group': ['Vertical list', 'Filter chips'],
  'ui-collapsible': ['Collapsed', 'Expanded', 'Approval reasons'],
  'ui-combobox': ['City combobox', 'Account picker'],
  'ui-command': ['Command palette', 'With groups and shortcuts', 'Assistant block'],
  'ui-dialog': ['Form modal', 'Destructive confirm', 'Information'],
  'ui-drawer': ['Transaction list', 'Grouped list'],
  'ui-dropdown-menu': ['Actions menu', 'With destructive'],
  'ui-input': ['Field + Label', 'Sizes (sm / md / lg)', 'Error state'],
  'ui-input-otp': ['6-digit split', '4-digit pin', 'Amount keypad'],
  'ui-menubar': ['Application bar', 'With shortcuts'],
  'ui-navigation-menu': ['Top bar with dropdown', 'Sub-menu links', 'Pills navigation'],
  'ui-pagination': ['Numbered', 'Compact', 'With Previous & Next'],
  'ui-popover': ['Split bill popover', 'Account details'],
  'ui-progress': ['Linear bar', 'Progress ring', 'Goal card'],
  'ui-radio-group': ['Transfer speed', 'Plan choice'],
  'ui-select': ['Account select', 'Category select'],
  'ui-separator': ['Transaction list', 'Grouped list'],
  'ui-sheet': ['Right drawer', 'Bottom sheet', 'Account settings'],
  'ui-skeleton': ['Activity skeleton', 'Card skeleton'],
  'ui-slider': ['Single value', 'Range (Dual thumb)', 'Compact'],
  'ui-switch': ['Inline setting', 'Multiple settings'],
  'ui-table': ['Transactions table', 'Activity list'],
  'ui-tabs': ['Underline tabs', 'Segmented tabs'],
  'ui-textarea': ['Payment note', 'Auto-grow', 'With description', 'Error state'],
  'ui-toast': ['Payment done', 'Approval receipt'],
  'ui-toggle': ['Default toggle', 'Outline toggle', 'Toggle group (Multiple)', 'Toggle group (Single)'],
  'ui-tooltip': ['Default top', 'Bottom with shortcut', 'With action icon'],
  'ui-empty': ['Default', 'With actions', 'Compact'],
  'ui-dropzone': ['Default upload', 'Receipt dropzone', 'Compact'],
};

const CITIES = ['Paris', 'Zürich', 'São Paulo', 'Tokyo', 'New York', 'London'];
const ACCOUNTS = ['Checking · 4829', 'Savings · 9910', 'Vault · 3042'];

interface ShadcnSingleComponentSpecimenProps {
  tokens: BrandTokens;
  block: EditorialBlock;
  isInspectMode?: boolean;
  selectedTarget?: SelectedInspectorTarget | null;
  onSelectSubElement?: (
    subElementId: string | undefined,
    subElementLabel?: string,
    componentLabel?: string,
    variantState?: string
  ) => void;
  onChangeVariant?: (nextVariant: string) => void;
  onOpenExportModal?: (primitiveId: string) => void;
}

export const ShadcnSingleComponentSpecimen: React.FC<
  ShadcnSingleComponentSpecimenProps
> = ({
  tokens,
  block,
  isInspectMode = false,
  selectedTarget = null,
  onSelectSubElement,
  onChangeVariant,
  onOpenExportModal,
}) => {
  const blockType = block.type as ShadcnSingleBlockType;
  const variants = SHADCN_BLOCK_VARIANTS[blockType] || ['Default'];
  const activeVariant =
    block.variant && variants.includes(block.variant)
      ? block.variant
      : variants[0];

  const ds = getUnifiedDesignMetrics(tokens);
  const isDarkTheme = block.theme === 'dark';

  // Live CSS variables feeding all `@base-ui/react` components inside `.lime`
  const limeScopeVars = getLimeScopeCssVars(tokens, isDarkTheme);

  // Local interactive states for real `@base-ui/react` primitives
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [btnPending, setBtnPending] = useState(false);
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [sliderSingle, setSliderSingle] = useState<number[]>([48]);
  const [sliderRange, setSliderRange] = useState<number[]>([24, 76]);
  const [checkedSingle, setCheckedSingle] = useState(true);
  const [checkedNotifs, setCheckedNotifs] = useState({
    all: false,
    email: true,
    push: false,
  });
  const [chipSelected, setChipSelected] = useState<Record<string, boolean>>({
    Dining: true,
    Travel: false,
    Bills: true,
  });
  const [switchRoundups, setSwitchRoundups] = useState(true);
  const [switchAutopay, setSwitchAutopay] = useState(false);
  const [segVal, setSegVal] = useState('Month');
  const [keypadVal, setKeypadVal] = useState('125');
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  const isBlockSelected = selectedTarget?.blockId === block.id;
  const selectedSlot = isBlockSelected
    ? selectedTarget?.subElementId
    : undefined;

  const cardBg =
    block.theme === 'dark'
      ? '#0E0E0C'
      : block.theme === 'tinted'
      ? tokens.surfaceTint
      : block.theme === 'brand'
      ? tokens.primaryColor
      : '#FFFFFF';
  const cardFg =
    block.theme === 'dark'
      ? '#F4F3EE'
      : block.theme === 'brand'
      ? getReadableTextColor(tokens.primaryColor)
      : ds.neutrals[9];

  const primitiveRegistrySlug = blockType.replace(/^ui-/, '');

  // Scoped CSS rules for `data-slot` inspector highlights & overrides
  const scopedSlotCss = buildBlockDataSlotCss(
    block.id,
    tokens,
    block.subElements,
    isInspectMode ? hoveredSlot : null,
    selectedSlot || null
  );

  const handleStageMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isInspectMode) return;
    const target = (e.target as HTMLElement).closest('[data-slot]');
    const slot = target?.getAttribute('data-slot') || null;
    setHoveredSlot(slot);
  };

  const handleStageMouseLeave = () => {
    if (hoveredSlot) setHoveredSlot(null);
  };

  const handleStageClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isInspectMode) return;
    const target = (e.target as HTMLElement).closest('[data-slot]');
    const slot = target?.getAttribute('data-slot');
    if (slot) {
      e.preventDefault();
      e.stopPropagation();
      const friendlyLabel = slot
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      onSelectSubElement?.(slot, friendlyLabel, block.title, activeVariant);
    }
  };

  const handlePlayInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (blockType === 'ui-button') {
      if (activeVariant === 'Inline confirm') {
        setConfirmDelete((p) => !p);
      } else {
        setBtnPending(true);
        setTimeout(() => setBtnPending(false), 900);
      }
    } else if (blockType === 'ui-alert-dialog') {
      setAlertDialogOpen(true);
    } else if (blockType === 'ui-checkbox') {
      setCheckedSingle((p) => !p);
    } else if (blockType === 'ui-collapsible') {
      setCollapsibleOpen((p) => !p);
    } else if (blockType === 'ui-switch') {
      setSwitchRoundups((p) => !p);
    } else if (blockType === 'ui-slider') {
      setSliderSingle(([v]) => [(v + 20) % 100]);
    }
  };

  const renderLimeComponentStage = () => {
    switch (blockType) {
      // 1. ACCORDION (Real @base-ui/react Accordion from systems/lime)
      case 'ui-accordion': {
        return (
          <div className="w-full max-w-xs mx-auto" key={activeVariant}>
            <Accordion
              defaultValue={
                activeVariant === 'Default open' ? ['item-1'] : []
              }
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>What is included?</AccordionTrigger>
                <AccordionContent>
                  {tokens.brandCopy.manifestoBody}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I customize it?</AccordionTrigger>
                <AccordionContent>
                  Adjust Character, Scale, Colors and Fonts live in the Studio.
                </AccordionContent>
              </AccordionItem>
              {activeVariant === 'Multi-item' && (
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I install it?</AccordionTrigger>
                  <AccordionContent>
                    Run npx shadcn@latest add to pull tokens, UI primitives and SKILL.md.
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>
        );
      }

      // 2. ALERT DIALOG (Real @base-ui/react AlertDialog from systems/lime)
      case 'ui-alert-dialog': {
        if (activeVariant === 'Inline confirm') {
          return (
            <div className="w-full max-w-xs mx-auto">
              <ApprovalRequest
                title={`Archive ${tokens.brandCopy.workspaceName}`}
                amount={-240}
                available={1200}
                reason="Moves workspace guidelines to read-only archive"
              />
            </div>
          );
        }

        const isDestructive = activeVariant === 'Destructive';

        return (
          <div className="flex items-center justify-center">
            <AlertDialog
              open={alertDialogOpen}
              onOpenChange={setAlertDialogOpen}
            >
              <AlertDialogTrigger
                render={
                  <Button variant={isDestructive ? 'destructive' : 'outline'}>
                    {isDestructive ? 'Delete goal' : 'Archive project'}
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {isDestructive
                      ? `Delete ${tokens.brandCopy.workspaceName}?`
                      : `Archive ${tokens.brandCopy.workspaceName}?`}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {isDestructive
                      ? 'This permanently removes the goal and returns funds to Checking.'
                      : 'You can restore this project from settings at any time.'}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogClose
                    render={<Button variant="ghost">Cancel</Button>}
                  />
                  <AlertDialogClose
                    render={
                      <Button
                        variant={isDestructive ? 'destructive' : 'primary'}
                      >
                        {isDestructive ? 'Delete' : 'Confirm'}
                      </Button>
                    }
                  />
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      }

      // 3. AUTOCOMPLETE / COMBOBOX (Real @base-ui/react Combobox + Field from systems/lime)
      case 'ui-autocomplete':
      case 'ui-combobox': {
        const items =
          activeVariant === 'Account picker' ? ACCOUNTS : CITIES;
        return (
          <div className="w-full max-w-xs mx-auto">
            <Field>
              <FieldLabel>
                {activeVariant === 'Account picker' ? 'Account' : 'City'}
              </FieldLabel>
              <Combobox items={items} defaultValue={items[0]}>
                <ComboboxInput
                  placeholder={
                    activeVariant === 'Account picker'
                      ? 'Select an account...'
                      : 'Choose a city...'
                  }
                  showClear
                />
                <ComboboxContent>
                  <ComboboxEmpty>No matches found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: string) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
              {activeVariant === 'With helper' && (
                <FieldDescription>
                  Used for regional tax and currency formatting.
                </FieldDescription>
              )}
            </Field>
          </div>
        );
      }

      // 4. AVATAR (Real @base-ui/react Avatar & AvatarGroup from systems/lime)
      case 'ui-avatar': {
        if (activeVariant === 'Avatar group') {
          return (
            <div className="flex items-center justify-center">
              <AvatarGroup>
                <Avatar name="Agathe J" size="md" />
                <Avatar name="Lukas M" size="md" />
                <Avatar name="Celeste V" size="md" />
                <Avatar name="Kenji T" size="md" />
              </AvatarGroup>
            </div>
          );
        }
        if (activeVariant === 'Sizes') {
          return (
            <div className="flex items-center justify-center gap-3">
              <Avatar name={tokens.brandName} size="sm" />
              <Avatar name={tokens.brandName} size="md" />
              <Avatar name={tokens.brandName} size="lg" />
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center">
            <Avatar name={tokens.brandName} size="md" />
          </div>
        );
      }

      // 5. BUTTON (Real @base-ui/react Button with .glow from systems/lime)
      case 'ui-button': {
        if (activeVariant === 'Inline confirm') {
          return (
            <div className="flex items-center justify-center">
              <Button
                variant={confirmDelete ? 'destructive' : 'secondary'}
                icon={<Icon icon={Delete} size={16} />}
                onClick={() => setConfirmDelete(!confirmDelete)}
              >
                {confirmDelete ? 'Confirm delete?' : 'Delete'}
              </Button>
            </div>
          );
        }

        const variantMap: Record<
          string,
          'primary' | 'glow' | 'solid' | 'secondary' | 'outline' | 'ghost' | 'destructive'
        > = {
          Primary: tokens.stylePresetName === 'Lime' ? 'glow' : 'primary',
          Glow: 'glow',
          Solid: 'solid',
          Secondary: 'secondary',
          Outline: 'outline',
          Ghost: 'ghost',
          Destructive: 'destructive',
        };

        return (
          <div className="flex items-center justify-center">
            <Button
              variant={variantMap[activeVariant] || 'primary'}
              pending={btnPending}
              onClick={() => {
                setBtnPending(true);
                setTimeout(() => setBtnPending(false), 700);
              }}
            >
              Continue
            </Button>
          </div>
        );
      }

      // 6. CHECKBOX (Real @base-ui/react Checkbox from systems/lime)
      case 'ui-checkbox': {
        return (
          <div className="flex items-center justify-center">
            <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
              <Checkbox
                checked={checkedSingle}
                indeterminate={activeVariant === 'Indeterminate'}
                disabled={activeVariant === 'Disabled'}
                onCheckedChange={(v) => setCheckedSingle(Boolean(v))}
              />
              <span className="text-sm text-fg">Weekly digest</span>
            </label>
          </div>
        );
      }

      // 7. CHECKBOX GROUP / CHIPS (Real Checkbox & Chip from systems/lime)
      case 'ui-checkbox-group': {
        if (activeVariant === 'Filter chips') {
          return (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {(['Dining', 'Travel', 'Bills'] as const).map((tag) => (
                <Chip
                  key={tag}
                  pressed={!!chipSelected[tag]}
                  onPressedChange={(p) =>
                    setChipSelected((prev) => ({ ...prev, [tag]: p }))
                  }
                >
                  {tag}
                </Chip>
              ))}
            </div>
          );
        }

        return (
          <div className="flex items-center justify-center">
            <div className="flex flex-col gap-2.5">
              {(
                [
                  { id: 'all', label: 'All notifications' },
                  { id: 'email', label: 'Email' },
                  { id: 'push', label: 'Push' },
                ] as const
              ).map((item) => (
                <label
                  key={item.id}
                  className="inline-flex items-center gap-2.5 cursor-pointer select-none"
                >
                  <Checkbox
                    checked={checkedNotifs[item.id]}
                    onCheckedChange={(val) => {
                      const b = Boolean(val);
                      if (item.id === 'all') {
                        setCheckedNotifs({ all: b, email: b, push: b });
                      } else {
                        setCheckedNotifs((prev) => ({
                          ...prev,
                          [item.id]: b,
                        }));
                      }
                    }}
                  />
                  <span className="text-sm text-fg">{item.label}</span>
                </label>
              ))}
            </div>
          </div>
        );
      }

      // 8. COLLAPSIBLE (Real @base-ui/react Collapsible from systems/lime)
      case 'ui-collapsible': {
        const isOpen = activeVariant === 'Expanded' || collapsibleOpen;
        return (
          <div className="w-full max-w-xs mx-auto">
            <Collapsible open={isOpen} onOpenChange={setCollapsibleOpen}>
              <CollapsibleTrigger>Project details</CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-1.5 pt-2">
                  <div className="rounded-field bg-surface px-3 py-2 text-xs text-fg-2">
                    Matches your monthly savings rule ({tokens.brandCopy.paymentAmount})
                  </div>
                  <div className="rounded-field bg-surface px-3 py-2 text-xs text-fg-2">
                    Verified on {tokens.brandCopy.domainUrl}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        );
      }

      // 9. SLIDER (Real @base-ui/react Slider from systems/lime)
      case 'ui-slider': {
        const isRange = activeVariant === 'Range (Dual thumb)';
        return (
          <div className="w-full max-w-xs mx-auto">
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>{isRange ? 'Transfer range' : 'Volume'}</FieldLabel>
                <span className="text-xs font-medium text-fg-3 tabular-nums">
                  {isRange
                    ? `${sliderRange[0]} – ${sliderRange[1]}`
                    : sliderSingle[0]}
                </span>
              </div>
              {isRange ? (
                <Slider
                  value={sliderRange}
                  onValueChange={(v) =>
                    setSliderRange(Array.isArray(v) ? v : [v])
                  }
                  thumbLabels={['Minimum', 'Maximum']}
                />
              ) : (
                <Slider
                  value={sliderSingle}
                  onValueChange={(v) =>
                    setSliderSingle(Array.isArray(v) ? v : [v])
                  }
                />
              )}
            </Field>
          </div>
        );
      }

      // 10. SWITCH (Real @base-ui/react Switch from systems/lime)
      case 'ui-switch': {
        return (
          <div className="w-full max-w-xs mx-auto flex flex-col gap-3">
            <label className="flex items-center justify-between gap-4 cursor-pointer select-none">
              <span className="text-sm font-medium text-fg">
                Round up spare change
              </span>
              <Switch
                checked={switchRoundups}
                onCheckedChange={setSwitchRoundups}
              />
            </label>
            {activeVariant === 'Multiple settings' && (
              <label className="flex items-center justify-between gap-4 cursor-pointer select-none">
                <span className="text-sm font-medium text-fg">
                  Autopay recurring bills
                </span>
                <Switch
                  checked={switchAutopay}
                  onCheckedChange={setSwitchAutopay}
                />
              </label>
            )}
          </div>
        );
      }

      // 11. TABS (Real @base-ui/react Tabs from systems/lime)
      case 'ui-tabs': {
        if (activeVariant === 'Segmented tabs') {
          return (
            <div className="flex items-center justify-center w-full max-w-xs mx-auto" key={activeVariant}>
              <Segmented
                value={segVal}
                onValueChange={setSegVal}
              >
                <SegmentedItem value="Week">Week</SegmentedItem>
                <SegmentedItem value="Month">Month</SegmentedItem>
                <SegmentedItem value="Year">Year</SegmentedItem>
              </Segmented>
            </div>
          );
        }

        return (
          <div className="w-full max-w-xs mx-auto" key={activeVariant}>
            <Tabs defaultValue="activity">
              <TabsList>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
              </TabsList>
              <TabsContent value="activity">
                <p className="text-sm text-fg-2">
                  Recent transfers and card activity on {tokens.brandName}.
                </p>
              </TabsContent>
              <TabsContent value="scheduled">
                <p className="text-sm text-fg-2">
                  Next scheduled transfer on {tokens.brandCopy.paymentDue}.
                </p>
              </TabsContent>
              <TabsContent value="rules">
                <p className="text-sm text-fg-2">
                  Save 10% of every incoming deposit automatically.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        );
      }

      // 12. SELECT (Real @base-ui/react Select from systems/lime)
      case 'ui-select': {
        return (
          <div className="flex items-center justify-center" key={activeVariant}>
            <Field className="w-fit">
              <FieldLabel>
                {activeVariant === 'Category select' ? 'Category' : 'Account'}
              </FieldLabel>
              <Select defaultValue="checking">
                <SelectTrigger />
                <SelectContent>
                  <SelectItem value="checking">Checking · $2,481</SelectItem>
                  <SelectItem value="savings">Savings · $8,200</SelectItem>
                  <SelectItem value="vault">Reserve Vault</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </div>
        );
      }

      // 13. RADIO GROUP (Real @base-ui/react RadioGroup & Radio from systems/lime)
      case 'ui-radio-group': {
        if (activeVariant === 'Plan choice') {
          return (
            <div className="w-full max-w-xs mx-auto" key={activeVariant}>
              <RadioGroup defaultValue="pro">
                <label className="flex items-center justify-between p-2.5 rounded-control border border-line bg-surface cursor-pointer hover:bg-surface-2 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <Radio value="starter" />
                    <div>
                      <span className="text-xs font-semibold text-fg block">Starter Plan</span>
                      <span className="text-[11px] text-fg-3">Free for individuals</span>
                    </div>
                  </div>
                  <Badge variant="outline">$0</Badge>
                </label>
                <label className="flex items-center justify-between p-2.5 rounded-control border border-line bg-surface cursor-pointer hover:bg-surface-2 transition-colors mt-2">
                  <div className="flex items-center gap-2.5">
                    <Radio value="pro" />
                    <div>
                      <span className="text-xs font-semibold text-fg block">Pro Operating System</span>
                      <span className="text-[11px] text-fg-3">Unlimited tokens & export</span>
                    </div>
                  </div>
                  <Badge variant="accent">$29/mo</Badge>
                </label>
              </RadioGroup>
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center" key={activeVariant}>
            <RadioGroup defaultValue="instant">
              <label className="inline-flex items-center gap-2.5 cursor-pointer">
                <Radio value="instant" />
                <span className="text-sm text-fg">
                  Instant transfer ({tokens.brandCopy.paymentAmount})
                </span>
              </label>
              <label className="inline-flex items-center gap-2.5 cursor-pointer">
                <Radio value="standard" />
                <span className="text-sm text-fg">
                  Standard (1–2 business days)
                </span>
              </label>
            </RadioGroup>
          </div>
        );
      }

      // 14. PROGRESS (Real @base-ui/react Meter Progress bar & ring from systems/lime)
      case 'ui-progress': {
        if (activeVariant === 'Progress ring') {
          return (
            <div className="flex items-center justify-center" key={activeVariant}>
              <Progress
                shape="ring"
                size="lg"
                value={68}
                label="Savings goal"
              >
                68%
              </Progress>
            </div>
          );
        }
        return (
          <div className="w-full max-w-xs mx-auto flex flex-col gap-2" key={activeVariant}>
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-fg">Vacation fund</span>
              <span className="text-xs text-fg-3 tabular-nums">
                $680 of $1,000
              </span>
            </div>
            <Progress
              value={68}
              label="Saved toward Vacation fund"
              valueText="$680 of $1,000"
            />
          </div>
        );
      }

      // 15. BADGE, AMOUNT & BALANCE (Real Badge, Amount & Balance from systems/lime)
      case 'ui-badge': {
        if (activeVariant === 'Balance chip') {
          return (
            <div className="flex items-center justify-center gap-3" key={activeVariant}>
              <Balance value={2481.2} />
              <Balance value={42.5} low />
            </div>
          );
        }
        if (activeVariant === 'Amount pills') {
          return (
            <div className="flex flex-wrap items-center justify-center gap-2" key={activeVariant}>
              <Amount value={250} signed tone="accent" size="lg" />
              <Amount value={-34.5} available={500} size="lg" />
              <Amount value={-640} available={200} size="lg" />
            </div>
          );
        }
        return (
          <div className="flex flex-wrap items-center justify-center gap-2" key={activeVariant}>
            <Badge variant="accent">{tokens.stylePresetName}</Badge>
            <Badge variant="neutral">Verified</Badge>
            <Badge variant="outline">v3.2</Badge>
            <Badge variant="success">Paid</Badge>
            <Badge variant="warn">Tight</Badge>
          </div>
        );
      }

      // 16. TABLE & LIST (Real Table & List from systems/lime)
      case 'ui-table':
      case 'ui-separator': {
        if (
          activeVariant === 'Activity list' ||
          blockType === 'ui-separator'
        ) {
          return (
            <div className="w-full max-w-xs mx-auto" key={activeVariant}>
              <List variant="grouped">
                <ListItem
                  leading={<ListIcon icon={Cafe} tone="accent" />}
                  title="Blue Bottle Coffee"
                  description="Today, 9:41 AM"
                  trailing={formatAmount(-6.5)}
                />
                <ListItem
                  leading={<ListIcon icon={PiggyBank} tone="success" />}
                  title="Round-up transfer"
                  description="Added to Vacation fund"
                  trailing={formatAmount(18.0, { signed: true })}
                />
              </List>
            </div>
          );
        }

        return (
          <div className="w-full max-w-sm mx-auto" key={activeVariant}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merchant</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-end">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Figma Studio</TableCell>
                  <TableCell>
                    <Status status="done" />
                  </TableCell>
                  <TableCell className="text-end">
                    {formatAmount(-45)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Client Deposit</TableCell>
                  <TableCell>
                    <Status status="running" />
                  </TableCell>
                  <TableCell className="text-end">
                    {formatAmount(1200, { signed: true })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        );
      }

      // 17. POPOVER (Real Popover with reactive Account details & Split bill)
      case 'ui-popover': {
        if (activeVariant === 'Account details') {
          return (
            <div className="flex items-center justify-center" key={activeVariant}>
              <Popover>
                <PopoverTrigger
                  render={<Button variant="outline">View Account Details</Button>}
                />
                <PopoverContent>
                  <PopoverTitle>{tokens.brandCopy.workspaceName}</PopoverTitle>
                  <PopoverDescription>
                    Checking Account · Routing 021000021
                  </PopoverDescription>
                  <div className="my-2 p-2 rounded-control bg-surface-2 text-xs font-mono text-fg">
                    IBAN: US82 3042 9910 4829
                  </div>
                  <Button size="sm" variant="primary" className="w-full">
                    Copy Account Number
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center" key={activeVariant}>
            <Popover>
              <PopoverTrigger
                render={<Button variant="outline">Split dinner bill</Button>}
              />
              <PopoverContent>
                <PopoverTitle>Split $84.00</PopoverTitle>
                <PopoverDescription>
                  Divided equally between you, Maya and Leo ($28.00 each).
                </PopoverDescription>
                <Button size="sm" className="w-full">
                  Send request
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        );
      }

      // 18. PAGINATION (Distinct real pagination component)
      case 'ui-pagination': {
        if (activeVariant === 'Compact') {
          return (
            <div className="flex items-center justify-center" key={activeVariant}>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious text="Prev" />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-3 text-xs text-fg-2">Page 2 of 10</span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext text="Next" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          );
        }
        if (activeVariant === 'With Previous & Next') {
          return (
            <div className="flex items-center justify-center" key={activeVariant}>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink isActive>1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink>2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center" key={activeVariant}>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious text="Prev" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink>1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink isActive>2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink>3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink>8</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext text="Next" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        );
      }

      // 19. NAVIGATION MENU (Distinct real navigation menu)
      case 'ui-navigation-menu': {
        if (activeVariant === 'Pills navigation') {
          return (
            <div className="flex items-center justify-center" key={activeVariant}>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink active href="#">Overview</NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink href="#">Analytics</NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink href="#">Settings</NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          );
        }
        if (activeVariant === 'Sub-menu links') {
          return (
            <div className="flex items-center justify-center" key={activeVariant}>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="flex flex-col gap-1">
                        <NavigationMenuLink href="#">
                          <div className="font-semibold text-fg">Documentation</div>
                          <p className="text-[11px] text-fg-3">Design system guidelines & APIs</p>
                        </NavigationMenuLink>
                        <NavigationMenuLink href="#">
                          <div className="font-semibold text-fg">Changelog</div>
                          <p className="text-[11px] text-fg-3">Latest component releases</p>
                        </NavigationMenuLink>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink href="#">Pricing</NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center" key={activeVariant}>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="flex flex-col gap-1">
                      <NavigationMenuLink href="#">
                        <div className="font-semibold text-fg">Brand Operating System</div>
                        <p className="text-[11px] text-fg-3">Dynamic live tokens & specs</p>
                      </NavigationMenuLink>
                      <NavigationMenuLink href="#">
                        <div className="font-semibold text-fg">React Component Suite</div>
                        <p className="text-[11px] text-fg-3">Interactive primitives & blocks</p>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="#">Enterprise</NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        );
      }

      // 20. MENUBAR (Distinct real application menubar)
      case 'ui-menubar': {
        return (
          <div className="flex items-center justify-center" key={activeVariant}>
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    New Window <MenubarShortcut>⌘N</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    Share Project <MenubarShortcut>⇧⌘S</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem destructive>Exit</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>Cut</MenubarItem>
                  <MenubarItem>Copy</MenubarItem>
                  <MenubarItem>Paste</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>View</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>Reload Tokens</MenubarItem>
                  <MenubarItem>Inspector</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        );
      }

      // 21. TOGGLE (Distinct real toggle button & toggle group)
      case 'ui-toggle': {
        if (activeVariant === 'Outline toggle') {
          return (
            <div className="flex items-center justify-center gap-2" key={activeVariant}>
              <Toggle variant="outline" defaultPressed aria-label="Toggle bold">
                Bold
              </Toggle>
              <Toggle variant="outline" aria-label="Toggle italic">
                Italic
              </Toggle>
            </div>
          );
        }
        if (activeVariant === 'Toggle group (Single)') {
          return (
            <div className="flex items-center justify-center" key={activeVariant}>
              <ToggleGroup defaultValue="left" aria-label="Text alignment">
                <ToggleGroupItem value="left" aria-label="Align left">Left</ToggleGroupItem>
                <ToggleGroupItem value="center" aria-label="Align center">Center</ToggleGroupItem>
                <ToggleGroupItem value="right" aria-label="Align right">Right</ToggleGroupItem>
              </ToggleGroup>
            </div>
          );
        }
        if (activeVariant === 'Toggle group (Multiple)') {
          return (
            <div className="flex items-center justify-center" key={activeVariant}>
              <ToggleGroup multiple defaultValue={['bold', 'underline']} aria-label="Formatting">
                <ToggleGroupItem value="bold" aria-label="Toggle bold">B</ToggleGroupItem>
                <ToggleGroupItem value="italic" aria-label="Toggle italic">I</ToggleGroupItem>
                <ToggleGroupItem value="underline" aria-label="Toggle underline">U</ToggleGroupItem>
              </ToggleGroup>
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center gap-2" key={activeVariant}>
            <Toggle variant="raised" defaultPressed aria-label="Toggle favorite">
              Favorite
            </Toggle>
            <Toggle variant="default" aria-label="Toggle bookmark">
              Bookmark
            </Toggle>
          </div>
        );
      }

      // 22. INPUT OTP (Distinct real OTP input)
      case 'ui-input-otp': {
        if (activeVariant === 'Amount keypad') {
          return (
            <div className="w-full max-w-[240px] mx-auto flex flex-col items-center gap-2" key={activeVariant}>
              <div className="text-2xl font-semibold text-fg tabular-nums">
                ${keypadVal || '0'}
              </div>
              <Keypad value={keypadVal} onValueChange={setKeypadVal} />
            </div>
          );
        }
        if (activeVariant === '4-digit pin') {
          return (
            <div className="flex flex-col items-center justify-center gap-3" key={activeVariant}>
              <span className="text-xs text-fg-2">Enter your 4-digit security PIN</span>
              <InputOTP length={4} defaultValue="4829">
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          );
        }
        return (
          <div className="flex flex-col items-center justify-center gap-3" key={activeVariant}>
            <span className="text-xs text-fg-2">Verification code sent via SMS</span>
            <InputOTP length={6} defaultValue="482915">
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        );
      }

      // 23. CALENDAR (Distinct real Calendar month view)
      case 'ui-calendar': {
        if (activeVariant === 'Bill schedule') {
          const bills = [
            {
              name: 'Apartment rent',
              due: new Date(Date.UTC(2026, 9, 18)),
              amount: -1450,
              pay: 'autopay' as const,
            },
            {
              name: 'Electric utility',
              due: new Date(Date.UTC(2026, 9, 24)),
              amount: -68.4,
              pay: 'manual' as const,
            },
          ];
          return (
            <div className="w-full max-w-xs mx-auto" key={activeVariant}>
              <BillSchedule bills={bills} available={2480} />
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center" key={activeVariant}>
            <Calendar defaultValue={new Date()} />
          </div>
        );
      }

      // 24. DROPDOWN MENU (Reactive with destructive)
      case 'ui-dropdown-menu': {
        return (
          <div className="flex items-center justify-center" key={activeVariant}>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button variant="secondary">Account options</Button>}
              />
              <DropdownMenuContent>
                <DropdownMenuItem>Statement PDF</DropdownMenuItem>
                <DropdownMenuItem>Spending limits</DropdownMenuItem>
                {activeVariant === 'With destructive' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem destructive>Freeze card</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      }

      // 25. SKELETON (Reactive with Card skeleton and Activity skeleton)
      case 'ui-skeleton': {
        if (activeVariant === 'Card skeleton') {
          return (
            <div className="w-full max-w-xs mx-auto p-4 rounded-panel border border-line bg-surface flex flex-col gap-3" key={activeVariant}>
              <Skeleton shape="block" className="w-full h-20" />
              <Skeleton shape="text" className="w-3/4" />
              <Skeleton shape="text" className="w-1/2" />
              <div className="flex justify-end gap-2 mt-1">
                <Skeleton shape="text" className="w-16 h-6" />
              </div>
            </div>
          );
        }
        return (
          <div className="w-full max-w-xs mx-auto flex items-center gap-3" key={activeVariant}>
            <Skeleton shape="circle" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton shape="text" className="w-3/4" />
              <Skeleton shape="text" className="w-1/2" />
            </div>
          </div>
        );
      }

      // 26. BREADCRUMB (Distinct real Breadcrumb)
      case 'ui-breadcrumb': {
        if (activeVariant === 'Slash separator') {
          return (
            <div className="flex items-center justify-center" key={activeVariant}>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>/</BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Products</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>/</BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage>{tokens.brandName}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          );
        }
        if (activeVariant === 'With dropdown ellipsis') {
          return (
            <div className="flex items-center justify-center" key={activeVariant}>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Components</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          );
        }
        return (
          <div className="flex items-center justify-center" key={activeVariant}>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Brand Tokens</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        );
      }

      // 27. TOOLTIP (Distinct real Tooltip)
      case 'ui-tooltip': {
        return (
          <div className="flex items-center justify-center gap-4" key={activeVariant}>
            <TooltipProvider>
              <Tooltip defaultOpen>
                <TooltipTrigger
                  render={
                    <Button variant="outline" size="sm">
                      Hover me
                    </Button>
                  }
                />
                <TooltipContent side={activeVariant === 'Bottom with shortcut' ? 'bottom' : 'top'}>
                  {activeVariant === 'Bottom with shortcut' ? (
                    <span className="flex items-center gap-1.5">
                      Copy link <Kbd>⌘C</Kbd>
                    </span>
                  ) : (
                    'Interactive tooltip powered by @base-ui/react'
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      }

      // 28. DIALOG (Real Dialog modal)
      case 'ui-dialog': {
        return (
          <div className="flex items-center justify-center" key={activeVariant}>
            <Dialog>
              <DialogTrigger
                render={
                  <Button variant={activeVariant === 'Destructive confirm' ? 'destructive' : 'primary'}>
                    {activeVariant === 'Destructive confirm' ? 'Delete account' : 'Open Dialog'}
                  </Button>
                }
              />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {activeVariant === 'Destructive confirm'
                      ? 'Are you absolutely sure?'
                      : 'Edit profile'}
                  </DialogTitle>
                  <DialogDescription>
                    {activeVariant === 'Destructive confirm'
                      ? 'This action cannot be undone. This will permanently delete your account.'
                      : 'Make changes to your profile here. Click save when you are done.'}
                  </DialogDescription>
                </DialogHeader>
                {activeVariant !== 'Destructive confirm' && (
                  <div className="grid gap-3 py-2">
                    <Field>
                      <FieldLabel>Name</FieldLabel>
                      <Input defaultValue={tokens.brandName} />
                    </Field>
                    <Field>
                      <FieldLabel>Domain</FieldLabel>
                      <Input defaultValue={tokens.brandCopy.domainUrl} />
                    </Field>
                  </div>
                )}
                <DialogFooter>
                  <DialogClose render={<Button variant="ghost">Cancel</Button>} />
                  <DialogClose
                    render={
                      <Button variant={activeVariant === 'Destructive confirm' ? 'destructive' : 'primary'}>
                        {activeVariant === 'Destructive confirm' ? 'Confirm delete' : 'Save changes'}
                      </Button>
                    }
                  />
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );
      }

      // 29. SHEET (Real Sheet / Drawer)
      case 'ui-sheet': {
        const side = activeVariant === 'Bottom sheet' ? 'bottom' : 'right';
        return (
          <div className="flex items-center justify-center" key={activeVariant}>
            <Sheet side={side}>
              <SheetTrigger
                render={
                  <Button variant="outline">
                    Open {activeVariant === 'Bottom sheet' ? 'Bottom Sheet' : 'Drawer'}
                  </Button>
                }
              />
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>Project Workspace</SheetTitle>
                  <SheetDescription>
                    Configure theme parameters and token settings in real time.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4 flex flex-col gap-3">
                  <Field>
                    <FieldLabel>Workspace Name</FieldLabel>
                    <Input defaultValue={tokens.brandCopy.workspaceName} />
                  </Field>
                  <Field>
                    <FieldLabel>Style Preset</FieldLabel>
                    <Input defaultValue={tokens.stylePresetName} readOnly />
                  </Field>
                </div>
                <SheetFooter>
                  <SheetClose render={<Button variant="primary" className="w-full">Done</Button>} />
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        );
      }

      // 30. INPUT (Real Input with sizes & error state)
      case 'ui-input': {
        if (activeVariant === 'Sizes (sm / md / lg)') {
          return (
            <div className="w-full max-w-xs mx-auto flex flex-col gap-2.5" key={activeVariant}>
              <Input size="sm" placeholder="Small input (sm)" />
              <Input size="md" placeholder="Medium input (md)" />
              <Input size="lg" placeholder="Large input (lg)" />
            </div>
          );
        }
        if (activeVariant === 'Error state') {
          return (
            <div className="w-full max-w-xs mx-auto" key={activeVariant}>
              <Field>
                <FieldLabel>Email address</FieldLabel>
                <Input
                  aria-invalid="true"
                  defaultValue="invalid-email-format"
                  placeholder="you@company.com"
                />
                <FieldDescription className="text-danger-text">
                  Please enter a valid email address.
                </FieldDescription>
              </Field>
            </div>
          );
        }
        return (
          <div className="w-full max-w-xs mx-auto" key={activeVariant}>
            <Field>
              <FieldLabel>Project title</FieldLabel>
              <Input placeholder="Enter project name..." defaultValue={tokens.brandCopy.workspaceName} />
              <FieldDescription>This will appear in your brand guidelines.</FieldDescription>
            </Field>
          </div>
        );
      }

      // 31. TEXTAREA (Real Textarea with auto-grow & error state)
      case 'ui-textarea': {
        if (activeVariant === 'Error state') {
          return (
            <div className="w-full max-w-xs mx-auto" key={activeVariant}>
              <Field>
                <FieldLabel>Brand Manifesto</FieldLabel>
                <Textarea
                  aria-invalid="true"
                  defaultValue="Too short."
                />
                <FieldDescription className="text-danger-text">
                  Manifesto must be at least 20 characters.
                </FieldDescription>
              </Field>
            </div>
          );
        }
        return (
          <div className="w-full max-w-xs mx-auto" key={activeVariant}>
            <Field>
              <FieldLabel>Payment Note</FieldLabel>
              <Textarea
                autoGrow={activeVariant === 'Auto-grow'}
                placeholder="Add an optional note to this transfer..."
                defaultValue={tokens.brandCopy.manifestoHeadline}
              />
              {activeVariant === 'With description' && (
                <FieldDescription>Notes are encrypted and visible only to the recipient.</FieldDescription>
              )}
            </Field>
          </div>
        );
      }

      // 32. EMPTY (Real Empty state)
      case 'ui-empty': {
        return (
          <div className="w-full max-w-xs mx-auto" key={activeVariant}>
            <Empty>
              <EmptyIcon>
                <Icon icon={ShoppingBag} size={24} />
              </EmptyIcon>
              <EmptyTitle>No transactions yet</EmptyTitle>
              <EmptyDescription>
                Your recent card activity and transfers will show up here.
              </EmptyDescription>
              {activeVariant !== 'Compact' && (
                <EmptyActions>
                  <Button size="sm" variant="primary">Make first deposit</Button>
                  {activeVariant === 'With actions' && (
                    <Button size="sm" variant="outline">Learn more</Button>
                  )}
                </EmptyActions>
              )}
            </Empty>
          </div>
        );
      }

      // 33. DROPZONE (Real file upload dropzone)
      case 'ui-dropzone': {
        return (
          <div className="w-full max-w-xs mx-auto" key={activeVariant}>
            <Dropzone
              title={activeVariant === 'Receipt dropzone' ? 'Drop receipt image here' : 'Drop files here'}
              hint={activeVariant === 'Receipt dropzone' ? 'PNG, JPG or PDF up to 10MB' : 'Drag & drop or browse from computer'}
              onFiles={() => {}}
            />
          </div>
        );
      }

      // 34. COMMAND (Real Command palette ⌘K)
      case 'ui-command': {
        if (activeVariant === 'Assistant block') {
          return (
            <div className="w-full max-w-xs mx-auto" key={activeVariant}>
              <PayingABill
                billerName="Utility bill"
                amount={68.4}
                available={2480}
              />
            </div>
          );
        }
        return (
          <div className="w-full max-w-sm mx-auto" key={activeVariant}>
            <Command>
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem>
                    <Icon icon={Wallet} size={16} />
                    <span>Checking Account</span>
                    <CommandShortcut><Kbd>⌘B</Kbd></CommandShortcut>
                  </CommandItem>
                  <CommandItem>
                    <Icon icon={Send} size={16} />
                    <span>Send Money</span>
                    <CommandShortcut><Kbd>⌘S</Kbd></CommandShortcut>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                  <CommandItem>
                    <Icon icon={Edit} size={16} />
                    <span>Edit Brand Guidelines</span>
                    <CommandShortcut><Kbd>⌘E</Kbd></CommandShortcut>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        );
      }

      // 35. CARD (Real Card variants: Surface, Outline, Raised, Glow, Home block)
      case 'ui-card':
      default: {
        if (activeVariant === 'Home block') {
          return (
            <div className="flex justify-center" key={activeVariant}>
              <HomeScreen />
            </div>
          );
        }
        const cardVar =
          activeVariant === 'Raised card'
            ? 'raised'
            : activeVariant === 'Glow card'
            ? 'glow'
            : activeVariant === 'Outline card'
            ? 'outline'
            : 'surface';

        return (
          <div className="w-full max-w-xs mx-auto" key={activeVariant}>
            <Card variant={cardVar}>
              <CardHeader>
                <CardTitle>{tokens.brandName} Card</CardTitle>
                <CardDescription>{tokens.tagline}</CardDescription>
              </CardHeader>
              <CardFooter className="justify-between">
                <Amount value={1200.35} size="lg" />
                <Button
                  size="sm"
                  variant={cardVar === 'glow' ? 'solid' : 'primary'}
                >
                  Transfer
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
      }
    }
  };

  return (
    <div
      data-koyot-block={block.id}
      className="rounded-[24px] min-h-[260px] h-full flex flex-col justify-between relative group/comp transition-all duration-200"
      style={{
        backgroundColor: cardBg,
        color: cardFg,
        padding: `${Math.max(20, Math.round(26 * tokens.spacingMultiplier))}px`,
      }}
    >
      {/* Dynamic Scoped CSS for [data-slot] Inspection & Overrides */}
      {scopedSlotCss && <style>{scopedSlotCss}</style>}

      {/* TOP BAR: Component Name (top-left) + Copy / Export CLI button (top-right) */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-normal"
          style={{ color: isDarkTheme ? '#A1A1AA' : '#52525B' }}
        >
          {block.title}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenExportModal?.(primitiveRegistrySlug);
          }}
          className={`w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover/comp:opacity-100 transition ${
            isDarkTheme
              ? 'hover:bg-white/10 text-zinc-400 hover:text-white'
              : 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900'
          }`}
          title={`Export / Install ${block.title}`}
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* CENTER STAGE: Real @base-ui/react + systems/koyot Scope */}
      <div
        onMouseOver={handleStageMouseOver}
        onMouseLeave={handleStageMouseLeave}
        onClickCapture={handleStageClickCapture}
        className={`koyot lime my-auto py-5 bg-transparent! ${
          isInspectMode ? 'cursor-pointer' : ''
        }`}
        data-theme={isDarkTheme ? 'dark' : undefined}
        style={limeScopeVars}
      >
        <KoyotPortalProvider>{renderLimeComponentStage()}</KoyotPortalProvider>
      </div>

      {/* BOTTOM BAR: Variant Switcher Pill (bottom-left) + Play & Inspect Buttons (bottom-right) */}
      <div className="flex items-center justify-between pt-1">
        {variants.length > 1 ? (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative inline-flex items-center rounded-full px-3 py-1 text-[11px] transition opacity-0 group-hover/comp:opacity-100 focus-within:opacity-100 ${
              isDarkTheme
                ? 'bg-[#232326] text-zinc-200 hover:bg-[#2C2C30]'
                : 'bg-[#F3F3F1] text-zinc-700 hover:bg-zinc-200/70'
            }`}
          >
            <select
              value={activeVariant}
              onChange={(e) => onChangeVariant?.(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer appearance-none pr-3.5 font-medium"
            >
              {variants.map((v) => (
                <option key={v} value={v} className="bg-zinc-900 text-white">
                  {v}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 opacity-60 absolute right-2 pointer-events-none" />
          </div>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-1.5 opacity-0 group-hover/comp:opacity-100 transition">
          <button
            type="button"
            onClick={handlePlayInteraction}
            title="Test interaction"
            className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
              isDarkTheme
                ? 'bg-[#232326] text-zinc-200 hover:bg-[#2E2E32]'
                : 'bg-[#F3F3F1] text-zinc-700 hover:bg-zinc-200/80'
            }`}
          >
            <Play className="w-3 h-3 fill-current" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectSubElement?.(
                undefined,
                block.title,
                block.title,
                activeVariant
              );
            }}
            title={`Inspect ${block.title} properties`}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
              isBlockSelected
                ? 'bg-[#D946EF] text-white'
                : isDarkTheme
                ? 'bg-[#232326] text-zinc-200 hover:bg-[#2E2E32]'
                : 'bg-[#F3F3F1] text-zinc-700 hover:bg-zinc-200/80'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
