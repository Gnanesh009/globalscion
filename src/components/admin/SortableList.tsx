import type { ReactNode } from 'react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface SortableRowProps {
  id: string;
  children: ReactNode;
  disabled?: boolean;
}

function SortableRow({ id, children, disabled }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  });

  return (
    <Stack
      ref={setNodeRef}
      direction="row"
      alignItems="stretch"
      sx={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.55 : 1,
        zIndex: isDragging ? 1 : 0,
        position: 'relative',
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: isDragging ? 'primary.main' : 'divider',
        backgroundColor: 'background.paper',
        boxShadow: isDragging ? '0 12px 28px rgba(11,31,58,0.14)' : 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 0.5,
          borderRight: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'grey.50',
          borderTopLeftRadius: 6,
          borderBottomLeftRadius: 6,
        }}
      >
        <IconButton
          size="small"
          disabled={disabled}
          aria-label="Reorder item — press space, then use the arrow keys"
          sx={{ cursor: disabled ? 'not-allowed' : 'grab', touchAction: 'none' }}
          {...attributes}
          {...listeners}
        >
          <DragIndicatorIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
        </IconButton>
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
    </Stack>
  );
}

interface SortableListProps<T> {
  items: T[];
  getId: (item: T) => string;
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
  disabled?: boolean;
  spacing?: number;
}

/**
 * Keyboard-accessible drag-and-drop list used for topics, agenda sessions,
 * gallery images and the conference page section order.
 */
export function SortableList<T>({
  items,
  getId,
  onReorder,
  renderItem,
  disabled,
  spacing = 1,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((item) => getId(item) === active.id);
    const newIndex = items.findIndex((item) => getId(item) === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={items.map(getId)} strategy={verticalListSortingStrategy}>
        <Stack spacing={spacing}>
          {items.map((item, index) => (
            <SortableRow key={getId(item)} id={getId(item)} disabled={disabled}>
              {renderItem(item, index)}
            </SortableRow>
          ))}
        </Stack>
      </SortableContext>
    </DndContext>
  );
}
