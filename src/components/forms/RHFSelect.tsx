import { Controller, useFormContext, type FieldValues, type Path } from 'react-hook-form';
import MenuItem from '@mui/material/MenuItem';
import TextField, { type TextFieldProps } from '@mui/material/TextField';
import type { Option } from '@/constants/options';

type RHFSelectProps<T extends FieldValues> = Omit<TextFieldProps, 'name' | 'select'> & {
  name: Path<T>;
  options: readonly Option[];
  placeholder?: string;
};

export function RHFSelect<T extends FieldValues>({
  name,
  options,
  placeholder,
  helperText,
  ...rest
}: RHFSelectProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          value={field.value ?? ''}
          select
          fullWidth
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? helperText}
          SelectProps={{ displayEmpty: Boolean(placeholder) }}
          {...rest}
        >
          {placeholder && (
            <MenuItem value="" disabled>
              {placeholder}
            </MenuItem>
          )}
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
