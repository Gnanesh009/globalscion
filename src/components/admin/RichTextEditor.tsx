import { useCallback, useEffect } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  minHeight?: number;
}

interface ToolButtonProps {
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolButton({ title, active, disabled, onClick, children }: ToolButtonProps) {
  return (
    <Tooltip title={title}>
      <span>
        <ToggleButton
          value={title}
          selected={Boolean(active)}
          disabled={disabled}
          onClick={onClick}
          size="small"
          aria-label={title}
          sx={{
            border: 'none',
            borderRadius: 1,
            p: 0.75,
            '& svg': { fontSize: 18 },
            '&.Mui-selected': { backgroundColor: 'rgba(37,99,235,0.12)', color: 'primary.main' },
          }}
        >
          {children}
        </ToggleButton>
      </span>
    </Tooltip>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = useCallback(() => {
    const previous = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Link URL', previous ?? 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('Image URL (from the media library)');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const headingLevels = [2, 3, 4] as const;

  return (
    <Stack
      direction="row"
      spacing={0.25}
      flexWrap="wrap"
      useFlexGap
      sx={{
        p: 0.75,
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'grey.50',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
      }}
      role="toolbar"
      aria-label="Text formatting"
    >
      <ToolButton title="Paragraph" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()}>
        <Typography sx={{ fontSize: 12, fontWeight: 700, px: 0.25 }}>P</Typography>
      </ToolButton>
      {headingLevels.map((level) => (
        <ToolButton
          key={level}
          title={`Heading ${level}`}
          active={editor.isActive('heading', { level })}
          onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 700, px: 0.25 }}>H{level}</Typography>
        </ToolButton>
      ))}

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.75 }} />

      <ToolButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <FormatBoldIcon />
      </ToolButton>
      <ToolButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <FormatItalicIcon />
      </ToolButton>
      <ToolButton title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <FormatUnderlinedIcon />
      </ToolButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.75 }} />

      <ToolButton title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <FormatListBulletedIcon />
      </ToolButton>
      <ToolButton title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <FormatListNumberedIcon />
      </ToolButton>
      <ToolButton title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <FormatQuoteIcon />
      </ToolButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.75 }} />

      <ToolButton title="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <FormatAlignLeftIcon />
      </ToolButton>
      <ToolButton title="Align centre" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <FormatAlignCenterIcon />
      </ToolButton>
      <ToolButton title="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <FormatAlignRightIcon />
      </ToolButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.75 }} />

      <ToolButton title="Insert link" active={editor.isActive('link')} onClick={setLink}>
        <LinkIcon />
      </ToolButton>
      <ToolButton title="Remove link" disabled={!editor.isActive('link')} onClick={() => editor.chain().focus().unsetLink().run()}>
        <LinkOffIcon />
      </ToolButton>
      <ToolButton title="Insert image" onClick={addImage}>
        <ImageOutlinedIcon />
      </ToolButton>
      <ToolButton
        title="Insert table"
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      >
        <TableChartOutlinedIcon />
      </ToolButton>
      <ToolButton title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <HorizontalRuleIcon />
      </ToolButton>

      <Box sx={{ flex: 1 }} />

      <ToolButton title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
        <UndoIcon />
      </ToolButton>
      <ToolButton title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
        <RedoIcon />
      </ToolButton>
    </Stack>
  );
}

/**
 * Reusable rich text editor for conference descriptions, page content and any
 * other long-form CMS field. Emits HTML, which is what the Django API stores.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing…',
  label,
  helperText,
  error,
  minHeight = 300,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, HTMLAttributes: { rel: 'noopener' } }),
      Image.configure({ inline: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
  });

  // Keep the editor in sync when the form resets or loads server content.
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) editor.commands.setContent(value || '', false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, editor]);

  if (!editor) return null;

  const words = editor.state.doc.textContent.trim().split(/\s+/).filter(Boolean).length;

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" component="label" sx={{ display: 'block', mb: 1 }}>
          {label}
        </Typography>
      )}
      <Box
        sx={{
          border: '1px solid',
          borderColor: error ? 'error.main' : 'divider',
          borderRadius: 1.5,
          overflow: 'hidden',
          backgroundColor: 'background.paper',
          '&:focus-within': { borderColor: error ? 'error.main' : 'primary.main' },
          '& .ProseMirror': { minHeight },
        }}
      >
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />
        <Stack
          direction="row"
          justifyContent="flex-end"
          sx={{ px: 2, py: 1, borderTop: '1px solid', borderColor: 'divider', backgroundColor: 'grey.50' }}
        >
          <Typography variant="caption" color="text.disabled">
            {words} {words === 1 ? 'word' : 'words'}
          </Typography>
        </Stack>
      </Box>
      {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
    </Box>
  );
}
