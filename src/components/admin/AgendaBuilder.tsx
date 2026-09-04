import { useState } from 'react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { EmptyState } from '@/components/common/States';
import { SESSION_TYPE_OPTIONS } from '@/constants';
import type { AgendaDay, AgendaSession, Speaker } from '@/types';
import { SortableList } from './SortableList';

interface AgendaBuilderProps {
  days: AgendaDay[];
  speakers: Speaker[];
  onChange: (days: AgendaDay[]) => void;
  /** Used when adding the first day. */
  startDate?: string;
}

const newSession = (order: number): AgendaSession => ({
  id: `session-${Date.now()}-${order}`,
  time_start: '09:00',
  time_end: '10:00',
  title: '',
  description: '',
  session_type: 'talk',
  speaker_ids: [],
  display_order: order,
});

/**
 * Day-by-day agenda editor shared by the conference builder and the standalone
 * agenda module. Sessions reorder by drag or keyboard.
 */
export function AgendaBuilder({ days, speakers, onChange, startDate }: AgendaBuilderProps) {
  const [activeDay, setActiveDay] = useState(0);
  const dayIndex = Math.min(activeDay, Math.max(days.length - 1, 0));
  const day = days[dayIndex];

  const addDay = () => {
    const base = startDate ? dayjs(startDate) : dayjs();
    const date = base.add(days.length, 'day');
    onChange([
      ...days,
      {
        id: `day-${Date.now()}`,
        day_number: days.length + 1,
        date: date.format('YYYY-MM-DD'),
        title: `Day ${days.length + 1} — ${date.format('dddd, DD MMMM YYYY')}`,
        sessions: [],
      },
    ]);
    setActiveDay(days.length);
  };

  const updateDay = (patch: Partial<AgendaDay>) => {
    const next = [...days];
    next[dayIndex] = { ...next[dayIndex], ...patch };
    onChange(next);
  };

  const updateSessions = (sessions: AgendaSession[]) =>
    updateDay({ sessions: sessions.map((session, index) => ({ ...session, display_order: index + 1 })) });

  const removeDay = () => {
    const next = days
      .filter((_, index) => index !== dayIndex)
      .map((item, index) => ({ ...item, day_number: index + 1 }));
    onChange(next);
    setActiveDay(0);
  };

  if (days.length === 0) {
    return (
      <EmptyState
        title="No programme days yet"
        description="Add a day, then build up its sessions. Days follow the conference start date by default."
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={addDay}>
            Add day one
          </Button>
        }
        compact
      />
    );
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ borderBottom: '1px solid', borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={dayIndex}
          onChange={(_, value: number) => setActiveDay(value)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Programme days"
          sx={{ flex: 1 }}
        >
          {days.map((item) => (
            <Tab key={item.id} label={`Day ${item.day_number}`} />
          ))}
        </Tabs>
        <Button size="small" startIcon={<AddIcon />} onClick={addDay}>
          Add day
        </Button>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="Date"
            value={day.date}
            onChange={(event) => updateDay({ date: event.target.value })}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Day heading"
            value={day.title}
            onChange={(event) => updateDay({ title: event.target.value })}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 2 }} sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Delete this day">
            <span>
              <Button color="error" size="small" startIcon={<DeleteOutlineIcon />} onClick={removeDay}>
                Delete day
              </Button>
            </span>
          </Tooltip>
        </Grid>
      </Grid>

      {day.sessions.length === 0 ? (
        <EmptyState
          title="No sessions on this day"
          description="Add keynotes, talks, panels, workshops and breaks."
          action={
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => updateSessions([newSession(1)])}>
              Add a session
            </Button>
          }
          compact
        />
      ) : (
        <>
          <SortableList
            items={day.sessions}
            getId={(session) => session.id}
            onReorder={updateSessions}
            renderItem={(session, index) => (
              <Grid container spacing={1.5} sx={{ p: 1.5 }}>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    type="time"
                    label="From"
                    value={session.time_start}
                    onChange={(event) => {
                      const next = [...day.sessions];
                      next[index] = { ...session, time_start: event.target.value };
                      updateSessions(next);
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 6, sm: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    type="time"
                    label="To"
                    value={session.time_end}
                    onChange={(event) => {
                      const next = [...day.sessions];
                      next[index] = { ...session, time_end: event.target.value };
                      updateSessions(next);
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Session title"
                    value={session.title}
                    onChange={(event) => {
                      const next = [...day.sessions];
                      next[index] = { ...session, title: event.target.value };
                      updateSessions(next);
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 10, sm: 2.5 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Type"
                    value={session.session_type}
                    onChange={(event) => {
                      const next = [...day.sessions];
                      next[index] = {
                        ...session,
                        session_type: event.target.value as AgendaSession['session_type'],
                      };
                      updateSessions(next);
                    }}
                  >
                    {SESSION_TYPE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid size={{ xs: 2, sm: 0.5 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    aria-label={`Delete session ${index + 1}`}
                    onClick={() => updateSessions(day.sessions.filter((item) => item.id !== session.id))}
                  >
                    <DeleteOutlineIcon fontSize="small" color="error" />
                  </IconButton>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Description"
                    value={session.description}
                    onChange={(event) => {
                      const next = [...day.sessions];
                      next[index] = { ...session, description: event.target.value };
                      updateSessions(next);
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Speakers"
                    value={session.speaker_ids}
                    SelectProps={{
                      multiple: true,
                      renderValue: (value) =>
                        (value as string[])
                          .map((id) => speakers.find((speaker) => speaker.id === id)?.name ?? id)
                          .join(', ') || 'None',
                    }}
                    onChange={(event) => {
                      const value = event.target.value as unknown as string[];
                      const next = [...day.sessions];
                      next[index] = { ...session, speaker_ids: value };
                      updateSessions(next);
                    }}
                  >
                    {speakers.length === 0 && (
                      <MenuItem disabled value="">
                        Select speakers in step 5 first
                      </MenuItem>
                    )}
                    {speakers.map((speaker) => (
                      <MenuItem key={speaker.id} value={speaker.id}>
                        {speaker.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            )}
          />

          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => updateSessions([...day.sessions, newSession(day.sessions.length + 1)])}
          >
            Add session
          </Button>
          <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 1.5 }}>
            Drag the handle, or focus it and press space then the arrow keys, to reorder sessions.
          </Typography>
        </>
      )}
    </Box>
  );
}
