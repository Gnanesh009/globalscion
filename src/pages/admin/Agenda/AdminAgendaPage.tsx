import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import { getErrorMessage } from '@/api/apiClient';
import { useToast } from '@/app/ToastProvider';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AgendaBuilder } from '@/components/admin/AgendaBuilder';
import { ConferenceSelector } from '@/components/admin/ConferenceSelector';
import { Seo } from '@/components/common/Seo';
import { EmptyState, LoadingScreen } from '@/components/common/States';
import { useConferenceById, useConferenceMutations, useConferences } from '@/hooks/useConferences';
import type { AgendaDay } from '@/types';

export default function AdminAgendaPage() {
  const toast = useToast();
  const [conferenceId, setConferenceId] = useState('');
  const [days, setDays] = useState<AgendaDay[]>([]);
  const [dirty, setDirty] = useState(false);

  const { data: list } = useConferences({ publish_status: 'all', page_size: 200 });
  const { data: conference, isPending } = useConferenceById(conferenceId || undefined);
  const { saveAgenda } = useConferenceMutations();

  // Default to the first conference so the page is never an empty shell.
  useEffect(() => {
    if (!conferenceId && list?.results.length) setConferenceId(list.results[0].id);
  }, [list, conferenceId]);

  useEffect(() => {
    if (conference) {
      setDays(conference.agenda);
      setDirty(false);
    }
  }, [conference]);

  const save = async () => {
    if (!conferenceId) return;
    try {
      await saveAgenda.mutateAsync({ id: conferenceId, agenda: days });
      setDirty(false);
      toast.success('Agenda saved.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <Seo title="Agenda" noIndex />

      <AdminPageHeader
        title="Agenda"
        description="Build the day-by-day programme for any conference. This is the same builder as step 6 of the conference builder, available standalone for quick edits."
        breadcrumb={[{ label: 'Agenda' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            disabled={!dirty || saveAgenda.isPending}
            onClick={() => void save()}
          >
            {saveAgenda.isPending ? 'Saving…' : 'Save agenda'}
          </Button>
        }
      />

      <Card sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
          <ConferenceSelector value={conferenceId} onChange={setConferenceId} />
          {dirty && (
            <Alert severity="warning" sx={{ py: 0, borderRadius: 1.5 }}>
              You have unsaved changes.
            </Alert>
          )}
        </Stack>

        {!conferenceId ? (
          <EmptyState title="Select a conference" description="Choose a conference to edit its agenda." compact />
        ) : isPending ? (
          <LoadingScreen label="Loading agenda" />
        ) : (
          <Box>
            <AgendaBuilder
              days={days}
              speakers={conference?.speakers ?? []}
              startDate={conference?.start_date}
              onChange={(next) => {
                setDays(next);
                setDirty(true);
              }}
            />
          </Box>
        )}
      </Card>
    </>
  );
}
