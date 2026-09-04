import dayjs from 'dayjs';
import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface RHFDatePickerProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  minDate?: string;
  disabled?: boolean;
  helperText?: string;
}

/** Stores values as ISO `YYYY-MM-DD` strings so payloads match Django's DateField. */
export function RHFDatePicker<T extends FieldValues>({
  name,
  label,
  minDate,
  disabled,
  helperText,
}: RHFDatePickerProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <DatePicker
          label={label}
          disabled={disabled}
          value={field.value ? dayjs(field.value as string) : null}
          minDate={minDate ? dayjs(minDate) : undefined}
          onChange={(value) => field.onChange(value ? value.format('YYYY-MM-DD') : '')}
          format="DD MMM YYYY"
          slotProps={{
            textField: {
              fullWidth: true,
              onBlur: field.onBlur,
              error: Boolean(fieldState.error),
              helperText: fieldState.error?.message ?? helperText,
            },
          }}
        />
      )}
    />
  );
}
