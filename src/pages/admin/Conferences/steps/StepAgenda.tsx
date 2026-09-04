import { useFormContext } from 'react-hook-form';
import { AgendaBuilder } from '@/components/admin/AgendaBuilder';
import { useSpeakers } from '@/hooks/useResources';
import type { ConferenceFormValues } from '../builderSchema';

export function StepAgenda() {
  const { watch, setValue } = useFormContext<ConferenceFormValues>();
  const { data } = useSpeakers({ page_size: 100, status: 'published' });

  const selectedIds = watch('speaker_ids');
  const selectedSpeakers = (data?.results ?? []).filter((speaker) => selectedIds.includes(speaker.id));

  return (
    <AgendaBuilder
      days={watch('agenda')}
      speakers={selectedSpeakers}
      startDate={watch('start_date')}
      onChange={(days) => setValue('agenda', days, { shouldDirty: true })}
    />
  );
}
