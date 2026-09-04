import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';
import TextField, { type TextFieldProps } from '@mui/material/TextField';

type RHFTextFieldProps<T extends FieldValues> = Omit<TextFieldProps, 'name' | 'error'> & {
  name: Path<T>;
  /** Shows a live character counter against the supplied limit. */
  counterMax?: number;
};

export function RHFTextField<T extends FieldValues>({
  name,
  counterMax,
  helperText,
  ...rest
}: RHFTextFieldProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const length = String(field.value ?? '').length;
        return (
          <TextField
            {...field}
            value={field.value ?? ''}
            fullWidth
            error={Boolean(fieldState.error)}
            helperText={
              fieldState.error?.message ??
              (counterMax ? `${length} / ${counterMax} characters` : helperText)
            }
            FormHelperTextProps={{
              sx: counterMax && !fieldState.error ? { color: length > counterMax ? 'warning.dark' : undefined } : undefined,
            }}
            {...rest}
          />
        );
      }}
    />
  );
}
