import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { getErrorMessage } from '@/api/apiClient';
import { useToast } from '@/app/ToastProvider';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { MediaPickerField } from '@/components/admin/MediaPickerField';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { Seo } from '@/components/common/Seo';
import { StatusChip } from '@/components/common/StatusChip';
import { ErrorState, LoadingScreen } from '@/components/common/States';
import { usePageMutations, usePages } from '@/hooks/useResources';
import type { SitePage } from '@/types';
import { formatDateTime } from '@/utils/format';
import { publishMeta } from '@/utils/statusMeta';

const PUBLIC_PATH: Record<SitePage['slug'], string> = {
  about: '/about',
  contact: '/contact',
  'terms-and-conditions': '/terms-and-conditions',
  'privacy-policy': '/privacy-policy',
};

export default function AdminPagesPage() {
  const toast = useToast();
  const { data: pages, isPending, isError, error, refetch } = usePages();
  const { update } = usePageMutations();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [draft, setDraft] = useState<SitePage | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!pages?.length) return;
    const next = pages.find((page) => page.id === selectedId) ?? pages[0];
    setSelectedId(next.id);
    setDraft(next);
    setDirty(false);
  }, [pages, selectedId]);

  const patch = (changes: Partial<SitePage>) => {
    setDraft((current) => (current ? { ...current, ...changes } : current));
    setDirty(true);
  };

  const save = async () => {
    if (!draft) return;
    try {
      await update.mutateAsync({
        id: draft.id,
        payload: {
          title: draft.title,
          hero_subtitle: draft.hero_subtitle,
          content: draft.content,
          seo: draft.seo,
        },
      });
      setDirty(false);
      toast.success('Page saved.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (isPending) return <LoadingScreen label="Loading pages" />;
  if (isError) {
    return (
      <>
        <AdminPageHeader title="Pages" breadcrumb={[{ label: 'Pages' }]} />
        <ErrorState error={error} onRetry={() => void refetch()} />
      </>
    );
  }

  return (
    <>
      <Seo title="Pages" noIndex />

      <AdminPageHeader
        title="Pages"
        description="Content for the standing public pages. Each page has its own body content and SEO metadata."
        breadcrumb={[{ label: 'Pages' }]}
        actions={
          <>
            {draft && (
              <Button
                variant="outlined"
                component="a"
                href={PUBLIC_PATH[draft.slug]}
                target="_blank"
                rel="noopener"
                startIcon={<OpenInNewIcon />}
              >
                View page
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              disabled={!dirty || update.isPending}
              onClick={() => void save()}
            >
              {update.isPending ? 'Saving…' : 'Save page'}
            </Button>
          </>
        }
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 3 }}>
          <Card sx={{ position: { lg: 'sticky' }, top: { lg: 80 } }}>
            <List disablePadding>
              {pages?.map((page) => (
                <ListItemButton
                  key={page.id}
                  selected={page.id === selectedId}
                  onClick={() => {
                    if (dirty && !window.confirm('Discard unsaved changes to this page?')) return;
                    setSelectedId(page.id);
                    setDraft(page);
                    setDirty(false);
                  }}
                  sx={{ py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}
                >
                  <ListItemText
                    primary={page.title}
                    secondary={PUBLIC_PATH[page.slug]}
                    primaryTypographyProps={{ fontWeight: 700, fontSize: '0.875rem' }}
                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                  />
                  <StatusChip meta={publishMeta(page.status)} />
                </ListItemButton>
              ))}
            </List>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 9 }}>
          {draft && (
            <Card>
              <Tabs
                value={tab}
                onChange={(_, value: number) => setTab(value)}
                sx={{ px: 2, borderBottom: '1px solid', borderColor: 'divider' }}
              >
                <Tab label="Content" />
                <Tab label="SEO" />
              </Tabs>

              <Box sx={{ p: { xs: 2, md: 3 } }}>
                {tab === 0 ? (
                  <Stack spacing={2.5}>
                    <TextField
                      fullWidth
                      label="Page title"
                      value={draft.title}
                      onChange={(event) => patch({ title: event.target.value })}
                    />
                    <TextField
                      fullWidth
                      label="Hero subtitle"
                      value={draft.hero_subtitle}
                      onChange={(event) => patch({ hero_subtitle: event.target.value })}
                      multiline
                      minRows={2}
                    />
                    <RichTextEditor
                      label="Page content"
                      value={draft.content}
                      onChange={(html) => patch({ content: html })}
                      minHeight={420}
                    />
                    <Typography variant="caption" color="text.disabled">
                      Last updated {formatDateTime(draft.updated_at)}
                    </Typography>
                  </Stack>
                ) : (
                  <Grid container spacing={2.5}>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="Meta title"
                        value={draft.seo.meta_title}
                        onChange={(event) => patch({ seo: { ...draft.seo, meta_title: event.target.value } })}
                        helperText={`${draft.seo.meta_title.length} / 60 characters`}
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label="Meta description"
                        value={draft.seo.meta_description}
                        onChange={(event) =>
                          patch({ seo: { ...draft.seo, meta_description: event.target.value } })
                        }
                        multiline
                        minRows={3}
                        helperText={`${draft.seo.meta_description.length} / 160 characters`}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <MediaPickerField
                        label="Open Graph image"
                        value={draft.seo.og_image}
                        onChange={(url) => patch({ seo: { ...draft.seo, og_image: url } })}
                      />
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Card>
          )}
        </Grid>
      </Grid>
    </>
  );
}
