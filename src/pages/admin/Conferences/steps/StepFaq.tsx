import { useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { SortableList } from '@/components/admin/SortableList';
import { EmptyState } from '@/components/common/States';
import type { ConferenceFormValues } from '../builderSchema';

const STARTER_FAQS = [
  ['How do I register for the conference?', ''],
  ['Will I receive a certificate of participation?', ''],
  ['Can I attend remotely if I cannot travel?', ''],
];

export function StepFaq() {
  const { watch, setValue } = useFormContext<ConferenceFormValues>();
  const faqs = watch('faqs');

  const update = (next: typeof faqs) =>
    setValue(
      'faqs',
      next.map((faq, index) => ({ ...faq, display_order: index + 1 })),
      { shouldDirty: true },
    );

  const addFaq = (question = '', answer = '') =>
    update([...faqs, { id: `faq-${Date.now()}-${faqs.length}`, question, answer, display_order: faqs.length + 1 }]);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Answers appear in an accordion. Keep them short and specific.
        </Typography>
        <Button startIcon={<AddIcon />} variant="outlined" onClick={() => addFaq()}>
          Add question
        </Button>
      </Stack>

      {faqs.length === 0 ? (
        <EmptyState
          title="No questions yet"
          description="Start from the three questions delegates ask most often."
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() =>
                update(
                  STARTER_FAQS.map(([question, answer], index) => ({
                    id: `faq-${Date.now()}-${index}`,
                    question,
                    answer,
                    display_order: index + 1,
                  })),
                )
              }
            >
              Use the common questions
            </Button>
          }
          compact
        />
      ) : (
        <SortableList
          items={faqs}
          getId={(faq) => faq.id}
          onReorder={update}
          renderItem={(faq, index) => (
            <Stack spacing={1.25} sx={{ p: 1.75 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField
                  fullWidth
                  size="small"
                  label={`Question ${index + 1}`}
                  value={faq.question}
                  onChange={(event) => {
                    const next = [...faqs];
                    next[index] = { ...faq, question: event.target.value };
                    update(next);
                  }}
                />
                <IconButton
                  aria-label={`Delete question ${index + 1}`}
                  onClick={() => update(faqs.filter((item) => item.id !== faq.id))}
                >
                  <DeleteOutlineIcon fontSize="small" color="error" />
                </IconButton>
              </Stack>
              <TextField
                fullWidth
                size="small"
                label="Answer"
                multiline
                minRows={2}
                value={faq.answer}
                onChange={(event) => {
                  const next = [...faqs];
                  next[index] = { ...faq, answer: event.target.value };
                  update(next);
                }}
              />
            </Stack>
          )}
        />
      )}
    </Box>
  );
}
